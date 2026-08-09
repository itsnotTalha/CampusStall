"use client";

import { startTransition, useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { markConversationReadAction } from "@/app/(dashboard)/messages/actions";

export function MessageViewport({
  children,
  conversationId,
  hasUnread,
}: {
  children: ReactNode;
  conversationId: string;
  hasUnread: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;

    if (hasUnread) {
      startTransition(async () => {
        const result = await markConversationReadAction(conversationId);
        if (result.ok) router.refresh();
      });
    }
  }, [conversationId, hasUnread, router]);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
      ref={viewportRef}
    >
      {children}
    </div>
  );
}
