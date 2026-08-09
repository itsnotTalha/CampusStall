import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type PageLoadingProps = {
  compact?: boolean;
};

export function PageLoading({ compact = false }: PageLoadingProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "flex items-center justify-center px-6",
        compact ? "min-h-[45svh]" : "min-h-svh",
      )}
      role="status"
    >
      <div className="flex items-center gap-3 rounded-lg border bg-card/80 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        <span>Loading…</span>
      </div>
    </div>
  );
}
