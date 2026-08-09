import { BarChart3 } from "lucide-react";

import type { SalesTrendPoint } from "@/data/dashboard";
import { formatBdt } from "@/lib/format";

export function SalesChart({ points }: { points: SalesTrendPoint[] }) {
  const maximum = Math.max(...points.map((point) => point.valueBdt), 0);

  if (maximum === 0) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 aria-hidden="true" className="size-4" />
        </span>
        <p className="mt-3 text-sm font-semibold">No sales trend yet</p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
          Demo-paid, delivered, and completed orders will populate this chart.
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label="Sales value over the last six months"
      className="flex h-56 items-end gap-2 px-4 pt-8 pb-4 sm:gap-3 sm:px-6"
      role="img"
    >
      {points.map((point) => {
        const height =
          point.valueBdt > 0
            ? Math.max((point.valueBdt / maximum) * 100, 8)
            : 2;

        return (
          <div
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            key={point.key}
          >
            <div className="flex h-full w-full items-end justify-center">
              <div
                aria-label={`${point.label}: ${formatBdt(point.valueBdt)} from ${point.orderCount} orders`}
                className="w-full max-w-12 rounded-t-md bg-primary/75 transition-colors hover:bg-primary"
                style={{ height: `${height}%` }}
                title={`${point.label}: ${formatBdt(point.valueBdt)} · ${point.orderCount} order${point.orderCount === 1 ? "" : "s"}`}
              />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
