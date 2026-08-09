alter table public.conversations
  add column project_id uuid references public.projects(id) on delete set null,
  add column context_metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(context_metadata) = 'object');

alter table public.conversations
  add constraint conversations_single_context_check
  check (num_nonnulls(order_id, project_request_id, project_id) <= 1);

create index conversations_project_idx
  on public.conversations (project_id)
  where project_id is not null;
create unique index conversations_order_unique_idx
  on public.conversations (order_id)
  where order_id is not null;
create unique index conversations_project_participants_unique_idx
  on public.conversations (project_id, participant_a_id, participant_b_id)
  where project_id is not null;
create index messages_unread_conversation_idx
  on public.messages (conversation_id, read_at)
  where read_at is null;

revoke insert on public.conversations from authenticated;
revoke insert on public.messages from authenticated;
revoke update (read_at) on public.messages from authenticated;

drop policy if exists "Users create conversations" on public.conversations;
drop policy if exists "Participants send messages" on public.messages;
drop policy if exists "Participants mark messages read" on public.messages;

create or replace function public.get_or_create_order_conversation(
  target_order_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_order record;
  conversation_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select
    orders.buyer_id,
    orders.seller_id,
    orders.fulfillment_metadata
  into target_order
  from public.orders
  where orders.id = target_order_id;

  if not found or current_user_id not in (
    target_order.buyer_id,
    target_order.seller_id
  ) then
    raise exception 'Order is unavailable';
  end if;

  select conversations.id
  into conversation_id
  from public.conversations
  where conversations.order_id = target_order_id
  limit 1;

  if conversation_id is not null then
    return conversation_id;
  end if;

  begin
    insert into public.conversations (
      created_by,
      participant_a_id,
      participant_b_id,
      order_id,
      context_metadata
    )
    values (
      current_user_id,
      target_order.buyer_id,
      target_order.seller_id,
      target_order_id,
      jsonb_build_object(
        'kind', 'order',
        'title', coalesce(
          target_order.fulfillment_metadata ->> 'project_title',
          'Ready-made project'
        ),
        'subtitle', coalesce(
          target_order.fulfillment_metadata ->> 'package_name',
          'Project package'
        )
      )
    )
    returning id into conversation_id;
  exception
    when unique_violation then
      select conversations.id
      into conversation_id
      from public.conversations
      where conversations.order_id = target_order_id
      limit 1;
  end;

  return conversation_id;
end;
$$;

create or replace function public.get_or_create_project_conversation(
  target_project_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_project record;
  conversation_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select projects.seller_id, projects.title, projects.slug
  into target_project
  from public.projects
  where projects.id = target_project_id
    and projects.status = 'published';

  if not found then
    raise exception 'Project is unavailable';
  end if;

  if target_project.seller_id = current_user_id then
    raise exception 'Sellers cannot start a conversation with themselves';
  end if;

  select conversations.id
  into conversation_id
  from public.conversations
  where conversations.project_id = target_project_id
    and conversations.participant_a_id = current_user_id
    and conversations.participant_b_id = target_project.seller_id
  limit 1;

  if conversation_id is not null then
    return conversation_id;
  end if;

  begin
    insert into public.conversations (
      created_by,
      participant_a_id,
      participant_b_id,
      project_id,
      context_metadata
    )
    values (
      current_user_id,
      current_user_id,
      target_project.seller_id,
      target_project_id,
      jsonb_build_object(
        'kind', 'project',
        'title', target_project.title,
        'slug', target_project.slug
      )
    )
    returning id into conversation_id;
  exception
    when unique_violation then
      select conversations.id
      into conversation_id
      from public.conversations
      where conversations.project_id = target_project_id
        and conversations.participant_a_id = current_user_id
        and conversations.participant_b_id = target_project.seller_id
      limit 1;
  end;

  return conversation_id;
end;
$$;

create or replace function public.send_conversation_message(
  target_conversation_id uuid,
  message_body text
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
    attachment_metadata
  )
  values (
    target_conversation_id,
    current_user_id,
    'text',
    clean_body,
    '{}'::jsonb
  )
  returning id into new_message_id;

  return new_message_id;
end;
$$;

create or replace function public.mark_conversation_read(
  target_conversation_id uuid
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  updated_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
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

  update public.messages
  set read_at = timezone('utc', now())
  where conversation_id = target_conversation_id
    and sender_id <> current_user_id
    and read_at is null;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

revoke execute on function public.get_or_create_order_conversation(uuid)
  from public, anon;
revoke execute on function public.get_or_create_project_conversation(uuid)
  from public, anon;
revoke execute on function public.send_conversation_message(uuid, text)
  from public, anon;
revoke execute on function public.mark_conversation_read(uuid)
  from public, anon;

grant execute on function public.get_or_create_order_conversation(uuid)
  to authenticated;
grant execute on function public.get_or_create_project_conversation(uuid)
  to authenticated;
grant execute on function public.send_conversation_message(uuid, text)
  to authenticated;
grant execute on function public.mark_conversation_read(uuid)
  to authenticated;
