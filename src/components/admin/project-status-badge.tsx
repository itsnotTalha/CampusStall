import type { Database } from "@/types/database";
import { cn } from "@/lib/utils";

type ListingStatus = Database["public"]["Enums"]["listing_status"];

const statusStyles: Record<ListingStatus, string> = {
  archived: "bg-slate-500/10 text-slate-500",
  draft: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const statusLabels: Record<ListingStatus, string> = {
  archived: "Archived",
  draft: "Draft",
  pending: "Pending",
  published: "Approved",
  rejected: "Rejected",
};

export function ProjectStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
