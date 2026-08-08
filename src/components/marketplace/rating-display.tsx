import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type RatingDisplayProps = {
  rating: number;
  reviewCount: number;
  className?: string;
};

export function RatingDisplay({
  rating,
  reviewCount,
  className,
}: RatingDisplayProps) {
  return (
    <span
      aria-label={`${rating} out of 5 from ${reviewCount} demo reviews`}
      className={cn("inline-flex items-center gap-1 text-xs", className)}
    >
      <Star
        aria-hidden="true"
        className="size-3.5 fill-amber-400 text-amber-400"
      />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviewCount})</span>
    </span>
  );
}
