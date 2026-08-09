import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Trash2 } from "lucide-react";

import { removeSavedProjectAction } from "@/app/(dashboard)/saved/actions";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { formatBdt, formatDate } from "@/lib/format";
import { getSavedProjects } from "@/lib/saved/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Saved projects" };

export default async function SavedProjectsPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/saved");

  const projects = await getSavedProjects(auth.userId);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">Buyer workspace</p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          Saved projects
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revisit published projects you have saved.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/55 px-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bookmark aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No saved projects yet</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Save a published project to keep it handy here.
          </p>
          <Link className={cn(buttonVariants(), "mt-5")} href="/explore">
            Explore marketplace
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => (
            <article
              className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
              key={project.id}
            >
              <div className="min-w-0 flex-1">
                <Link
                  className="font-semibold tracking-tight hover:text-primary"
                  href={`/projects/${project.slug}`}
                >
                  {project.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Saved {formatDate(project.savedAt)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="font-semibold">{formatBdt(project.basePriceBdt)}</p>
                <form action={removeSavedProjectAction.bind(null, project.id)}>
                  <button
                    aria-label={`Remove ${project.title} from saved projects`}
                    className={cn(
                      buttonVariants({ size: "icon", variant: "ghost" }),
                      "text-muted-foreground hover:text-destructive",
                    )}
                    type="submit"
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
