# Supabase setup

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. From the project Connect dialog, set the project URL and publishable key. Never add a service-role key to browser environment variables.
3. Initialize and link the CLI, preview the migration, then apply it:

   ```bash
   npx supabase init
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push --dry-run
   npx supabase db push
   ```

4. After schema changes, regenerate the TypeScript database types:

   ```bash
   npx supabase gen types typescript --linked --schema public > src/types/database.ts
   ```

5. In Supabase Auth URL settings, set the Site URL and allow `/auth/confirm` for local and deployed origins.
6. For server-side email confirmation, update the Confirm signup template link to:

   ```text
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard
   ```

Marketplace listings continue to use local mock data.
