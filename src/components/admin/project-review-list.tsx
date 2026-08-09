/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FolderCheck, ImageIcon } from "lucide-react";

import { ProjectStatusBadge } from "@/components/admin/project-status-badge";
import { buttonVariants } from "@/components/ui/button";
import type { AdminProjectSummary } from "@/lib/admin/projects";
import { formatBdt, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProjectReviewList({
  emptyDescription = "New submissions will appear here when sellers send them for review.",
  emptyTitle = "No projects awaiting review",
  projects,
}: {
  emptyDescription?: string;
  emptyTitle?: string;
  projects: AdminProjectSummary[];
}) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card/55 px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FolderCheck aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">{emptyTitle}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
      <div className="divide-y divide-border/70">
        {projects.map((project) => (
          <article
            className="grid gap-4 p-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center sm:p-5"
            key={project.id}
          >
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {project.coverUrl ? (
                <img
                  alt={`${project.title} cover`}
                  className="size-full object-cover"
                  loading="lazy"
                  src={project.coverUrl}
                />
              ) : (
                <ImageIcon
                  aria-label="No cover image"
                  className="size-6 text-muted-foreground"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <ProjectStatusBadge status={project.status} />
                <span className="text-xs text-muted-foreground">
                  Submitted {formatDate(project.createdAt)}
                </span>
              </div>
              <h3 className="mt-2 truncate text-base font-semibold">
                {project.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {project.seller} · {project.category} · {project.department}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {formatBdt(project.basePriceBdt)}
              </p>
            </div>

            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto",
              )}
              href={`/admin/projects/${project.id}`}
            >
              Review
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
