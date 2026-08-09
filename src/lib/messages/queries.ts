import "server-only";

import {
  parseConversationContext,
  type ConversationMessage,
  type ConversationSummary,
  type ConversationView,
  type MessageParticipant,
} from "@/data/messages";
import { createClient } from "@/lib/supabase/server";

const conversationSelection =
  "id, participant_a_id, participant_b_id, order_id, project_id, project_request_id, context_metadata, last_message_at, created_at";

const fallbackParticipant: MessageParticipant = {
  avatarUrl: null,
  displayName: "CampusStall user",
  id: "unknown",
  isVerified: false,
  encryptionPublicKey: null,
};

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function getConversationsForUser(
  userId: string,
): Promise<ConversationSummary[]> {
  const supabase = await createClient();
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(conversationSelection)
    .or(`participant_a_id.eq.${userId},participant_b_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || conversations.length === 0) return [];

  const otherParticipantIds = [
    ...new Set(
      conversations.map((conversation) =>
        conversation.participant_a_id === userId
          ? conversation.participant_b_id
          : conversation.participant_a_id,
      ),
    ),
  ];
  const conversationIds = conversations.map((conversation) => conversation.id);

  const [
    { data: profiles },
    { data: recentMessages },
    { data: unreadMessages },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, avatar_url, is_verified, encryption_public_key")
      .in("id", otherParticipantIds),
    supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, read_at, created_at, message_type, attachment_metadata, encryption_iv")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("messages")
      .select("conversation_id")
      .in("conversation_id", conversationIds)
      .neq("sender_id", userId)
      .is("read_at", null),
  ]);

  const profileById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      {
        avatarUrl: profile.avatar_url,
        displayName: profile.display_name,
        id: profile.id,
        isVerified: profile.is_verified,
        encryptionPublicKey: profile.encryption_public_key,
      } satisfies MessageParticipant,
    ]),
  );
  const latestMessageByConversation = new Map<string, ConversationMessage>();
  const unreadByConversation = new Map<string, number>();

  for (const message of recentMessages ?? []) {
    if (!latestMessageByConversation.has(message.conversation_id)) {
      latestMessageByConversation.set(message.conversation_id, {
        body: message.body,
        createdAt: message.created_at,
        id: message.id,
        readAt: message.read_at,
        senderId: message.sender_id,
        messageType: message.message_type,
        attachmentMetadata: toRecord(message.attachment_metadata),
        encryptionIv: message.encryption_iv,
      });
    }
  }

  for (const message of unreadMessages ?? []) {
    unreadByConversation.set(
      message.conversation_id,
      (unreadByConversation.get(message.conversation_id) ?? 0) + 1,
    );
  }

  return conversations
    .map((conversation) => {
      const otherId =
        conversation.participant_a_id === userId
          ? conversation.participant_b_id
          : conversation.participant_a_id;
      const lastMessage =
        latestMessageByConversation.get(conversation.id) ?? null;

      return {
        context: parseConversationContext(conversation.context_metadata, {
          orderId: conversation.order_id,
          projectId: conversation.project_id,
          projectRequestId: conversation.project_request_id,
        }),
        id: conversation.id,
        lastActivityAt:
          lastMessage?.createdAt ??
          conversation.last_message_at ??
          conversation.created_at,
        lastMessage,
        otherParticipant:
          profileById.get(otherId) ?? { ...fallbackParticipant, id: otherId },
        unreadCount: unreadByConversation.get(conversation.id) ?? 0,
      } satisfies ConversationSummary;
    })
    .sort(
      (left, right) =>
        new Date(right.lastActivityAt).getTime() -
        new Date(left.lastActivityAt).getTime(),
    );
}

export async function getConversationForUser(
  conversationId: string,
  userId: string,
  summaries?: ConversationSummary[],
): Promise<ConversationView | null> {
  const availableSummaries = summaries ?? (await getConversationsForUser(userId));
  const summary = availableSummaries.find(
    (conversation) => conversation.id === conversationId,
  );

  if (!summary) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, body, read_at, created_at, message_type, attachment_metadata, encryption_iv")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) return null;

  return {
    currentUserId: userId,
    messages: [...data].reverse().map((message) => ({
      body: message.body,
      createdAt: message.created_at,
      id: message.id,
      readAt: message.read_at,
      senderId: message.sender_id,
      messageType: message.message_type,
      attachmentMetadata: toRecord(message.attachment_metadata),
      encryptionIv: message.encryption_iv,
    })),
    summary,
  };
}
