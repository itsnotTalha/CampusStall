create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('moderator', 'admin')
  );
$$;

alter function private.is_admin() owner to postgres;
revoke execute on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.project_has_active_orders(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.project_packages
    join public.orders
      on orders.project_package_id = project_packages.id
    where project_packages.project_id = target_project_id
      and orders.status in ('pending', 'paid', 'delivered', 'completed')
  );
$$;

alter function private.project_has_active_orders(uuid) owner to postgres;
revoke execute on function private.project_has_active_orders(uuid)
  from public, anon, authenticated;
grant execute on function private.project_has_active_orders(uuid)
  to authenticated;

-- Keep legacy non-project policies working without retaining a
-- SECURITY DEFINER function in the exposed public schema.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke execute on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Sellers update unpublished projects" on public.projects;
create policy "Sellers update unpublished projects"
  on public.projects for update
  to authenticated
  using (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'rejected', 'archived')
    and not private.project_has_active_orders(id)
  )
  with check (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'archived')
  );

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
  on public.projects for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "Admins manage project packages" on public.project_packages;
create policy "Admins manage project packages"
  on public.project_packages for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "Admins manage project media" on public.project_media;
create policy "Admins manage project media"
  on public.project_media for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "Admins view project file metadata" on public.project_files;
create policy "Admins view project file metadata"
  on public.project_files for select
  to authenticated
  using ((select private.is_admin()));
