"use client";

import Link from "next/link";
import { BadgeCheck, MessageSquareText } from "lucide-react";

import { useMessagesRealtime } from "@/components/messages/messages-realtime-provider";
import {
  formatConversationTime,
  type ConversationSummary,
} from "@/data/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function ConversationList({
  activeConversationId,
  conversations,
}: {
  activeConversationId?: string;
  conversations: ConversationSummary[];
}) {
  const realtime = useMessagesRealtime();
  const visibleConversations = realtime?.conversations ?? conversations;
  const selectedConversationId =
    realtime?.activeConversationId ?? activeConversationId;

  if (visibleConversations.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageSquareText aria-hidden="true" className="size-5" />
        </span>
        <p className="mt-4 text-sm font-semibold">No conversations yet</p>
        <p className="mt-1 max-w-56 text-xs leading-5 text-muted-foreground">
          Contact a seller from a live project or order to start a conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/70">
      {visibleConversations.map((conversation) => {
        const participant = conversation.otherParticipant;
        const initials = participant.displayName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const isActive = conversation.id === selectedConversationId;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex gap-3 px-4 py-4 transition-colors hover:bg-muted/55 sm:px-5",
              isActive && "bg-primary/[0.07] hover:bg-primary/[0.09]",
            )}
            href={`/messages/${conversation.id}`}
            key={conversation.id}
          >
            <Avatar className="mt-0.5 size-10">
              {participant.avatarUrl && (
                <AvatarImage
                  alt=""
                  src={participant.avatarUrl}
                />
              )}
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials || "CS"}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-sm font-semibold">
                    {participant.displayName}
                  </span>
                  {participant.isVerified && (
                    <BadgeCheck
                      aria-label="Verified user"
                      className="size-3.5 shrink-0 fill-primary text-primary-foreground"
                    />
                  )}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatConversationTime(conversation.lastActivityAt)}
                </span>
              </span>
              <span className="mt-1 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "truncate text-xs text-muted-foreground",
                    conversation.unreadCount > 0 && "font-medium text-foreground",
                  )}
                >
                  {conversation.lastMessage?.body ??
                    conversation.context?.subtitle ??
                    "Conversation started"}
                </span>
                {conversation.unreadCount > 0 && (
                  <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {conversation.unreadCount > 99
                      ? "99+"
                      : conversation.unreadCount}
                  </span>
                )}
              </span>
              {conversation.context && (
                <span className="mt-1.5 block truncate text-[10px] font-medium text-primary/90">
                  {conversation.context.title}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
