import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock3, WandSparkles } from "lucide-react";

import { CustomizationRequestForm } from "@/components/customization/customization-request-form";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Request Customization" };

type NewCustomizationRequestPageProps = {
  searchParams: Promise<{ project?: string | string[] }>;
};

export default async function NewCustomizationRequestPage({
  searchParams,
}: NewCustomizationRequestPageProps) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/customization-requests/new");

  const query = await searchParams;
  const projectSlug = Array.isArray(query.project)
    ? query.project[0]
    : query.project;
  if (!projectSlug) notFound();

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, title, slug, seller_id, support_duration_days")
    .eq("slug", projectSlug)
    .eq("status", "published")
    .maybeSingle();

  if (!project) notFound();

  const [{ data: seller }, { data: existingRequest }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, is_verified")
      .eq("id", project.seller_id)
      .maybeSingle(),
    supabase
      .from("project_customization_requests")
      .select("id, status")
      .eq("project_id", project.id)
      .eq("buyer_id", auth.userId)
      .in("status", ["pending", "accepted", "in_progress"])
      .limit(1)
      .maybeSingle(),
  ]);
  const isOwnProject = project.seller_id === auth.userId;
  const minimumDeadline = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        href={`/projects/${project.slug}`}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to project
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">Project customization</p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          Request changes to {project.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            Seller: {seller?.display_name ?? "CampusStall seller"}
            {seller?.is_verified && (
              <BadgeCheck aria-label="Verified seller" className="size-4 text-primary" />
            )}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="size-3.5" />
            Listed support: {project.support_duration_days} days
          </span>
        </div>
      </header>

      <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl sm:p-7 dark:border-white/10 dark:bg-white/[0.045]">
        {isOwnProject ? (
          <div className="py-10 text-center">
            <WandSparkles aria-hidden="true" className="mx-auto size-8 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">This is your project</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sellers cannot send customization requests to themselves.
            </p>
          </div>
        ) : existingRequest ? (
          <div className="py-10 text-center">
            <WandSparkles aria-hidden="true" className="mx-auto size-8 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">Active request already exists</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue with your existing {existingRequest.status.replace("_", " ")} request.
            </p>
            <Link
              className={cn(buttonVariants(), "mt-5")}
              href={`/customization-requests/${existingRequest.id}`}
            >
              View request
            </Link>
          </div>
        ) : (
          <CustomizationRequestForm
            minimumDeadline={minimumDeadline}
            projectId={project.id}
          />
        )}
      </section>
    </div>
  );
}
