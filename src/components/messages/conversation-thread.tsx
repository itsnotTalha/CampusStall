"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCheck,
  MessageSquareText,
  Send,
} from "lucide-react";

import { sendMessageAction } from "@/app/(dashboard)/messages/actions";
import { ConversationContextCard } from "@/components/messages/conversation-context-card";
import { MessageViewport } from "@/components/messages/message-viewport";
import { useMessagesRealtime } from "@/components/messages/messages-realtime-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  formatMessageDate,
  formatMessageTime,
  type ConversationView,
} from "@/data/messages";
import { cn } from "@/lib/utils";

export function ConversationThread({
  conversation,
  error,
}: {
  conversation: ConversationView;
  error?: string;
}) {
  const realtime = useMessagesRealtime();
  const currentConversation = realtime?.activeConversation ?? conversation;
  const participant = currentConversation.summary.otherParticipant;
  const initials = participant.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hasUnread = currentConversation.messages.some(
    (message) =>
      message.senderId !== currentConversation.currentUserId && message.readAt === null,
  );
  const latestMessageId = currentConversation.messages.at(-1)?.id;

  return (
    <section className="flex min-h-[calc(100svh-11rem)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
      <header className="flex items-center gap-3 border-b px-4 py-3.5 sm:px-5">
        <Link
          aria-label="Back to conversations"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          href="/messages"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
        <Avatar className="size-9">
          {participant.avatarUrl && (
            <AvatarImage alt="" src={participant.avatarUrl} />
          )}
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials || "CS"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate text-sm font-semibold">
              {participant.displayName}
            </h1>
            {participant.isVerified && (
              <BadgeCheck
                aria-label="Verified user"
                className="size-3.5 fill-primary text-primary-foreground"
              />
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            CampusStall conversation
          </p>
        </div>
      </header>

      {conversation.summary.context && (
        <ConversationContextCard context={conversation.summary.context} />
      )}

      <MessageViewport
        conversationId={currentConversation.summary.id}
        latestMessageId={latestMessageId}
        hasUnread={hasUnread}
      >
        {currentConversation.messages.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquareText aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-4 text-sm font-semibold">Start the conversation</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              Ask a focused question about the project, package, or order.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentConversation.messages.map((message, index) => {
              const previous = currentConversation.messages[index - 1];
              const showDate =
                !previous ||
                new Date(previous.createdAt).toDateString() !==
                  new Date(message.createdAt).toDateString();
              const isOwn = message.senderId === currentConversation.currentUserId;

              return (
                <div key={message.id}>
                  {showDate && (
                    <p className="my-5 text-center text-[10px] font-medium text-muted-foreground">
                      {formatMessageDate(message.createdAt)}
                    </p>
                  )}
                  <div
                    className={cn(
                      "flex",
                      isOwn ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 sm:max-w-[70%]",
                        isOwn
                          ? "rounded-br-md bg-primary text-primary-foreground shadow-sm"
                          : "rounded-bl-md border border-border/70 bg-background/80",
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.body}</p>
                      <p
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[9px]",
                          isOwn
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {formatMessageTime(message.createdAt)}
                        {isOwn && message.readAt && (
                          <CheckCheck aria-label="Read" className="size-3" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </MessageViewport>

      <footer className="border-t bg-card/90 p-3 sm:p-4">
        {error && (
          <p className="mb-2 text-xs font-medium text-destructive">
            {error === "invalid-message"
              ? "Enter a message between 1 and 5,000 characters."
              : "Your message could not be sent. Please try again."}
          </p>
        )}
        <form action={sendMessageAction} className="flex items-end gap-2">
          <input
            name="conversationId"
            type="hidden"
            value={currentConversation.summary.id}
          />
          <textarea
            aria-label="Message"
            className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm leading-5 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            maxLength={5000}
            name="body"
            placeholder={`Message ${participant.displayName}`}
            required
            rows={1}
          />
          <Button
            aria-label="Send message"
            className="size-11 rounded-xl"
            size="icon-lg"
            type="submit"
          >
            <Send aria-hidden="true" className="size-4" />
          </Button>
        </form>
        <p className="mt-2 px-1 text-[9px] text-muted-foreground">
          Keep communication on-platform. Attachments are not supported yet.
        </p>
      </footer>
    </section>
  );
}
