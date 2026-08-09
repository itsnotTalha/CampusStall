create unique index orders_active_project_purchase_unique_idx
  on public.orders (buyer_id, project_package_id)
  where project_package_id is not null
    and status in ('pending', 'paid', 'delivered', 'completed');

drop policy "Sellers update unpublished projects" on public.projects;
create policy "Sellers update unpublished projects"
  on public.projects for update
  to authenticated
  using (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'rejected', 'archived')
    and not exists (
      select 1
      from public.project_packages
      join public.orders
        on orders.project_package_id = project_packages.id
      where project_packages.project_id = projects.id
        and orders.status in ('pending', 'paid', 'delivered', 'completed')
    )
  )
  with check (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'archived')
  );

drop policy "Project sellers delete private files" on public.project_files;
create policy "Project sellers delete private files"
  on public.project_files for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_files.project_id
        and projects.seller_id = (select auth.uid())
    )
    and not exists (
      select 1
      from public.project_packages
      join public.orders
        on orders.project_package_id = project_packages.id
      where project_packages.project_id = project_files.project_id
        and orders.status in ('pending', 'paid', 'delivered', 'completed')
    )
  );

drop policy "Sellers delete owned private project archives" on storage.objects;
create policy "Sellers delete owned private project archives"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-archives'
    and owner_id = (select auth.uid()::text)
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and not exists (
      select 1
      from public.project_files
      join public.project_packages
        on project_packages.project_id = project_files.project_id
      join public.orders
        on orders.project_package_id = project_packages.id
      where project_files.storage_path = storage.objects.name
        and orders.status in ('pending', 'paid', 'delivered', 'completed')
    )
  );

create or replace function public.create_demo_project_order(
  target_package_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  existing_order_id uuid;
  listing record;
  new_order_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select
    project_packages.id as package_id,
    project_packages.name as package_name,
    project_packages.package_type,
    project_packages.price_bdt,
    project_packages.license_type,
    project_packages.included_assets,
    project_packages.support_duration_days,
    projects.id as project_id,
    projects.seller_id,
    projects.title as project_title,
    projects.slug as project_slug,
    projects.preview_metadata,
    profiles.display_name as seller_name,
    buyer_profile.display_name as buyer_name
  into listing
  from public.project_packages
  join public.projects on projects.id = project_packages.project_id
  join public.profiles on profiles.id = projects.seller_id
  join public.profiles as buyer_profile on buyer_profile.id = current_user_id
  where project_packages.id = target_package_id
    and project_packages.is_active
    and projects.status = 'published'
    and exists (
      select 1
      from public.project_files
      join storage.objects
        on storage.objects.name = project_files.storage_path
       and storage.objects.bucket_id = 'project-archives'
      where project_files.project_id = projects.id
    );

  if not found then
    raise exception 'Project package is not available';
  end if;

  if listing.seller_id = current_user_id then
    raise exception 'Sellers cannot purchase their own project';
  end if;

  select orders.id
  into existing_order_id
  from public.orders
  where orders.buyer_id = current_user_id
    and orders.project_package_id = target_package_id
    and orders.status in ('pending', 'paid', 'delivered', 'completed')
  order by orders.created_at desc
  limit 1;

  if existing_order_id is not null then
    return existing_order_id;
  end if;

  begin
    insert into public.orders (
      buyer_id,
      seller_id,
      item_type,
      project_package_id,
      status,
      subtotal_bdt,
      platform_fee_bdt,
      total_bdt,
      currency,
      license_type,
      fulfillment_metadata
    )
    values (
      current_user_id,
      listing.seller_id,
      'project',
      listing.package_id,
      'pending',
      listing.price_bdt,
      0,
      listing.price_bdt,
      'BDT',
      listing.license_type,
      jsonb_build_object(
        'payment_mode', 'demo',
        'project_id', listing.project_id,
        'project_title', listing.project_title,
        'project_slug', listing.project_slug,
        'package_name', listing.package_name,
        'package_type', listing.package_type,
        'seller_name', listing.seller_name,
        'buyer_name', listing.buyer_name,
        'included_assets', listing.included_assets,
        'support_duration_days', listing.support_duration_days,
        'demo_url', listing.preview_metadata -> 'demo_url'
      )
    )
    returning id into new_order_id;
  exception
    when unique_violation then
      select orders.id
      into new_order_id
      from public.orders
      where orders.buyer_id = current_user_id
        and orders.project_package_id = target_package_id
        and orders.status in ('pending', 'paid', 'delivered', 'completed')
      order by orders.created_at desc
      limit 1;
  end;

  if new_order_id is null then
    raise exception 'Unable to create order';
  end if;

  return new_order_id;
end;
$$;

create or replace function public.complete_demo_project_payment(
  target_order_id uuid
)
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_status public.order_status;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select orders.status
  into current_status
  from public.orders
  where orders.id = target_order_id
    and orders.buyer_id = current_user_id
    and orders.item_type = 'project'
    and exists (
      select 1
      from public.project_packages
      join public.project_files
        on project_files.project_id = project_packages.project_id
      join storage.objects
        on storage.objects.name = project_files.storage_path
       and storage.objects.bucket_id = 'project-archives'
      where project_packages.id = orders.project_package_id
    )
  for update;

  if current_status is null then
    raise exception 'Order not found';
  end if;

  if current_status in ('paid', 'delivered', 'completed') then
    return current_status;
  end if;

  if current_status <> 'pending' then
    raise exception 'This order cannot be paid';
  end if;

  update public.orders
  set
    status = 'paid',
    fulfillment_metadata = fulfillment_metadata || jsonb_build_object(
      'demo_payment_completed', true,
      'demo_paid_at', timezone('utc', now())
    )
  where id = target_order_id;

  return 'paid';
end;
$$;

create or replace function public.transition_project_order(
  target_order_id uuid,
  target_status public.order_status
)
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_order record;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select orders.buyer_id, orders.seller_id, orders.status, orders.item_type
  into target_order
  from public.orders
  where orders.id = target_order_id
  for update;

  if not found or target_order.item_type <> 'project' then
    raise exception 'Order not found';
  end if;

  if
    target_order.buyer_id = current_user_id
    and target_order.status = 'pending'
    and target_status = 'cancelled'
  then
    update public.orders set status = 'cancelled' where id = target_order_id;
  elsif
    target_order.seller_id = current_user_id
    and target_order.status = 'paid'
    and target_status = 'delivered'
  then
    update public.orders set status = 'delivered' where id = target_order_id;
  elsif
    target_order.buyer_id = current_user_id
    and target_order.status = 'delivered'
    and target_status = 'completed'
  then
    update public.orders
    set status = 'completed', completed_at = timezone('utc', now())
    where id = target_order_id;
  else
    raise exception 'Order status transition is not allowed';
  end if;

  return target_status;
end;
$$;

revoke execute on function public.create_demo_project_order(uuid)
  from public, anon, authenticated;
revoke execute on function public.complete_demo_project_payment(uuid)
  from public, anon, authenticated;
revoke execute on function public.transition_project_order(uuid, public.order_status)
  from public, anon, authenticated;

grant execute on function public.create_demo_project_order(uuid)
  to authenticated;
grant execute on function public.complete_demo_project_payment(uuid)
  to authenticated;
grant execute on function public.transition_project_order(uuid, public.order_status)
  to authenticated;

create or replace function public.can_access_project_file(
  target_storage_path text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is not null
    and exists (
      select 1
      from public.project_files
      join public.project_packages
        on project_packages.project_id = project_files.project_id
      join public.orders
        on orders.project_package_id = project_packages.id
      where project_files.storage_path = target_storage_path
        and orders.buyer_id = auth.uid()
        and orders.status in ('paid', 'delivered', 'completed')
    );
$$;

revoke execute on function public.can_access_project_file(text)
  from public, anon, authenticated;
grant execute on function public.can_access_project_file(text)
  to authenticated;

create or replace function public.get_entitled_project_file(
  target_order_id uuid
)
returns table (
  storage_path text,
  original_filename text
)
language sql
stable
security definer
set search_path = ''
as $$
  select project_files.storage_path, project_files.original_filename
  from public.orders
  join public.project_packages
    on project_packages.id = orders.project_package_id
  join public.project_files
    on project_files.project_id = project_packages.project_id
  where orders.id = target_order_id
    and orders.buyer_id = auth.uid()
    and orders.item_type = 'project'
    and orders.status in ('paid', 'delivered', 'completed')
  order by project_files.created_at desc
  limit 1;
$$;

revoke execute on function public.get_entitled_project_file(uuid)
  from public, anon, authenticated;
grant execute on function public.get_entitled_project_file(uuid)
  to authenticated;

create policy "Entitled buyers view purchased project files"
  on public.project_files for select
  to authenticated
  using (public.can_access_project_file(storage_path));

create policy "Entitled buyers access purchased project archives"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'project-archives'
    and public.can_access_project_file(name)
  );
