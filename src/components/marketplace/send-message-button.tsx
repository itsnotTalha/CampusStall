"use client";

import { MessageCircle } from "lucide-react";
import { useTransition } from "react";

import { openProjectConversationAction } from "@/app/(dashboard)/messages/actions";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";

type SendMessageButtonProps = {
  projectId?: string;
  className?: string;
};

export function SendMessageButton({
  projectId,
  className,
}: SendMessageButtonProps) {
  const [pending, startTransition] = useTransition();
  const { checkingSession, requireAuth } = useRequireAuth();

  async function handleSendMessage() {
    if (!(await requireAuth())) return;
    if (!projectId) return;

    const formData = new FormData();
    formData.set("projectId", projectId);

    startTransition(() => {
      openProjectConversationAction(formData);
    });
  }

  if (!projectId) {
    return (
      <button
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border bg-card/95 text-muted-foreground shadow-sm transition-colors hover:bg-card/100 disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        disabled={true}
        title="Messaging is available on live listings"
        type="button"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        <span className="sr-only">Send message</span>
      </button>
    );
  }

  return (
    <button
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border bg-card/95 text-muted-foreground shadow-sm transition-colors hover:bg-card/100 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      disabled={checkingSession || pending}
      onClick={handleSendMessage}
      title="Send message to seller"
      type="button"
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      <span className="sr-only">Send message</span>
    </button>
  );
}
