-- Allow conversation updates needed by the message insert trigger.
-- This keeps participants able to create/update activity in their own threads.
drop policy if exists "Participants update conversations" on public.conversations;

create policy "Participants update conversations"
  on public.conversations for update
  to authenticated
  using ((select auth.uid()) in (participant_a_id, participant_b_id))
  with check ((select auth.uid()) in (participant_a_id, participant_b_id));