"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";

type SaveButtonProps = {
  listingTitle: string;
  className?: string;
};

export function SaveButton({ listingTitle, className }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      aria-label={`${saved ? "Remove" : "Save"} ${listingTitle}`}
      aria-pressed={saved}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border bg-card/95 text-muted-foreground shadow-sm outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring",
        saved && "border-primary/20 bg-primary text-primary-foreground",
        className,
      )}
      onClick={() => setSaved((current) => !current)}
    >
      <Bookmark
        aria-hidden="true"
        className={cn("size-4", saved && "fill-current")}
      />
    </button>
  );
}
