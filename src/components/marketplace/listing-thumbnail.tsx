/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ListingThumbnailProps = {
  icon: LucideIcon;
  tone: string;
  label: string;
  badge?: string;
  className?: string;
  href?: string;
  imageUrl?: string;
  variant?: "project" | "service";
  children?: ReactNode;
};

export function ListingThumbnail({
  icon: Icon,
  tone,
  label,
  badge,
  className,
  href,
  imageUrl,
  variant = "project",
  children,
}: ListingThumbnailProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        "relative flex aspect-video items-center justify-center overflow-hidden border-b border-white/10 bg-slate-950 p-5",
        className,
      )}
      role="group"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(16,185,129,0.2),transparent_34%),radial-gradient(circle_at_82%_76%,rgba(99,102,241,0.18),transparent_38%),linear-gradient(145deg,#0f172a,#08111f)]" />
      <div className="absolute -top-20 right-1/4 size-40 rounded-full bg-cyan-400/10 blur-3xl" />
      {imageUrl && (
        <>
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            src={imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-black/15" />
        </>
      )}

      {href && (
        <Link
          aria-label={`Open ${label}`}
          className="absolute inset-0 z-10 rounded-t-xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400"
          href={href}
        />
      )}

      {!imageUrl && (
      <div className="pointer-events-none relative mt-5 w-[88%] translate-y-2 overflow-hidden rounded-xl border border-white/15 bg-slate-950/75 text-slate-200 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-300 group-hover/card:-translate-y-0.5">
        <div className="flex h-7 items-center gap-1.5 border-b border-white/10 px-3">
          <span className="size-1.5 rounded-full bg-rose-400/80" />
          <span className="size-1.5 rounded-full bg-amber-300/80" />
          <span className="size-1.5 rounded-full bg-emerald-400/80" />
          <span className="ml-auto font-mono text-[7px] tracking-wider text-slate-500 uppercase">
            {variant === "project" ? "Live preview" : "Service workspace"}
          </span>
        </div>

        <div className="grid h-24 grid-cols-[2.6rem_1fr] sm:h-28 sm:grid-cols-[3rem_1fr]">
          <div className="border-r border-white/10 bg-white/[0.025] p-2">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-lg border sm:size-8",
                tone,
              )}
            >
              <Icon aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={1.8} />
            </div>
            <div className="mt-3 space-y-1.5">
              <span className="block h-1 w-full rounded-full bg-white/12" />
              <span className="block h-1 w-3/4 rounded-full bg-white/8" />
              <span className="block h-1 w-5/6 rounded-full bg-white/8" />
            </div>
          </div>

          {variant === "project" ? (
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="block h-1.5 w-20 rounded-full bg-slate-200/75" />
                  <span className="block h-1 w-28 rounded-full bg-slate-500/35" />
                </div>
                <span className="h-5 w-12 rounded-md border border-emerald-400/20 bg-emerald-400/10" />
              </div>
              <div className="mt-3 grid grid-cols-[1.35fr_0.65fr] gap-2">
                <div className="flex h-11 items-end gap-1 rounded-md border border-white/8 bg-white/[0.025] px-2 pt-2">
                  {[45, 72, 55, 88, 68, 96, 76].map((height, index) => (
                    <span
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/45 to-cyan-300/80"
                      key={`${height}-${index}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="space-y-1.5 rounded-md border border-white/8 bg-white/[0.025] p-2">
                  <span className="block h-1 w-full rounded-full bg-violet-300/45" />
                  <span className="block h-1 w-4/5 rounded-full bg-cyan-300/35" />
                  <span className="block h-1 w-2/3 rounded-full bg-emerald-300/40" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <div className="space-y-1.5">
                <span className="block h-1.5 w-24 rounded-full bg-slate-200/75" />
                <span className="block h-1 w-32 rounded-full bg-slate-500/35" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["bg-cyan-400/20", "bg-violet-400/20", "bg-emerald-400/20"].map(
                  (color, index) => (
                    <div
                      className="rounded-md border border-white/8 bg-white/[0.025] p-2"
                      key={color}
                    >
                      <span className={cn("block size-4 rounded-full", color)} />
                      <span className="mt-2 block h-1 w-full rounded-full bg-white/14" />
                      <span className="mt-1 block h-1 w-2/3 rounded-full bg-white/8" />
                      <span className="sr-only">Service preview item {index + 1}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      )}
      {badge && (
        <span className="pointer-events-none absolute top-3 left-3 z-20 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] text-slate-200 uppercase shadow-lg backdrop-blur-md">
          {badge}
        </span>
      )}
      {children}
    </div>
  );
}
