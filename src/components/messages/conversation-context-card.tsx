import Link from "next/link";
import { ArrowUpRight, FolderKanban, ReceiptText } from "lucide-react";

import type { ConversationContext } from "@/data/messages";

export function ConversationContextCard({
  context,
}: {
  context: ConversationContext;
}) {
  const Icon = context.kind === "order" ? ReceiptText : FolderKanban;
  const eyebrow =
    context.kind === "order"
      ? "Order context"
      : context.kind === "project"
        ? "Project context"
        : "Request context";

  return (
    <Link
      className="group mx-4 mt-4 flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 transition-colors hover:border-primary/25 hover:bg-primary/[0.045] sm:mx-5"
      href={context.href}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          {eyebrow}
        </span>
        <span className="mt-0.5 block truncate text-xs font-semibold">
          {context.title}
        </span>
        <span className="block truncate text-[10px] text-muted-foreground">
          {context.subtitle}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
      />
    </Link>
  );
}
