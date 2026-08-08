import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ListingThumbnailProps = {
  icon: LucideIcon;
  tone: string;
  label: string;
  badge?: string;
  className?: string;
  children?: ReactNode;
};

export function ListingThumbnail({
  icon: Icon,
  tone,
  label,
  badge,
  className,
  children,
}: ListingThumbnailProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        "relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b bg-muted/45 p-6",
        className,
      )}
      role="img"
    >
      <div className="absolute inset-4 rounded-lg border border-dashed border-foreground/10" />
      <div
        className={cn(
          "relative flex size-20 items-center justify-center rounded-2xl border shadow-sm sm:size-24",
          tone,
        )}
      >
        <Icon aria-hidden="true" className="size-9 sm:size-11" strokeWidth={1.6} />
      </div>
      {badge && (
        <span className="absolute top-3 left-3 rounded-md border bg-card/95 px-2 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase shadow-xs">
          {badge}
        </span>
      )}
      {children}
    </div>
  );
}
