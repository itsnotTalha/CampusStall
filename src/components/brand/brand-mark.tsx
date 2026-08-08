import Link from "next/link";
import { Store } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
};

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Store aria-hidden="true" className="size-4" strokeWidth={2.25} />
      </span>
      {!compact && (
        <span className="text-[1.05rem] font-semibold tracking-[-0.025em]">
          CampusStall
        </span>
      )}
      <span className="sr-only">CampusStall dashboard</span>
    </Link>
  );
}
