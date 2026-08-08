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

The UI continues to use local mock data until a later migration task.
