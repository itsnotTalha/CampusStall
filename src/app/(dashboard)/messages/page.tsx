import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareText, Search } from "lucide-react";

import { ConversationList } from "@/components/messages/conversation-list";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { getConversationsForUser } from "@/lib/messages/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/messages");

  const [conversations, query] = await Promise.all([
    getConversationsForUser(auth.userId),
    searchParams,
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Inbox
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Messages
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Project and order conversations in one place.
          </p>
        </div>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "h-9 gap-2")}
          href="/explore"
        >
          <Search aria-hidden="true" className="size-4" />
          Find a project
        </Link>
      </header>

      {query.error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
          That conversation could not be opened. It may be unavailable or you
          may not be a participant.
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
        <div className="flex items-center gap-2 border-b px-4 py-3.5 sm:px-5">
          <MessageSquareText aria-hidden="true" className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Conversations</h2>
          {conversations.length > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {conversations.length} total
            </span>
          )}
        </div>
        <ConversationList conversations={conversations} />
      </section>
    </div>
  );
}
