import { Star } from "lucide-react";

import type { ProjectReview } from "@/data/project-details";

type ReviewsListProps = {
  reviews: readonly ProjectReview[];
};

export function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article className="rounded-lg border bg-background p-4" key={review.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{review.author}</p>
              <p className="mt-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                {review.context} · Demo review
              </p>
            </div>
            <span
              aria-label={`${review.rating.toFixed(1)} out of 5`}
              className="inline-flex items-center gap-1 text-xs font-semibold"
            >
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {review.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {review.comment}
          </p>
        </article>
      ))}
    </div>
  );
}
