import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationThread } from "@/components/messages/conversation-thread";
import { MessagesRealtimeProvider } from "@/components/messages/messages-realtime-provider";
import { getAuthContext } from "@/lib/auth/session";
import { databaseIdPattern } from "@/lib/database-id";
import {
  getConversationForUser,
  getConversationsForUser,
} from "@/lib/messages/queries";

export const metadata: Metadata = { title: "Conversation" };

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/messages");

  const { id } = await params;
  if (!databaseIdPattern.test(id)) notFound();

  const conversations = await getConversationsForUser(auth.userId);
  const conversation = await getConversationForUser(
    id,
    auth.userId,
    conversations,
  );
  if (!conversation) notFound();

  const query = await searchParams;
  const error = Array.isArray(query.error) ? query.error[0] : query.error;

  return (
    <MessagesRealtimeProvider
      activeConversationId={id}
      currentUserId={auth.userId}
      initialConversation={conversation}
      initialConversations={conversations}
    >
      <div className="grid min-h-0 gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="hidden min-h-0 overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-sm backdrop-blur-xl lg:block dark:border-white/10 dark:bg-white/[0.035]">
          <div className="border-b px-5 py-4">
            <p className="text-sm font-semibold">Messages</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {conversations.length} conversation
              {conversations.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="max-h-[calc(100svh-14rem)] overflow-y-auto">
            <ConversationList
              activeConversationId={id}
              conversations={conversations}
            />
          </div>
        </aside>
        <ConversationThread conversation={conversation} error={error} />
      </div>
    </MessagesRealtimeProvider>
  );
}
