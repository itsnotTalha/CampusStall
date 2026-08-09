import type { Json } from "@/types/database";

export type MessageParticipant = {
  avatarUrl: string | null;
  displayName: string;
  id: string;
  isVerified: boolean;
};

export type ConversationContext =
  | {
      href: string;
      id: string;
      kind: "order";
      subtitle: string;
      title: string;
    }
  | {
      href: string;
      id: string;
      kind: "project";
      subtitle: string;
      title: string;
    }
  | {
      href: string;
      id: string;
      kind: "project-request";
      subtitle: string;
      title: string;
    };

export type ConversationMessage = {
  body: string;
  createdAt: string;
  id: string;
  readAt: string | null;
  senderId: string;
};

export type ConversationSummary = {
  context: ConversationContext | null;
  id: string;
  lastActivityAt: string;
  lastMessage: ConversationMessage | null;
  otherParticipant: MessageParticipant;
  unreadCount: number;
};

export type ConversationView = {
  currentUserId: string;
  messages: ConversationMessage[];
  summary: ConversationSummary;
};

function isJsonRecord(
  value: Json,
): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: Json | undefined) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function parseConversationContext(
  metadata: Json,
  ids: {
    orderId: string | null;
    projectId: string | null;
    projectRequestId: string | null;
  },
): ConversationContext | null {
  const values = isJsonRecord(metadata) ? metadata : {};
  const title = readText(values.title);
  const subtitle = readText(values.subtitle);
  const slug = readText(values.slug);

  if (ids.orderId) {
    return {
      href: `/orders/${ids.orderId}`,
      id: ids.orderId,
      kind: "order",
      subtitle: subtitle ?? `Order #${ids.orderId.slice(0, 8).toUpperCase()}`,
      title: title ?? "Ready-made project order",
    };
  }

  if (ids.projectId) {
    return {
      href: slug ? `/projects/${slug}` : "/explore",
      id: ids.projectId,
      kind: "project",
      subtitle: "Project inquiry",
      title: title ?? "Ready-made project",
    };
  }

  if (ids.projectRequestId) {
    return {
      href: "/customization-requests",
      id: ids.projectRequestId,
      kind: "project-request",
      subtitle: "Project help request",
      title: title ?? "Project request",
    };
  }

  return null;
}

const compactTimeFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
});

const messageTimeFormatter = new Intl.DateTimeFormat("en-BD", {
  hour: "numeric",
  minute: "2-digit",
});

const messageDateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatConversationTime(value: string) {
  const date = new Date(value);
  const today = new Date();

  return date.toDateString() === today.toDateString()
    ? messageTimeFormatter.format(date)
    : compactTimeFormatter.format(date);
}

export function formatMessageTime(value: string) {
  return messageTimeFormatter.format(new Date(value));
}

export function formatMessageDate(value: string) {
  return messageDateFormatter.format(new Date(value));
}
