"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";

type SaveButtonProps = {
  listingTitle: string;
  className?: string;
  showLabel?: boolean;
};

export function SaveButton({
  listingTitle,
  className,
  showLabel = false,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const { checkingSession, requireAuth } = useRequireAuth();

  async function handleSave() {
    if (await requireAuth()) {
      setSaved((current) => !current);
    }
  }

  return (
    <button
      type="button"
      aria-label={`${saved ? "Remove" : "Save"} ${listingTitle}`}
      aria-pressed={saved}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border bg-card/95 text-muted-foreground shadow-sm outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60",
        showLabel && "h-10 w-full gap-2 px-3 text-sm font-medium",
        saved && "border-primary/20 bg-primary text-primary-foreground",
        className,
      )}
      disabled={checkingSession}
      onClick={handleSave}
    >
      <Bookmark
        aria-hidden="true"
        className={cn("size-4", saved && "fill-current")}
      />
      {showLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
