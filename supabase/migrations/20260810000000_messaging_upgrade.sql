-- Add encryption support to profiles
alter table public.profiles
  add column encryption_public_key text;

-- Add encryption IV to messages
alter table public.messages
  add column encryption_iv text;

-- Enable realtime for messages and conversations
alter publication supabase_realtime add table public.messages, public.conversations;

-- Create message attachments storage bucket
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'message-attachments',
  'message-attachments',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- RLS for message attachments (users can upload to conversations they're in)
create policy "Users upload message attachments"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'message-attachments'
    and exists (
      select 1 from public.conversations
      where (
        (storage.foldername(name))[1]::uuid = conversations.id
        and (select auth.uid()) in (
          conversations.participant_a_id,
          conversations.participant_b_id
        )
      )
    )
  );

-- Users can view their own message attachments
create policy "Users view message attachments"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'message-attachments'
    and exists (
      select 1 from public.conversations
      where (
        (storage.foldername(name))[1]::uuid = conversations.id
        and (select auth.uid()) in (
          conversations.participant_a_id,
          conversations.participant_b_id
        )
      )
    )
  );

-- Users can delete their own message attachments
create policy "Users delete message attachments"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'message-attachments'
    and owner_id = (select auth.uid()::text)
    and exists (
      select 1 from public.conversations
      where (
        (storage.foldername(name))[1]::uuid = conversations.id
        and (select auth.uid()) in (
          conversations.participant_a_id,
          conversations.participant_b_id
        )
      )
    )
  );

-- Search users by username or email
create or replace function public.search_messaging_users(
  query text
)
returns table (
  id uuid,
  display_name text,
  username text,
  avatar_url text,
  is_verified boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  search_query text := '%' || lower(query) || '%';
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if char_length(query) < 3 then
    raise exception 'Search query must be at least 3 characters';
  end if;

  return query
  select
    p.id,
    p.display_name,
    p.username,
    p.avatar_url,
    p.is_verified
  from public.profiles p
  where
    p.id <> current_user_id
    and (
      lower(coalesce(p.username, '')) ilike search_query
      or lower(p.display_name) ilike search_query
      or lower(coalesce((select u.email from auth.users u where u.id = p.id), '')) ilike search_query
    )
  limit 8;
end;
$$;

-- Create direct conversation (no project/order/request context)
create or replace function public.get_or_create_direct_conversation(
  target_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  conversation_id uuid;
  a_id uuid;
  b_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if current_user_id = target_user_id then
    raise exception 'Cannot start a conversation with yourself';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = target_user_id
  ) then
    raise exception 'User not found';
  end if;

  -- Normalize participant order for uniqueness
  if current_user_id < target_user_id then
    a_id := current_user_id;
    b_id := target_user_id;
  else
    a_id := target_user_id;
    b_id := current_user_id;
  end if;

  select conversations.id
  into conversation_id
  from public.conversations
  where
    conversations.participant_a_id = a_id
    and conversations.participant_b_id = b_id
    and conversations.order_id is null
    and conversations.project_id is null
    and conversations.project_request_id is null
  limit 1;

  if conversation_id is not null then
    return conversation_id;
  end if;

  begin
    insert into public.conversations (
      created_by,
      participant_a_id,
      participant_b_id,
      context_metadata
    )
    values (
      current_user_id,
      a_id,
      b_id,
      '{}'::jsonb
    )
    returning id into conversation_id;
  exception
    when unique_violation then
      select conversations.id
      into conversation_id
      from public.conversations
      where
        conversations.participant_a_id = a_id
        and conversations.participant_b_id = b_id
        and conversations.order_id is null
        and conversations.project_id is null
        and conversations.project_request_id is null
      limit 1;
  end;

  return conversation_id;
end;
$$;

-- Update send_conversation_message to support attachments and encryption
create or replace function public.send_conversation_message(
  target_conversation_id uuid,
  message_body text,
  message_kind_input public.message_kind default 'text',
  message_attachment_metadata jsonb default '{}'::jsonb,
  message_iv text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  clean_body text := btrim(message_body);
  new_message_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if clean_body is null or char_length(clean_body) not between 1 and 5000 then
    raise exception 'Message must be between 1 and 5000 characters';
  end if;

  if not exists (
    select 1
    from public.conversations
    where conversations.id = target_conversation_id
      and current_user_id in (
        conversations.participant_a_id,
        conversations.participant_b_id
      )
  ) then
    raise exception 'Conversation is unavailable';
  end if;

  insert into public.messages (
    conversation_id,
    sender_id,
    message_type,
    body,
    attachment_metadata,
    encryption_iv
  )
  values (
    target_conversation_id,
    current_user_id,
    message_kind_input,
    clean_body,
    message_attachment_metadata,
    message_iv
  )
  returning id into new_message_id;

  return new_message_id;
end;
$$;

-- Grant execute to authenticated users
revoke execute on function public.search_messaging_users(text) from public, anon;
grant execute on function public.search_messaging_users(text) to authenticated;

revoke execute on function public.get_or_create_direct_conversation(uuid) from public, anon;
grant execute on function public.get_or_create_direct_conversation(uuid) to authenticated;

-- Allow the updated RPC to be called
revoke execute on function public.send_conversation_message(uuid, text, public.message_kind, jsonb, text) from public, anon;
grant execute on function public.send_conversation_message(uuid, text, public.message_kind, jsonb, text) to authenticated;
