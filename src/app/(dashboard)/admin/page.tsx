import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  Users,
  XCircle,
} from "lucide-react";

import { ProjectReviewList } from "@/components/admin/project-review-list";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/admin/projects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin" };

type AdminPageProps = {
  searchParams: Promise<{ moderated?: string | string[] }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [{ counts, pendingProjects }, params] = await Promise.all([
    getAdminDashboardData(),
    searchParams,
  ]);
  const moderated = Array.isArray(params.moderated)
    ? params.moderated[0]
    : params.moderated;
  const cards = [
    { label: "Pending Projects", value: counts.pending, icon: Clock3 },
    { label: "Approved Projects", value: counts.approved, icon: CheckCircle2 },
    { label: "Rejected Projects", value: counts.rejected, icon: XCircle },
    { label: "Total Projects", value: counts.total, icon: FolderKanban },
    { label: "Total Users", value: counts.users, icon: Users },
  ];

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Administration</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Project moderation
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review seller submissions before they become visible on the public
            marketplace.
          </p>
        </div>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          href="/admin/projects"
        >
          <FolderKanban aria-hidden="true" />
          All projects
        </Link>
      </header>

      {(moderated === "approved" || moderated === "rejected") && (
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-sm">
          Project {moderated === "approved" ? "approved and published" : "rejected"}
          successfully.
        </div>
      )}

      <section aria-label="Project totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ icon: Icon, label, value }) => (
          <Card key={label} size="sm" variant="glass">
            <CardHeader className="grid-cols-[1fr_auto]">
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
              <Icon aria-hidden="true" className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Projects awaiting review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pending listings remain hidden from the public marketplace.
          </p>
        </div>
        <ProjectReviewList projects={pendingProjects} />
      </section>
    </div>
  );
}
