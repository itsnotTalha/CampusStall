import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, MessageSquareText, Search, Send } from "lucide-react";

import { openDirectConversationAction } from "@/app/(dashboard)/messages/actions";
import { ConversationList } from "@/components/messages/conversation-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthContext } from "@/lib/auth/session";
import {
  getConversationsForUser,
  searchMessagingUsers,
} from "@/lib/messages/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; q?: string | string[] }>;
}) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/messages");

  const [conversations, query] = await Promise.all([
    getConversationsForUser(auth.userId),
    searchParams,
  ]);

  const searchQuery =
    typeof query.q === "string" ? query.q.trim() : "";
  const searchState =
    searchQuery.length >= 3
      ? await searchMessagingUsers(searchQuery)
      : { error: null, users: [] as Awaited<ReturnType<typeof searchMessagingUsers>>["users"] };

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

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
        <div className="flex items-center gap-2 border-b px-4 py-3.5 sm:px-5">
          <Search aria-hidden="true" className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Start a direct message</h2>
        </div>
        <form className="grid gap-3 p-4 sm:p-5" method="get">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              autoComplete="off"
              className="h-10"
              defaultValue={searchQuery}
              name="q"
              placeholder="Search by username or email"
              type="search"
            />
            <button
              className={cn(buttonVariants({ variant: "default" }), "h-10 gap-2 px-4")}
              type="submit"
            >
              <Search aria-hidden="true" className="size-4" />
              Search people
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Search by username or email, then open a direct chat.
          </p>
        </form>

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <div className="border-t px-4 py-3 text-sm text-muted-foreground sm:px-5">
            Type at least 3 characters to search.
          </div>
        )}

        {searchQuery.length >= 3 && searchState.error && (
          <div className="border-t px-4 py-3 text-sm text-destructive sm:px-5">
            {searchState.error}
          </div>
        )}

        {searchQuery.length >= 3 && !searchState.error && searchState.users.length === 0 && (
          <div className="border-t px-4 py-6 text-sm text-muted-foreground sm:px-5">
            No users matched that search.
          </div>
        )}

        {searchQuery.length >= 3 && searchState.users.length > 0 && (
          <div className="border-t divide-y divide-border/70">
            {searchState.users.map((user) => {
              const initials = user.display_name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <form action={openDirectConversationAction} key={user.id}>
                  <input name="userId" type="hidden" value={user.id} />
                  <button
                    className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/55 sm:px-5"
                    type="submit"
                  >
                    <Avatar className="size-10">
                      {user.avatar_url && <AvatarImage alt="" src={user.avatar_url} />}
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials || "CS"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold">
                          {user.display_name}
                        </span>
                        {user.is_verified && (
                          <BadgeCheck
                            aria-label="Verified user"
                            className="size-3.5 shrink-0 fill-primary text-primary-foreground"
                          />
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {user.username ? `@${user.username}` : "Direct message"}
                      </span>
                    </span>
                    <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 px-3 text-sm font-medium text-foreground">
                      <Send aria-hidden="true" className="size-4 text-primary" />
                      Message
                    </span>
                  </button>
                </form>
              );
            })}
          </div>
        )}
      </section>

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
