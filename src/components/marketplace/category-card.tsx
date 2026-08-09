import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectCategory } from "@/data/landing";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: ProjectCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={`/explore?category=${encodeURIComponent(category.name)}`}
      className="group flex min-h-32 flex-col justify-between rounded-xl border bg-card p-4 shadow-xs outline-none transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring sm:min-h-36 sm:p-5"
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-lg border",
          category.tone,
        )}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
      </span>
      <span className="flex items-end justify-between gap-3">
        <span className="max-w-36 text-sm leading-5 font-semibold">
          {category.name}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </span>
    </Link>
  );
}
