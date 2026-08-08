import Link from "next/link";
import { BadgeCheck, Eye } from "lucide-react";

import { ListingThumbnail } from "@/components/marketplace/listing-thumbnail";
import { RatingDisplay } from "@/components/marketplace/rating-display";
import { SaveButton } from "@/components/marketplace/save-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MarketplaceProject } from "@/data/marketplace";
import { formatBdt } from "@/lib/format";

type ProjectCardProps = {
  project: MarketplaceProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group h-full gap-0 py-0 shadow-xs transition-all hover:-translate-y-0.5 hover:ring-primary/25 hover:shadow-md">
      <ListingThumbnail
        badge="Demo listing"
        icon={project.icon}
        label={`${project.title} thumbnail`}
        tone={project.visualTone}
      >
        {project.hasPreview && (
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border bg-card/95 px-2 py-1 text-[10px] font-semibold text-foreground shadow-xs">
            <Eye aria-hidden="true" className="size-3" />
            Preview
          </span>
        )}
        <SaveButton
          className="absolute top-3 right-3"
          listingTitle={project.title}
        />
      </ListingThumbnail>
      <CardHeader className="gap-2 p-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold text-primary">
            {project.category}
          </p>
          <RatingDisplay
            rating={project.rating}
            reviewCount={project.reviewCount}
          />
        </div>
        <Link
          href={`/projects/${project.id}`}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <h3 className="font-heading text-base leading-6 font-semibold tracking-[-0.015em]">
            {project.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {project.summary}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>by {project.seller.name}</span>
          {project.seller.verified && (
            <BadgeCheck
              aria-label="Verified seller"
              className="size-3.5 fill-primary text-primary-foreground"
            />
          )}
        </p>
      </CardHeader>
      <CardContent className="mt-auto px-5 pb-5">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => (
            <span
              className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
              key={technology}
            >
              {technology}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between border-t pt-4">
          <span>
            <span className="block text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Demo price
            </span>
            <span className="text-base font-semibold">
              {formatBdt(project.price)}
            </span>
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {project.difficulty}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
