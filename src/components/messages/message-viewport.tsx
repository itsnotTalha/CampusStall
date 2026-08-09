"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useMessagesRealtime } from "@/components/messages/messages-realtime-provider";

export function MessageViewport({
  children,
  conversationId,
  latestMessageId,
  hasUnread,
}: {
  children: ReactNode;
  conversationId: string;
  latestMessageId?: string;
  hasUnread: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const previousConversationIdRef = useRef(conversationId);
  const nearBottomRef = useRef(true);
  const lastReadMarkerRef = useRef<string | null>(null);
  const realtime = useMessagesRealtime();

  const markConversationRead = realtime?.markConversationRead;

  const scrollToBottom = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTop = viewport.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
    nearBottomRef.current = true;
    previousConversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    if (!latestMessageId || previousConversationIdRef.current !== conversationId) {
      return;
    }

    if (nearBottomRef.current) {
      scrollToBottom();
    }
  }, [conversationId, latestMessageId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const distanceFromBottom =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      nearBottomRef.current = distanceFromBottom < 96;
    };

    handleScroll();
    viewport.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!hasUnread || !latestMessageId) return;

    const marker = `${conversationId}:${latestMessageId}`;
    if (lastReadMarkerRef.current === marker) return;

    lastReadMarkerRef.current = marker;

    void (markConversationRead?.(conversationId) ?? Promise.resolve(true));
  }, [conversationId, hasUnread, latestMessageId, markConversationRead]);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
      ref={viewportRef}
    >
      {children}
    </div>
  );
}
