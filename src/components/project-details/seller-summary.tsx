import { BadgeCheck, MessageCircle, ShieldCheck } from "lucide-react";

import { RatingDisplay } from "@/components/marketplace/rating-display";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import type { MarketplaceProject } from "@/data/marketplace";
import { cn } from "@/lib/utils";

type SellerSummaryProps = {
  isDemoListing?: boolean;
  project: MarketplaceProject;
  supportDays: number;
};

export function SellerSummary({
  isDemoListing = true,
  project,
  supportDays,
}: SellerSummaryProps) {
  const initials = project.seller.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <Avatar className="size-14 bg-primary/10">
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-lg font-semibold">
            {project.seller.name}
          </h3>
          {project.seller.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              Verified seller
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {project.reviewCount > 0 ? (
            <RatingDisplay
              rating={project.rating}
              reviewCount={project.reviewCount}
            />
          ) : (
            <span className="text-xs text-muted-foreground">No reviews yet</span>
          )}
          <span className="text-xs text-muted-foreground">
            Up to {supportDays} days package support
          </span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-3.5 text-primary" />
          {isDemoListing
            ? "Demo seller profile using local placeholder data."
            : "Project files and package access are protected by CampusStall."}
        </p>
      </div>
      <button
        className={cn(buttonVariants({ variant: "outline" }), "h-10 gap-2")}
        disabled
        title="Messaging will be enabled in Roadmap Phase 9"
        type="button"
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        Contact seller
      </button>
    </div>
  );
}
