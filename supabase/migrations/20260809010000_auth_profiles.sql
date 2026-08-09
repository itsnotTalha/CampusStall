alter table public.profiles
  add column is_seller boolean not null default false;

create index profiles_sellers_idx
  on public.profiles (created_at desc)
  where is_seller;

create or replace function public.handle_new_user()
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

  insert into public.profiles (
    id,
    display_name,
    avatar_url,
    university,
    department,
    bio,
    is_seller
  )
  values (
    new.id,
    left(profile_name, 80),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    nullif(left(new.raw_user_meta_data ->> 'university', 120), ''),
    nullif(left(new.raw_user_meta_data ->> 'department', 80), ''),
    nullif(left(new.raw_user_meta_data ->> 'bio', 500), ''),
    coalesce(lower(new.raw_user_meta_data ->> 'is_seller') = 'true', false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

grant update (is_seller) on public.profiles to authenticated;
