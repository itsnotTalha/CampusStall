alter table public.projects
add column access_type text not null default 'paid'
check (access_type in ('free', 'paid'));

alter table public.projects
add column delivery_method text not null default 'upload'
check (delivery_method in ('upload', 'github', 'google_drive'));

alter table public.projects
add column external_delivery_url text;

alter table public.projects
add constraint projects_free_price_check
check (
  (access_type = 'free' and base_price_bdt = 0)
  or access_type = 'paid'
);

alter table public.projects
add constraint projects_delivery_check
check (
  (delivery_method = 'upload' and external_delivery_url is null)
  or
  (
    delivery_method in ('github', 'google_drive')
    and external_delivery_url is not null
    and char_length(external_delivery_url) between 8 and 1000
  )
);

grant insert (
  access_type,
  delivery_method,
  external_delivery_url
) on public.projects to authenticated;

grant update (
  access_type,
  delivery_method,
  external_delivery_url
) on public.projects to authenticated;