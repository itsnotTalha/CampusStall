create type public.customization_request_status as enum (
  'pending',
  'accepted',
  'declined',
  'in_progress',
  'completed',
  'cancelled'
);

create table public.project_customization_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  project_title text not null check (char_length(project_title) between 5 and 160),
  project_slug text not null check (project_slug ~ '^([a-z0-9]+-)*[a-z0-9]+$'),
  requested_changes text not null
    check (char_length(requested_changes) between 20 and 10000),
  budget_bdt integer not null check (budget_bdt between 1 and 10000000),
  deadline date not null,
  note text check (note is null or char_length(note) <= 2000),
  status public.customization_request_status not null default 'pending',
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (buyer_id <> seller_id)
);

create index project_customization_requests_buyer_idx
  on public.project_customization_requests (buyer_id, created_at desc);
create index project_customization_requests_seller_idx
  on public.project_customization_requests (seller_id, status, created_at desc);
create index project_customization_requests_project_idx
  on public.project_customization_requests (project_id, created_at desc);
create unique index project_customization_requests_active_unique_idx
  on public.project_customization_requests (project_id, buyer_id)
  where status in ('pending', 'accepted', 'in_progress');

create trigger project_customization_requests_set_updated_at
before update on public.project_customization_requests
for each row execute function public.set_updated_at();

alter table public.project_customization_requests enable row level security;

revoke all on table public.project_customization_requests
  from anon, authenticated;
grant select on table public.project_customization_requests
  to authenticated;

create policy "Customization participants view requests"
  on public.project_customization_requests for select
  to authenticated
  using ((select auth.uid()) in (buyer_id, seller_id));

create or replace function public.create_project_customization_request(
  target_project_id uuid,
  requested_changes text,
  proposed_budget_bdt integer,
  requested_deadline date,
  optional_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  existing_request_id uuid;
  listing record;
  new_request_id uuid;
  clean_changes text := btrim(requested_changes);
  clean_note text := nullif(btrim(optional_note), '');
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if clean_changes is null or char_length(clean_changes) not between 20 and 10000 then
    raise exception 'Requested changes must be between 20 and 10000 characters';
  end if;

  if proposed_budget_bdt is null or proposed_budget_bdt not between 1 and 10000000 then
    raise exception 'Budget is outside the allowed range';
  end if;

  if requested_deadline is null or requested_deadline < current_date then
    raise exception 'Deadline cannot be in the past';
  end if;

  if clean_note is not null and char_length(clean_note) > 2000 then
    raise exception 'Note is too long';
  end if;

  select projects.id, projects.seller_id, projects.title, projects.slug
  into listing
  from public.projects
  where projects.id = target_project_id
    and projects.status = 'published';

  if not found then
    raise exception 'Project is not available for customization';
  end if;

  if listing.seller_id = current_user_id then
    raise exception 'Sellers cannot request customization of their own project';
  end if;

  select project_customization_requests.id
  into existing_request_id
  from public.project_customization_requests
  where project_customization_requests.project_id = target_project_id
    and project_customization_requests.buyer_id = current_user_id
    and project_customization_requests.status in (
      'pending', 'accepted', 'in_progress'
    )
  order by project_customization_requests.created_at desc
  limit 1;

  if existing_request_id is not null then
    return existing_request_id;
  end if;

  begin
    insert into public.project_customization_requests (
      project_id,
      buyer_id,
      seller_id,
      project_title,
      project_slug,
      requested_changes,
      budget_bdt,
      deadline,
      note,
      status
    )
    values (
      listing.id,
      current_user_id,
      listing.seller_id,
      listing.title,
      listing.slug,
      clean_changes,
      proposed_budget_bdt,
      requested_deadline,
      clean_note,
      'pending'
    )
    returning id into new_request_id;
  exception
    when unique_violation then
      select project_customization_requests.id
      into new_request_id
      from public.project_customization_requests
      where project_customization_requests.project_id = target_project_id
        and project_customization_requests.buyer_id = current_user_id
        and project_customization_requests.status in (
          'pending', 'accepted', 'in_progress'
        )
      order by project_customization_requests.created_at desc
      limit 1;
  end;

  if new_request_id is null then
    raise exception 'Unable to create customization request';
  end if;

  return new_request_id;
end;
$$;

create or replace function public.transition_project_customization_request(
  target_request_id uuid,
  target_status public.customization_request_status
)
returns public.customization_request_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_request record;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select
    project_customization_requests.buyer_id,
    project_customization_requests.seller_id,
    project_customization_requests.status
  into target_request
  from public.project_customization_requests
  where project_customization_requests.id = target_request_id
  for update;

  if not found then
    raise exception 'Customization request not found';
  end if;

  if
    target_request.seller_id = current_user_id
    and target_request.status = 'pending'
    and target_status = 'accepted'
  then
    update public.project_customization_requests
    set status = 'accepted', accepted_at = timezone('utc', now())
    where id = target_request_id;
  elsif
    target_request.seller_id = current_user_id
    and target_request.status = 'pending'
    and target_status = 'declined'
  then
    update public.project_customization_requests
    set status = 'declined'
    where id = target_request_id;
  elsif
    target_request.seller_id = current_user_id
    and target_request.status = 'accepted'
    and target_status = 'in_progress'
  then
    update public.project_customization_requests
    set status = 'in_progress', started_at = timezone('utc', now())
    where id = target_request_id;
  elsif
    target_request.seller_id = current_user_id
    and target_request.status = 'in_progress'
    and target_status = 'completed'
  then
    update public.project_customization_requests
    set status = 'completed', completed_at = timezone('utc', now())
    where id = target_request_id;
  elsif
    target_request.buyer_id = current_user_id
    and target_request.status in ('pending', 'accepted')
    and target_status = 'cancelled'
  then
    update public.project_customization_requests
    set status = 'cancelled'
    where id = target_request_id;
  else
    raise exception 'Customization request status transition is not allowed';
  end if;

  return target_status;
end;
$$;

revoke execute on function public.create_project_customization_request(
  uuid, text, integer, date, text
) from public, anon, authenticated;
revoke execute on function public.transition_project_customization_request(
  uuid, public.customization_request_status
) from public, anon, authenticated;

grant execute on function public.create_project_customization_request(
  uuid, text, integer, date, text
) to authenticated;
grant execute on function public.transition_project_customization_request(
  uuid, public.customization_request_status
) to authenticated;
