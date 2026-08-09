import Link from "next/link";
import { BadgeCheck, Clock3 } from "lucide-react";

import { ListingThumbnail } from "@/components/marketplace/listing-thumbnail";
import { RatingDisplay } from "@/components/marketplace/rating-display";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MarketplaceService } from "@/data/marketplace";
import { formatBdt } from "@/lib/format";

type ServiceCardProps = {
  service: MarketplaceService;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card
      className="group h-full gap-0 py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
      variant="glass"
    >
      <ListingThumbnail
        badge="Student service"
        icon={service.icon}
        label={`${service.title} thumbnail`}
        tone={service.visualTone}
        variant="service"
      />
      <CardHeader className="gap-2 p-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold text-primary">
            {service.category}
          </p>
          <RatingDisplay
            rating={service.rating}
            reviewCount={service.reviewCount}
          />
        </div>
        <Link
          href={`/services/${service.id}`}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <h3 className="font-heading text-base leading-6 font-semibold tracking-[-0.015em]">
            {service.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {service.summary}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>by {service.seller.name}</span>
          {service.seller.verified && (
            <BadgeCheck
              aria-label="Verified seller"
              className="size-3.5 fill-primary text-primary-foreground"
            />
          )}
        </p>
      </CardHeader>
      <CardContent className="mt-auto px-5 pb-5">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {service.technologies.slice(0, 3).map((technology) => (
            <span
              className="rounded-md border border-border/60 bg-background/45 px-2 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-md dark:border-white/8 dark:bg-white/[0.045]"
              key={technology}
            >
              {technology}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between gap-4 border-t pt-4">
          <div>
            <p className="text-base font-semibold">
              From {formatBdt(service.startingPrice)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 aria-hidden="true" className="size-3.5" />
              {service.deliveryTime}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
