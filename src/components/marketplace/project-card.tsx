import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FeaturedProject } from "@/data/landing";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: FeaturedProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const Icon = project.icon;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full gap-0 py-0 shadow-xs transition-all group-hover:-translate-y-0.5 group-hover:ring-primary/25 group-hover:shadow-md">
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b bg-muted/45 p-6">
          <div className="absolute inset-4 rounded-lg border border-dashed border-foreground/10" />
          <div
            className={cn(
              "relative flex size-20 items-center justify-center rounded-2xl border shadow-sm sm:size-24",
              project.visualTone,
            )}
          >
            <Icon aria-hidden="true" className="size-9 sm:size-11" strokeWidth={1.6} />
          </div>
          <span className="absolute top-3 left-3 rounded-md border bg-card/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase shadow-xs">
            Demo listing
          </span>
        </div>
        <CardHeader className="gap-2 p-5 pb-3">
          <p className="text-xs font-semibold text-primary">{project.category}</p>
          <h3 className="font-heading text-base leading-6 font-semibold tracking-[-0.015em]">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {project.summary}
          </p>
        </CardHeader>
        <CardContent className="mt-auto px-5 pb-5">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span>
              <span className="block text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Demo price
              </span>
              <span className="text-base font-semibold">{project.price}</span>
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
