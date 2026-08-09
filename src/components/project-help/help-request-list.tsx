import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";

import {
  helpRequestStatusLabels,
  type ProjectHelpRequestSummary,
} from "@/data/project-help";
import { formatBdt, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectHelpRequestSummary["status"], string> = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  in_progress: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  completed: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  cancelled: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

export function HelpRequestList({
  requests,
}: {
  requests: ProjectHelpRequestSummary[];
}) {
  return (
    <div className="divide-y divide-border/70">
      {requests.slice(0, 5).map((request) => (
        <Link
          className="block px-4 py-4 transition-colors hover:bg-muted/45 sm:px-5"
          href={`/project-help?request=${request.id}#matches`}
          key={request.id}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-primary">
                {request.categoryName}
              </p>
              <h3 className="mt-1 truncate text-sm font-semibold">{request.title}</h3>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-[9px] font-semibold",
                statusStyles[request.status],
              )}
            >
              {helpRequestStatusLabels[request.status]}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {request.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
            {request.budgetBdt !== null && <span>{formatBdt(request.budgetBdt)}</span>}
            {request.deadline && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3" />
                Due {formatDate(request.deadline)}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock3 aria-hidden="true" className="size-3" />
              Posted {formatDate(request.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
