import Link from "next/link";
import { ArrowRight, Box, CalendarDays, UserRound } from "lucide-react";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { licenseLabels, type OrderView } from "@/data/orders";
import { formatBdt, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OrderList({
  emptyMessage,
  orders,
  perspective,
}: {
  emptyMessage: string;
  orders: OrderView[];
  perspective: "buyer" | "seller";
}) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/55 px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Box aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">No orders yet</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
        {perspective === "buyer" && (
          <Link className={cn(buttonVariants(), "mt-5")} href="/explore">
            Explore marketplace
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <article
          className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-xl transition-colors hover:border-primary/30 sm:p-5 dark:border-white/10 dark:bg-white/[0.045]"
          key={order.id}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Box aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-semibold tracking-tight">
                  {order.snapshot.projectTitle}
                </h2>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {order.snapshot.packageName}
                {order.licenseType ? ` · ${licenseLabels[order.licenseType]}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound aria-hidden="true" className="size-3.5" />
                  {perspective === "buyer"
                    ? order.snapshot.sellerName
                    : order.snapshot.buyerName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
              <p className="font-semibold">{formatBdt(order.totalBdt)}</p>
              <Link
                className={cn(
                  buttonVariants({ size: "sm", variant: "ghost" }),
                  "mt-1 gap-1 text-primary",
                )}
                href={`/orders/${order.id}`}
              >
                View order
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
