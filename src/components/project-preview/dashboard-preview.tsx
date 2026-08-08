"use client";

import { useState } from "react";
import {
  BarChart3,
  Boxes,
  ChevronDown,
  CircleDollarSign,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ranges = {
  "7d": {
    revenue: "৳18,420",
    orders: "42",
    products: "128",
    bars: [34, 48, 40, 62, 54, 78, 66],
  },
  "30d": {
    revenue: "৳74,850",
    orders: "186",
    products: "128",
    bars: [44, 58, 48, 70, 63, 86, 74],
  },
  "90d": {
    revenue: "৳2,14,600",
    orders: "524",
    products: "128",
    bars: [52, 46, 68, 61, 82, 74, 92],
  },
} as const;

type Range = keyof typeof ranges;

const dashboardNavigation = [
  { icon: BarChart3, label: "Overview" },
  { icon: PackageCheck, label: "Orders" },
  { icon: Boxes, label: "Products" },
] as const;

export function DashboardPreview() {
  const [range, setRange] = useState<Range>("30d");
  const data = ranges[range];

  return (
    <div className="h-full min-h-[30rem] bg-[#f7f8f8] p-3 text-slate-900 sm:p-5">
      <div className="mx-auto flex h-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <aside className="hidden w-40 shrink-0 border-r border-slate-200 bg-slate-950 p-3 text-white sm:block">
          <div className="flex items-center gap-2 px-1 py-2 text-xs font-semibold">
            <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500 text-white">
              <ShoppingBag className="size-3.5" />
            </span>
            Storeboard
          </div>
          <div className="mt-6 space-y-1 text-[10px] text-slate-400">
            {dashboardNavigation.map(({ icon: Icon, label }, index) => (
              <div
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2",
                  index === 0 && "bg-white/10 text-white",
                )}
                key={String(label)}
              >
                <Icon className="size-3.5" />
                {label}
              </div>
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium text-slate-500">
                Commerce overview
              </p>
              <h3 className="mt-1 text-sm font-semibold">Good morning, Raisa</h3>
            </div>
            <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5">
              {(Object.keys(ranges) as Range[]).map((option) => (
                <button
                  className={cn(
                    "rounded px-2 py-1 text-[9px] font-medium text-slate-500",
                    range === option && "bg-slate-900 text-white",
                  )}
                  key={option}
                  onClick={() => setRange(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: CircleDollarSign, label: "Revenue", value: data.revenue },
              { icon: PackageCheck, label: "Orders", value: data.orders },
              { icon: Boxes, label: "Products", value: data.products },
            ].map(({ icon: Icon, label, value }) => (
              <div className="rounded-lg border border-slate-200 p-2.5 sm:p-3" key={String(label)}>
                <Icon className="size-3.5 text-emerald-600" />
                <p className="mt-3 text-[8px] text-slate-500 sm:text-[9px]">
                  {label}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold sm:text-sm">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold">Sales performance</p>
                <p className="mt-0.5 text-[8px] text-slate-400">
                  Simulated dashboard values
                </p>
              </div>
              <button
                className="flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-[8px] text-slate-500"
                type="button"
              >
                All channels
                <ChevronDown className="size-2.5" />
              </button>
            </div>
            <div className="mt-5 flex h-28 items-end gap-2 sm:h-36 sm:gap-3">
              {data.bars.map((height, index) => (
                <div className="flex flex-1 flex-col items-center gap-1.5" key={index}>
                  <span
                    className="w-full rounded-t-sm bg-emerald-500/85 transition-[height] duration-300"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[7px] text-slate-400">
                    {String.fromCharCode(77 + index)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
