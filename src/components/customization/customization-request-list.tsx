import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  UserRound,
  WandSparkles,
} from "lucide-react";

import { CustomizationStatusBadge } from "@/components/customization/customization-status-badge";
import { buttonVariants } from "@/components/ui/button";
import type { CustomizationRequestView } from "@/data/customization-requests";
import { formatBdt, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CustomizationRequestList({
  emptyMessage,
  perspective,
  requests,
}: {
  emptyMessage: string;
  perspective: "buyer" | "seller";
  requests: CustomizationRequestView[];
}) {
  if (requests.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/55 px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <WandSparkles aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">No customization requests</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
        {perspective === "buyer" && (
          <Link className={cn(buttonVariants(), "mt-5")} href="/explore">
            Explore projects
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <article
          className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-xl transition-colors hover:border-primary/30 sm:p-5 dark:border-white/10 dark:bg-white/[0.045]"
          key={request.id}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <WandSparkles aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-semibold tracking-tight">
                  {request.projectTitle}
                </h2>
                <CustomizationStatusBadge status={request.status} />
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {request.requestedChanges}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound aria-hidden="true" className="size-3.5" />
                  {perspective === "buyer" ? request.sellerName : request.buyerName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CircleDollarSign aria-hidden="true" className="size-3.5" />
                  {formatBdt(request.budgetBdt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  Due {formatDate(request.deadline)}
                </span>
              </div>
            </div>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "gap-1 text-primary",
              )}
              href={`/customization-requests/${request.id}`}
            >
              View request
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
