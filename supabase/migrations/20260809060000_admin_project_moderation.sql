alter table public.projects
  add column rejection_reason text
  check (
    rejection_reason is null
    or char_length(trim(rejection_reason)) between 5 and 500
  );

grant update (rejection_reason) on public.projects to authenticated;

create policy "Admins view project file metadata"
  on public.project_files for select
  to authenticated
  using (public.is_admin());
