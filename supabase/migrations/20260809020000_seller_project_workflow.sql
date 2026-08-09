alter table public.projects
  add column requirements text not null default ''
  check (char_length(requirements) <= 4000);

grant insert (requirements) on public.projects to authenticated;
grant update (requirements) on public.projects to authenticated;

drop policy "Sellers update unpublished projects" on public.projects;
create policy "Sellers update unpublished projects"
  on public.projects for update
  to authenticated
  using (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'rejected', 'archived')
  )
  with check (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'archived')
  );

drop policy "Sellers delete inactive projects" on public.projects;
create policy "Sellers delete inactive projects"
  on public.projects for delete
  to authenticated
  using (
    (select auth.uid()) = seller_id
    and status in ('draft', 'pending', 'rejected', 'archived')
  );

create table public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique check (char_length(storage_path) between 1 and 500),
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  mime_type text not null check (char_length(mime_type) between 1 and 120),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  created_at timestamptz not null default timezone('utc', now())
);

create index project_files_project_idx
  on public.project_files (project_id, created_at desc);

alter table public.project_files enable row level security;

revoke all on table public.project_files from anon, authenticated;
grant select, insert, delete on table public.project_files to authenticated;

create policy "Project sellers view private files"
  on public.project_files for select
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_files.project_id
        and projects.seller_id = (select auth.uid())
    )
  );

create policy "Project sellers add private files"
  on public.project_files for insert
  to authenticated
  with check (
    split_part(storage_path, '/', 1) = (select auth.uid()::text)
    and split_part(storage_path, '/', 2) = project_id::text
    and split_part(storage_path, '/', 3) = 'archive'
    and split_part(storage_path, '/', 4) <> ''
    and split_part(storage_path, '/', 5) = ''
    and exists (
      select 1 from public.projects
      where projects.id = project_files.project_id
        and projects.seller_id = (select auth.uid())
        and projects.status in ('draft', 'pending', 'rejected')
    )
  );

drop policy "Project sellers create media" on public.project_media;
create policy "Project sellers create media"
  on public.project_media for insert
  to authenticated
  with check (
    split_part(storage_path, '/', 1) = (select auth.uid()::text)
    and split_part(storage_path, '/', 2) = project_id::text
    and split_part(storage_path, '/', 3) = 'media'
    and split_part(storage_path, '/', 4) <> ''
    and split_part(storage_path, '/', 5) = ''
    and exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.seller_id = (select auth.uid())
        and projects.status in ('draft', 'pending', 'rejected')
    )
  );

drop policy "Project sellers update media" on public.project_media;
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
    split_part(storage_path, '/', 1) = (select auth.uid()::text)
    and split_part(storage_path, '/', 2) = project_id::text
    and split_part(storage_path, '/', 3) = 'media'
    and split_part(storage_path, '/', 4) <> ''
    and split_part(storage_path, '/', 5) = ''
    and exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.seller_id = (select auth.uid())
        and projects.status in ('draft', 'pending', 'rejected')
    )
  );

create policy "Project sellers delete private files"
  on public.project_files for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_files.project_id
        and projects.seller_id = (select auth.uid())
    )
  );

insert into public.categories (name, slug, sort_order)
values
  ('AI / Machine Learning', 'ai-machine-learning', 10),
  ('Web Development', 'web-development', 20),
  ('Mobile Apps', 'mobile-apps', 30),
  ('IoT', 'iot', 40),
  ('Arduino', 'arduino', 50),
  ('Robotics', 'robotics', 60),
  ('Data Science', 'data-science', 70),
  ('Computer Vision', 'computer-vision', 80),
  ('Cybersecurity', 'cybersecurity', 90),
  ('Electronics', 'electronics', 100),
  ('UI / UX Design', 'ui-ux-design', 110)
on conflict do nothing;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'project-media',
    'project-media',
    true,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'project-archives',
    'project-archives',
    false,
    52428800,
    array[
      'application/zip',
      'application/x-zip-compressed',
      'application/x-tar',
      'application/gzip',
      'application/x-gzip',
      'application/x-7z-compressed'
    ]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Sellers upload project media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-media'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and (storage.foldername(name))[3] = 'media'
    and (storage.foldername(name))[4] is null
    and exists (
      select 1 from public.projects
      where projects.id::text = (storage.foldername(name))[2]
        and projects.seller_id = (select auth.uid())
        and projects.status in ('draft', 'pending', 'rejected')
    )
  );

create policy "Sellers view owned project media objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'project-media'
    and owner_id = (select auth.uid()::text)
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Sellers delete owned project media objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-media'
    and owner_id = (select auth.uid()::text)
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Sellers upload private project archives"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-archives'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and (storage.foldername(name))[3] = 'archive'
    and (storage.foldername(name))[4] is null
    and exists (
      select 1 from public.projects
      where projects.id::text = (storage.foldername(name))[2]
        and projects.seller_id = (select auth.uid())
        and projects.status in ('draft', 'pending', 'rejected')
    )
  );

create policy "Sellers view owned private project archives"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'project-archives'
    and owner_id = (select auth.uid()::text)
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Sellers delete owned private project archives"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-archives'
    and owner_id = (select auth.uid()::text)
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
