"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { markConversationReadAction } from "@/app/(dashboard)/messages/actions";
import { createClient } from "@/lib/supabase/client";
import type {
  ConversationMessage,
  ConversationSummary,
  ConversationView,
} from "@/data/messages";
import type { Database, Json } from "@/types/database";

type MessagesRealtimeContextValue = {
  activeConversationId: string | null;
  activeConversation: ConversationView | null;
  conversations: ConversationSummary[];
  currentUserId: string;
  markConversationRead: (conversationId: string) => Promise<boolean>;
};

const MessagesRealtimeContext =
  createContext<MessagesRealtimeContextValue | null>(null);

type RealtimeMessage = ConversationMessage & {
  conversationId: string;
};

function toRecord(value: Json): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toMessage(
  message: Database["public"]["Tables"]["messages"]["Row"],
): RealtimeMessage {
  return {
    attachmentMetadata: toRecord(message.attachment_metadata),
    body: message.body,
    createdAt: message.created_at,
    conversationId: message.conversation_id,
    encryptionIv: message.encryption_iv,
    id: message.id,
    messageType: message.message_type,
    readAt: message.read_at,
    senderId: message.sender_id,
  };
}

function insertMessage(messages: ConversationMessage[], message: ConversationMessage) {
  if (messages.some((entry) => entry.id === message.id)) return messages;

  return [...messages, message].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime() ||
      left.id.localeCompare(right.id),
  );
}

function bumpConversation(
  conversations: ConversationSummary[],
  message: RealtimeMessage,
  currentUserId: string,
  activeConversationId: string | null,
) {
  const index = conversations.findIndex(
    (entry) => entry.id === message.conversationId,
  );
  if (index < 0) return conversations;

  const next = [...conversations];
  const existing = next[index];
  const isOwnMessage = message.senderId === currentUserId;
  const shouldCountUnread =
    !isOwnMessage && existing.id !== activeConversationId;

  next.splice(index, 1, {
    ...existing,
    lastActivityAt: message.createdAt,
    lastMessage: message,
    unreadCount: shouldCountUnread
      ? existing.unreadCount + 1
      : existing.unreadCount,
  });

  next.sort(
    (left, right) =>
      new Date(right.lastActivityAt).getTime() -
      new Date(left.lastActivityAt).getTime() ||
      right.id.localeCompare(left.id),
  );

  return next;
}

export function MessagesRealtimeProvider({
  activeConversationId,
  children,
  currentUserId,
  initialConversation,
  initialConversations,
}: {
  activeConversationId?: string;
  children: ReactNode;
  currentUserId: string;
  initialConversation?: ConversationView | null;
  initialConversations: ConversationSummary[];
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState<ConversationView | null>(
    initialConversation ?? null,
  );

  const conversationSubscriptionKey = useMemo(
    () => initialConversations.map((conversation) => conversation.id).join("|"),
    [initialConversations],
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${currentUserId}:${conversationSubscriptionKey}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as Database["public"]["Tables"]["messages"]["Row"];
          if (!initialConversations.some((conversation) => conversation.id === row.conversation_id)) {
            return;
          }

          const nextMessage = toMessage(row);

          setConversations((previous) =>
            bumpConversation(previous, nextMessage, currentUserId, activeConversationId ?? null),
          );

          if (initialConversation?.summary.id === row.conversation_id) {
            setActiveConversation((previous) => {
              const conversation = previous ?? initialConversation;
              if (!conversation || conversation.summary.id !== row.conversation_id) {
                return previous;
              }

              return {
                ...conversation,
                messages: insertMessage(conversation.messages, nextMessage),
                summary: {
                  ...conversation.summary,
                  lastActivityAt: nextMessage.createdAt,
                  lastMessage: nextMessage,
                  unreadCount:
                    nextMessage.senderId === currentUserId ||
                    row.conversation_id === activeConversationId
                      ? conversation.summary.unreadCount
                      : conversation.summary.unreadCount + 1,
                },
              };
            });
          }

          if (!initialConversation && activeConversationId === row.conversation_id) {
            setActiveConversation((previous) => {
              if (!previous || previous.summary.id !== row.conversation_id) {
                return previous;
              }

              return {
                ...previous,
                messages: insertMessage(previous.messages, nextMessage),
                summary: {
                  ...previous.summary,
                  lastActivityAt: nextMessage.createdAt,
                  lastMessage: nextMessage,
                },
              };
            });
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" && process.env.NODE_ENV !== "production") {
          console.error("Messaging realtime subscription error", {
            activeConversationId,
            currentUserId,
            conversationSubscriptionKey,
            status,
          });
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    activeConversationId,
    currentUserId,
    conversationSubscriptionKey,
    initialConversation,
    initialConversations,
  ]);

  const markConversationRead = useCallback(
    async (conversationId: string) => {
      const result = await markConversationReadAction(conversationId);

      if (!result.ok) {
        return false;
      }

      const readAt = new Date().toISOString();

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation,
        ),
      );

      setActiveConversation((previous) => {
        if (!previous || previous.summary.id !== conversationId) return previous;

        return {
          ...previous,
          messages: previous.messages.map((message) =>
            message.senderId === currentUserId || message.readAt
              ? message
              : {
                  ...message,
                  readAt,
                },
          ),
          summary: {
            ...previous.summary,
            unreadCount: 0,
          },
        };
      });

      return true;
    },
    [currentUserId],
  );

  const value = useMemo<MessagesRealtimeContextValue>(
    () => ({
      activeConversation,
      activeConversationId: activeConversationId ?? null,
      conversations,
      currentUserId,
      markConversationRead,
    }),
    [activeConversation, activeConversationId, conversations, currentUserId, markConversationRead],
  );

  return (
    <MessagesRealtimeContext.Provider value={value}>
      {children}
    </MessagesRealtimeContext.Provider>
  );
}

export function useMessagesRealtime() {
  return useContext(MessagesRealtimeContext);
}