import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectReviewList } from "@/components/admin/project-review-list";
import { getAdminProjects } from "@/lib/admin/projects";

export const metadata: Metadata = { title: "Admin Projects" };

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        href="/admin"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Admin dashboard
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">Administration</p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          All project listings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the current state and submission details for every seller project.
        </p>
      </header>

      <ProjectReviewList
        emptyDescription="Seller projects will appear here after they are created."
        emptyTitle="No project listings"
        projects={projects}
      />
    </div>
  );
}
