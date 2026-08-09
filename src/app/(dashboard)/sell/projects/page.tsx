import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock3, FolderKanban, Pencil, Plus, WandSparkles } from "lucide-react";

import { DeleteProjectButton } from "@/components/seller/delete-project-button";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { formatBdt } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My Projects" };

type MyProjectsPageProps = {
  searchParams: Promise<{ submitted?: string | string[] }>;
};

const statusStyles = {
  archived: "bg-slate-500/10 text-slate-500",
  draft: "bg-sky-500/10 text-sky-500",
  pending: "bg-amber-500/10 text-amber-500",
  published: "bg-emerald-500/10 text-emerald-500",
  rejected: "bg-rose-500/10 text-rose-500",
} as const;

export default async function MyProjectsPage({
  searchParams,
}: MyProjectsPageProps) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/sell/projects");

  const params = await searchParams;
  const submitted = Array.isArray(params.submitted)
    ? params.submitted[0]
    : params.submitted;
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select(
      "id, title, slug, status, rejection_reason, base_price_bdt, technology_tags, updated_at, category_id",
    )
    .eq("seller_id", auth.userId)
    .order("updated_at", { ascending: false });
  const categoryIds = [...new Set(projects?.map((project) => project.category_id) ?? [])];
  const { data: categories } = categoryIds.length
    ? await supabase.from("categories").select("id, name").in("id", categoryIds)
    : { data: [] };
  const categoryNames = new Map(
    categories?.map((category) => [category.id, category.name]) ?? [],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Seller workspace</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            My Projects
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage drafts and track listings submitted for review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            href="/sell/customization-requests"
          >
            <WandSparkles aria-hidden="true" />
            Requests
          </Link>
          <Link
            className={cn(buttonVariants(), "gap-2")}
            href="/sell/project"
          >
            <Plus aria-hidden="true" />
            New project
          </Link>
        </div>
      </header>

      {submitted === "1" && (
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-sm">
          Your project was submitted and is now pending review.
        </div>
      )}

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              className="flex flex-col rounded-xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl transition-colors hover:border-primary/35 dark:border-white/10 dark:bg-white/[0.045]"
              key={project.id}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase",
                    statusStyles[project.status],
                  )}
                >
                  {project.status}
                </span>
                {project.status !== "published" && (
                  <DeleteProjectButton
                    projectId={project.id}
                    projectTitle={project.title}
                  />
                )}
              </div>
              <p className="mt-4 text-xs font-semibold text-primary">
                {categoryNames.get(project.category_id) ?? "Project"}
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                {project.title}
              </h2>
              {project.status === "rejected" && project.rejection_reason && (
                <p className="mt-2 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-xs leading-5 text-destructive">
                  {project.rejection_reason}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.technology_tags.slice(0, 4).map((tag) => (
                  <span
                    className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-end justify-between gap-3 border-t pt-5">
                <div>
                  <p className="font-semibold">{formatBdt(project.base_price_bdt)}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock3 aria-hidden="true" className="size-3" />
                    Updated {new Date(project.updated_at).toLocaleDateString("en-BD")}
                  </p>
                </div>
                {project.status !== "published" && (
                  <Link
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "gap-1.5",
                    )}
                    href={`/sell/project?project=${project.id}`}
                  >
                    <Pencil aria-hidden="true" />
                    Edit
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card/55 px-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderKanban aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No project listings yet</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Create a detailed listing and submit it for marketplace review.
          </p>
          <Link className={cn(buttonVariants(), "mt-5 gap-2")} href="/sell/project">
            <Plus aria-hidden="true" />
            List your first project
          </Link>
        </div>
      )}
    </div>
  );
}
