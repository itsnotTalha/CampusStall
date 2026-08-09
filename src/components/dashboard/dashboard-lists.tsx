import Link from "next/link";
import {
  CalendarDays,
  FolderKanban,
  PackageCheck,
  UserRound,
  WandSparkles,
} from "lucide-react";

import { CustomizationStatusBadge } from "@/components/customization/customization-status-badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import type { CustomizationRequestView } from "@/data/customization-requests";
import type { DashboardProject } from "@/data/dashboard";
import type { OrderView } from "@/data/orders";
import { formatBdt, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const projectStatusStyles: Record<DashboardProject["status"], string> = {
  archived: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  draft: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function DashboardProjectList({
  projects,
}: {
  projects: DashboardProject[];
}) {
  if (projects.length === 0) {
    return <DashboardEmpty copy="Your project listings will appear here." />;
  }

  return (
    <div className="divide-y divide-border/70">
      {projects.slice(0, 5).map((project) => (
        <Link
          className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/45 sm:px-5"
          href={
            project.status === "published"
              ? `/projects/${project.slug}`
              : `/sell/project?project=${project.id}`
          }
          key={project.id}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderKanban aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {project.title}
            </span>
            <span className="mt-0.5 block text-[10px] text-muted-foreground">
              Updated {formatDate(project.updatedAt)} · {formatBdt(project.basePriceBdt)}
            </span>
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-1 text-[9px] font-semibold capitalize",
              projectStatusStyles[project.status],
            )}
          >
            {project.status}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function DashboardOrderList({
  orders,
  perspective,
}: {
  orders: OrderView[];
  perspective: "buyer" | "seller";
}) {
  if (orders.length === 0) {
    return (
      <DashboardEmpty
        copy={
          perspective === "buyer"
            ? "Your purchases will appear here."
            : "Purchases from buyers will appear here."
        }
      />
    );
  }

  return (
    <div className="divide-y divide-border/70">
      {orders.slice(0, 4).map((order) => (
        <Link
          className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/45 sm:px-5"
          href={`/orders/${order.id}`}
          key={order.id}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PackageCheck aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="truncate text-sm font-semibold">
                {order.snapshot.projectTitle}
              </span>
              <OrderStatusBadge status={order.status} />
            </span>
            <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <UserRound aria-hidden="true" className="size-3" />
                {perspective === "buyer"
                  ? order.snapshot.sellerName
                  : order.snapshot.buyerName}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3" />
                {formatDate(order.createdAt)}
              </span>
            </span>
          </span>
          <span className="shrink-0 text-xs font-semibold">
            {formatBdt(order.totalBdt)}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function DashboardRequestList({
  perspective,
  requests,
}: {
  perspective: "buyer" | "seller";
  requests: CustomizationRequestView[];
}) {
  if (requests.length === 0) {
    return <DashboardEmpty copy="Customization requests will appear here." />;
  }

  return (
    <div className="divide-y divide-border/70">
      {requests.slice(0, 4).map((request) => (
        <Link
          className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/45 sm:px-5"
          href={`/customization-requests/${request.id}`}
          key={request.id}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <WandSparkles aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {request.projectTitle}
            </span>
            <span className="mt-1 block truncate text-[10px] text-muted-foreground">
              {perspective === "buyer" ? request.sellerName : request.buyerName}
              {" · "}
              {formatBdt(request.budgetBdt)} · Due {formatDate(request.deadline)}
            </span>
          </span>
          <CustomizationStatusBadge status={request.status} />
        </Link>
      ))}
    </div>
  );
}

function DashboardEmpty({ copy }: { copy: string }) {
  return (
    <div className="flex min-h-36 items-center justify-center px-6 py-8 text-center text-xs text-muted-foreground">
      {copy}
    </div>
  );
}
