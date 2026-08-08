create extension if not exists pgcrypto with schema extensions;

create type public.profile_role as enum ('student', 'moderator', 'admin');
create type public.listing_status as enum ('draft', 'pending', 'published', 'rejected', 'archived');
create type public.difficulty_level as enum ('beginner', 'intermediate', 'advanced');
create type public.license_type as enum ('learning_personal', 'single_project', 'commercial');
create type public.package_type as enum ('source_only', 'complete', 'complete_support', 'custom');
create type public.media_kind as enum ('image', 'video', 'demo');
create type public.order_kind as enum ('project', 'service');
create type public.order_status as enum ('pending', 'paid', 'delivered', 'completed', 'cancelled', 'refunded');
create type public.request_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type public.request_visibility as enum ('public', 'private');
create type public.message_kind as enum ('text', 'system', 'attachment');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create function public.set_listing_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = timezone('utc', now());
  elsif new.status <> 'published' then
    new.published_at = null;
  end if;
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text check (username is null or char_length(username) between 3 and 40),
  display_name text not null check (char_length(display_name) between 2 and 80),
  avatar_url text,
  department text,
  university text,
  bio text check (bio is null or char_length(bio) <= 500),
  role public.profile_role not null default 'student',
  is_verified boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index profiles_username_unique_idx
  on public.profiles (lower(username))
  where username is not null;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_name text;
begin
  profile_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'CampusStall student'
  );

  if char_length(profile_name) < 2 then
    profile_name := 'CampusStall student';
  end if;

  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(profile_name, 80),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin()
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

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null check (char_length(name) between 2 and 80),
  slug text not null check (slug ~ '^([a-z0-9]+-)*[a-z0-9]+$'),
  description text,
  icon_key text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index categories_slug_unique_idx on public.categories (lower(slug));
create index categories_active_sort_idx on public.categories (is_active, sort_order, name);
create index categories_parent_idx on public.categories (parent_id);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 160),
  slug text not null check (slug ~ '^([a-z0-9]+-)*[a-z0-9]+$'),
  description text not null check (char_length(description) between 20 and 20000),
  department text not null check (char_length(department) between 2 and 80),
  difficulty public.difficulty_level not null,
  technology_tags text[] not null default '{}',
  base_price_bdt integer not null check (base_price_bdt >= 0),
  status public.listing_status not null default 'draft',
  license_options public.license_type[] not null default array['learning_personal']::public.license_type[],
  included_assets text[] not null default '{}',
  support_duration_days integer not null default 0 check (support_duration_days between 0 and 365),
  preview_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(preview_metadata) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (cardinality(license_options) > 0)
);

create unique index projects_slug_unique_idx on public.projects (lower(slug));
create index projects_seller_idx on public.projects (seller_id, created_at desc);
create index projects_category_status_idx on public.projects (category_id, status);
create index projects_published_idx on public.projects (published_at desc) where status = 'published';
create index projects_price_idx on public.projects (base_price_bdt) where status = 'published';
create index projects_technology_tags_idx on public.projects using gin (technology_tags);
create index projects_license_options_idx on public.projects using gin (license_options);

create table public.project_packages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  package_type public.package_type not null,
  description text not null,
  price_bdt integer not null check (price_bdt >= 0),
  license_type public.license_type not null,
  included_assets text[] not null default '{}',
  support_duration_days integer not null default 0 check (support_duration_days between 0 and 365),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (project_id, package_type, license_type)
);

create index project_packages_project_active_idx
  on public.project_packages (project_id, is_active, price_bdt);

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_type public.media_kind not null,
  storage_path text not null check (char_length(storage_path) between 1 and 500),
  title text,
  alt_text text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  preview_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(preview_metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index project_media_project_sort_idx
  on public.project_media (project_id, sort_order, created_at);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 160),
  slug text not null check (slug ~ '^([a-z0-9]+-)*[a-z0-9]+$'),
  description text not null check (char_length(description) between 20 and 20000),
  department text not null check (char_length(department) between 2 and 80),
  technology_tags text[] not null default '{}',
  starting_price_bdt integer not null check (starting_price_bdt >= 0),
  status public.listing_status not null default 'draft',
  included_assets text[] not null default '{}',
  support_duration_days integer not null default 0 check (support_duration_days between 0 and 365),
  service_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(service_metadata) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index services_slug_unique_idx on public.services (lower(slug));
create index services_seller_idx on public.services (seller_id, created_at desc);
create index services_category_status_idx on public.services (category_id, status);
create index services_published_idx on public.services (published_at desc) where status = 'published';
create index services_price_idx on public.services (starting_price_bdt) where status = 'published';
create index services_technology_tags_idx on public.services using gin (technology_tags);

create table public.service_packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  description text not null,
  price_bdt integer not null check (price_bdt >= 0),
  delivery_days integer not null check (delivery_days between 0 and 365),
  revisions integer not null default 0 check (revisions between 0 and 50),
  included_items text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index service_packages_service_active_idx
  on public.service_packages (service_id, is_active, price_bdt);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  item_type public.order_kind not null,
  project_package_id uuid references public.project_packages(id) on delete restrict,
  service_package_id uuid references public.service_packages(id) on delete restrict,
  status public.order_status not null default 'pending',
  subtotal_bdt integer not null check (subtotal_bdt >= 0),
  platform_fee_bdt integer not null default 0 check (platform_fee_bdt >= 0),
  total_bdt integer not null check (total_bdt >= 0),
  currency char(3) not null default 'BDT' check (currency = 'BDT'),
  license_type public.license_type,
  fulfillment_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(fulfillment_metadata) = 'object'),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (buyer_id <> seller_id),
  check (total_bdt = subtotal_bdt + platform_fee_bdt),
  check (
    (item_type = 'project' and project_package_id is not null and service_package_id is null and license_type is not null)
    or
    (item_type = 'service' and service_package_id is not null and project_package_id is null and license_type is null)
  )
);

create index orders_buyer_created_idx on public.orders (buyer_id, created_at desc);
create index orders_seller_created_idx on public.orders (seller_id, created_at desc);
create index orders_status_created_idx on public.orders (status, created_at desc);
create index orders_project_package_idx on public.orders (project_package_id) where project_package_id is not null;
create index orders_service_package_idx on public.orders (service_package_id) where service_package_id is not null;

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  project_id uuid references public.projects(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text check (title is null or char_length(title) <= 120),
  body text not null check (char_length(body) between 10 and 2000),
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (order_id, reviewer_id),
  check (num_nonnulls(project_id, service_id) = 1)
);

create index reviews_project_published_idx on public.reviews (project_id, created_at desc) where is_published;
create index reviews_service_published_idx on public.reviews (service_id, created_at desc) where is_published;
create index reviews_reviewer_idx on public.reviews (reviewer_id, created_at desc);

create table public.digital_perks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(title) between 3 and 160),
  slug text not null check (slug ~ '^([a-z0-9]+-)*[a-z0-9]+$'),
  provider_name text not null,
  description text not null,
  destination_url text not null check (destination_url ~ '^https://'),
  eligibility text,
  terms text,
  status public.listing_status not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create unique index digital_perks_slug_unique_idx on public.digital_perks (lower(slug));
create index digital_perks_public_idx
  on public.digital_perks (published_at desc, ends_at)
  where status = 'published';
create index digital_perks_category_idx on public.digital_perks (category_id, status);

create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  digital_perk_id uuid references public.digital_perks(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  check (num_nonnulls(project_id, service_id, digital_perk_id) = 1)
);

create unique index saved_items_project_unique_idx
  on public.saved_items (user_id, project_id) where project_id is not null;
create unique index saved_items_service_unique_idx
  on public.saved_items (user_id, service_id) where service_id is not null;
create unique index saved_items_perk_unique_idx
  on public.saved_items (user_id, digital_perk_id) where digital_perk_id is not null;
create index saved_items_user_created_idx on public.saved_items (user_id, created_at desc);

create table public.project_requests (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references public.profiles(id) on delete restrict,
  assigned_to uuid references public.profiles(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null check (char_length(title) between 5 and 160),
  description text not null check (char_length(description) between 20 and 10000),
  department text,
  technology_tags text[] not null default '{}',
  budget_min_bdt integer check (budget_min_bdt is null or budget_min_bdt >= 0),
  budget_max_bdt integer check (budget_max_bdt is null or budget_max_bdt >= 0),
  status public.request_status not null default 'open',
  visibility public.request_visibility not null default 'public',
  desired_completion_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (budget_max_bdt is null or budget_min_bdt is null or budget_max_bdt >= budget_min_bdt),
  check (assigned_to is null or assigned_to <> requested_by)
);

create index project_requests_requester_idx on public.project_requests (requested_by, created_at desc);
create index project_requests_assignee_idx on public.project_requests (assigned_to, status) where assigned_to is not null;
create index project_requests_public_idx on public.project_requests (status, created_at desc) where visibility = 'public';
create index project_requests_category_idx on public.project_requests (category_id, status);
create index project_requests_technology_tags_idx on public.project_requests using gin (technology_tags);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete restrict,
  participant_a_id uuid not null references public.profiles(id) on delete restrict,
  participant_b_id uuid not null references public.profiles(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  project_request_id uuid references public.project_requests(id) on delete set null,
  last_message_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (participant_a_id <> participant_b_id),
  check (created_by in (participant_a_id, participant_b_id))
);

create index conversations_participant_a_idx on public.conversations (participant_a_id, last_message_at desc nulls last);
create index conversations_participant_b_idx on public.conversations (participant_b_id, last_message_at desc nulls last);
create index conversations_order_idx on public.conversations (order_id) where order_id is not null;
create index conversations_request_idx on public.conversations (project_request_id) where project_request_id is not null;

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  message_type public.message_kind not null default 'text',
  body text not null check (char_length(body) between 1 and 5000),
  attachment_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(attachment_metadata) = 'object'),
  read_at timestamptz,
  edited_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index messages_sender_created_idx on public.messages (sender_id, created_at desc);

create function public.can_review_order(
  target_order_id uuid,
  target_project_id uuid,
  target_service_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.orders
    left join public.project_packages
      on project_packages.id = orders.project_package_id
    left join public.service_packages
      on service_packages.id = orders.service_package_id
    where orders.id = target_order_id
      and orders.buyer_id = (select auth.uid())
      and orders.status = 'completed'
      and (
        (target_project_id is not null and project_packages.project_id = target_project_id)
        or
        (target_service_id is not null and service_packages.service_id = target_service_id)
      )
  );
$$;

create function public.update_conversation_last_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger projects_set_published_at before insert or update of status on public.projects
  for each row execute function public.set_listing_published_at();
create trigger project_packages_set_updated_at before update on public.project_packages
  for each row execute function public.set_updated_at();
create trigger project_media_set_updated_at before update on public.project_media
  for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger services_set_published_at before insert or update of status on public.services
  for each row execute function public.set_listing_published_at();
create trigger service_packages_set_updated_at before update on public.service_packages
  for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();
create trigger digital_perks_set_updated_at before update on public.digital_perks
  for each row execute function public.set_updated_at();
create trigger digital_perks_set_published_at before insert or update of status on public.digital_perks
  for each row execute function public.set_listing_published_at();
create trigger project_requests_set_updated_at before update on public.project_requests
  for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations
  for each row execute function public.set_updated_at();
create trigger messages_update_conversation
  after insert on public.messages
  for each row execute function public.update_conversation_last_message();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_packages enable row level security;
alter table public.project_media enable row level security;
alter table public.services enable row level security;
alter table public.service_packages enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.saved_items enable row level security;
alter table public.project_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.digital_perks enable row level security;

revoke all on table public.profiles, public.categories, public.projects,
  public.project_packages, public.project_media, public.services,
  public.service_packages, public.orders, public.reviews, public.saved_items,
  public.project_requests, public.conversations, public.messages,
  public.digital_perks from anon, authenticated;

grant select on table public.profiles, public.categories, public.projects,
  public.project_packages, public.project_media, public.services,
  public.service_packages, public.reviews, public.digital_perks to anon, authenticated;
grant select on table public.orders, public.saved_items, public.project_requests,
  public.conversations, public.messages to authenticated;

grant update (username, display_name, avatar_url, department, university, bio)
  on public.profiles to authenticated;
grant insert, update, delete on public.categories to authenticated;
grant insert (seller_id, category_id, title, slug, description, department,
  difficulty, technology_tags, base_price_bdt, status, license_options,
  included_assets, support_duration_days, preview_metadata)
  on public.projects to authenticated;
grant update (category_id, title, slug, description, department, difficulty,
  technology_tags, base_price_bdt, status, license_options, included_assets,
  support_duration_days, preview_metadata)
  on public.projects to authenticated;
grant delete on public.projects to authenticated;
grant insert (project_id, name, package_type, description, price_bdt,
  license_type, included_assets, support_duration_days, is_active)
  on public.project_packages to authenticated;
grant update (name, package_type, description, price_bdt, license_type,
  included_assets, support_duration_days, is_active)
  on public.project_packages to authenticated;
grant delete on public.project_packages to authenticated;
grant insert (project_id, media_type, storage_path, title, alt_text, sort_order,
  is_public, preview_metadata)
  on public.project_media to authenticated;
grant update (media_type, storage_path, title, alt_text, sort_order, is_public,
  preview_metadata)
  on public.project_media to authenticated;
grant delete on public.project_media to authenticated;
grant insert (seller_id, category_id, title, slug, description, department,
  technology_tags, starting_price_bdt, status, included_assets,
  support_duration_days, service_metadata)
  on public.services to authenticated;
grant update (category_id, title, slug, description, department,
  technology_tags, starting_price_bdt, status, included_assets,
  support_duration_days, service_metadata)
  on public.services to authenticated;
grant delete on public.services to authenticated;
grant insert (service_id, name, description, price_bdt, delivery_days,
  revisions, included_items, is_active)
  on public.service_packages to authenticated;
grant update (name, description, price_bdt, delivery_days, revisions,
  included_items, is_active)
  on public.service_packages to authenticated;
grant delete on public.service_packages to authenticated;
grant insert (order_id, reviewer_id, project_id, service_id, rating, title, body)
  on public.reviews to authenticated;
grant update (rating, title, body) on public.reviews to authenticated;
grant delete on public.reviews to authenticated;
grant insert (user_id, project_id, service_id, digital_perk_id)
  on public.saved_items to authenticated;
grant delete on public.saved_items to authenticated;
grant insert (requested_by, category_id, title, description, department,
  technology_tags, budget_min_bdt, budget_max_bdt, status, visibility,
  desired_completion_date)
  on public.project_requests to authenticated;
grant update (category_id, title, description, department, technology_tags,
  budget_min_bdt, budget_max_bdt, status, visibility, desired_completion_date)
  on public.project_requests to authenticated;
grant delete on public.project_requests to authenticated;
grant insert (created_by, participant_a_id, participant_b_id, order_id,
  project_request_id)
  on public.conversations to authenticated;
grant insert (conversation_id, sender_id, message_type, body,
  attachment_metadata)
  on public.messages to authenticated;
grant update (read_at) on public.messages to authenticated;
grant insert, update, delete on public.digital_perks to authenticated;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.set_listing_published_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.update_conversation_last_message() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;
revoke execute on function public.can_review_order(uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.can_review_order(uuid, uuid, uuid) to authenticated;

create policy "Public profiles are readable"
  on public.profiles for select
  to anon, authenticated
  using (true);
create policy "Users update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Active categories are public"
  on public.categories for select
  to anon, authenticated
  using (is_active);
create policy "Admins view inactive categories"
  on public.categories for select
  to authenticated
  using (public.is_admin());
create policy "Admins manage categories"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Published projects are public"
  on public.projects for select
  to anon, authenticated
  using (status = 'published');
create policy "Sellers view their projects"
  on public.projects for select
  to authenticated
  using ((select auth.uid()) = seller_id);
create policy "Sellers create projects"
  on public.projects for insert
  to authenticated
  with check (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending')
  );
create policy "Sellers update unpublished projects"
  on public.projects for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'archived')
  );
create policy "Sellers delete inactive projects"
  on public.projects for delete
  to authenticated
  using (
    (select auth.uid()) = seller_id
    and status in ('draft', 'rejected', 'archived')
  );
create policy "Admins manage projects"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Published project packages are public"
  on public.project_packages for select
  to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.projects
      where projects.id = project_packages.project_id
        and projects.status = 'published'
    )
  );
create policy "Project sellers view packages"
  on public.project_packages for select
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_packages.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Project sellers create packages"
  on public.project_packages for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_packages.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Project sellers update packages"
  on public.project_packages for update
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_packages.project_id
        and projects.seller_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_packages.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Project sellers delete packages"
  on public.project_packages for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_packages.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Admins manage project packages"
  on public.project_packages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Published project media are public"
  on public.project_media for select
  to anon, authenticated
  using (
    is_public
    and exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.status = 'published'
    )
  );
create policy "Project sellers view media"
  on public.project_media for select
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Project sellers create media"
  on public.project_media for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Project sellers update media"
  on public.project_media for update
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.seller_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Project sellers delete media"
  on public.project_media for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.seller_id = (select auth.uid())
    )
  );
create policy "Admins manage project media"
  on public.project_media for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Published services are public"
  on public.services for select
  to anon, authenticated
  using (status = 'published');
create policy "Sellers view their services"
  on public.services for select
  to authenticated
  using ((select auth.uid()) = seller_id);
create policy "Sellers create services"
  on public.services for insert
  to authenticated
  with check (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending')
  );
create policy "Sellers update unpublished services"
  on public.services for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'archived')
  );
create policy "Sellers delete inactive services"
  on public.services for delete
  to authenticated
  using (
    (select auth.uid()) = seller_id
    and status in ('draft', 'rejected', 'archived')
  );
create policy "Admins manage services"
  on public.services for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Published service packages are public"
  on public.service_packages for select
  to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.services
      where services.id = service_packages.service_id
        and services.status = 'published'
    )
  );
create policy "Service sellers view packages"
  on public.service_packages for select
  to authenticated
  using (
    exists (
      select 1 from public.services
      where services.id = service_packages.service_id
        and services.seller_id = (select auth.uid())
    )
  );
create policy "Service sellers create packages"
  on public.service_packages for insert
  to authenticated
  with check (
    exists (
      select 1 from public.services
      where services.id = service_packages.service_id
        and services.seller_id = (select auth.uid())
    )
  );
create policy "Service sellers update packages"
  on public.service_packages for update
  to authenticated
  using (
    exists (
      select 1 from public.services
      where services.id = service_packages.service_id
        and services.seller_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.services
      where services.id = service_packages.service_id
        and services.seller_id = (select auth.uid())
    )
  );
create policy "Service sellers delete packages"
  on public.service_packages for delete
  to authenticated
  using (
    exists (
      select 1 from public.services
      where services.id = service_packages.service_id
        and services.seller_id = (select auth.uid())
    )
  );
create policy "Admins manage service packages"
  on public.service_packages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Order participants view orders"
  on public.orders for select
  to authenticated
  using ((select auth.uid()) in (buyer_id, seller_id));
create policy "Admins view orders"
  on public.orders for select
  to authenticated
  using (public.is_admin());

create policy "Published reviews are public"
  on public.reviews for select
  to anon, authenticated
  using (is_published);
create policy "Reviewers view their reviews"
  on public.reviews for select
  to authenticated
  using ((select auth.uid()) = reviewer_id);
create policy "Buyers create completed-order reviews"
  on public.reviews for insert
  to authenticated
  with check (
    reviewer_id = (select auth.uid())
    and public.can_review_order(order_id, project_id, service_id)
  );
create policy "Reviewers update their reviews"
  on public.reviews for update
  to authenticated
  using ((select auth.uid()) = reviewer_id)
  with check ((select auth.uid()) = reviewer_id);
create policy "Reviewers delete their reviews"
  on public.reviews for delete
  to authenticated
  using ((select auth.uid()) = reviewer_id);
create policy "Admins view all reviews"
  on public.reviews for select
  to authenticated
  using (public.is_admin());

create policy "Users view saved items"
  on public.saved_items for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users save items"
  on public.saved_items for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users remove saved items"
  on public.saved_items for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Authenticated users view public requests"
  on public.project_requests for select
  to authenticated
  using (visibility = 'public');
create policy "Participants view private requests"
  on public.project_requests for select
  to authenticated
  using ((select auth.uid()) in (requested_by, assigned_to));
create policy "Users create project requests"
  on public.project_requests for insert
  to authenticated
  with check (
    (select auth.uid()) = requested_by
    and assigned_to is null
    and status = 'open'
  );
create policy "Requesters update project requests"
  on public.project_requests for update
  to authenticated
  using ((select auth.uid()) = requested_by)
  with check ((select auth.uid()) = requested_by);
create policy "Requesters delete project requests"
  on public.project_requests for delete
  to authenticated
  using ((select auth.uid()) = requested_by and status in ('open', 'cancelled'));
create policy "Admins manage project requests"
  on public.project_requests for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Participants view conversations"
  on public.conversations for select
  to authenticated
  using ((select auth.uid()) in (participant_a_id, participant_b_id));
create policy "Users create conversations"
  on public.conversations for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (select auth.uid()) in (participant_a_id, participant_b_id)
    and (
      order_id is null
      or exists (
        select 1 from public.orders
        where orders.id = conversations.order_id
          and (
            (orders.buyer_id = participant_a_id and orders.seller_id = participant_b_id)
            or
            (orders.buyer_id = participant_b_id and orders.seller_id = participant_a_id)
          )
      )
    )
    and (
      project_request_id is null
      or exists (
        select 1 from public.project_requests
        where project_requests.id = conversations.project_request_id
          and project_requests.assigned_to is not null
          and (
            (project_requests.requested_by = participant_a_id and project_requests.assigned_to = participant_b_id)
            or
            (project_requests.requested_by = participant_b_id and project_requests.assigned_to = participant_a_id)
          )
      )
    )
  );

create policy "Participants view messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and (select auth.uid()) in (
          conversations.participant_a_id,
          conversations.participant_b_id
        )
    )
  );
create policy "Participants send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and (select auth.uid()) in (
          conversations.participant_a_id,
          conversations.participant_b_id
        )
    )
  );
create policy "Participants mark messages read"
  on public.messages for update
  to authenticated
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and (select auth.uid()) in (
          conversations.participant_a_id,
          conversations.participant_b_id
        )
    )
  )
  with check (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and (select auth.uid()) in (
          conversations.participant_a_id,
          conversations.participant_b_id
        )
    )
  );

create policy "Published current perks are public"
  on public.digital_perks for select
  to anon, authenticated
  using (
    status = 'published'
    and (starts_at is null or starts_at <= timezone('utc', now()))
    and (ends_at is null or ends_at > timezone('utc', now()))
  );
create policy "Admins manage digital perks"
  on public.digital_perks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
