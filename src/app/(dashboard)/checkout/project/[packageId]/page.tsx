import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { createDemoOrderAction } from "@/app/(dashboard)/orders/actions";
import { buttonVariants } from "@/components/ui/button";
import { humanizeAsset, licenseLabels } from "@/data/orders";
import { getAuthContext } from "@/lib/auth/session";
import { formatBdt } from "@/lib/format";
import { databaseIdPattern } from "@/lib/orders/validation";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Demo Checkout" };

type CheckoutPageProps = {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/purchases");

  const { packageId } = await params;
  if (!databaseIdPattern.test(packageId)) notFound();

  const query = await searchParams;
  const hasError = Boolean(query.error);
  const supabase = await createClient();
  const { data: projectPackage } = await supabase
    .from("project_packages")
    .select(
      "id, project_id, name, description, price_bdt, license_type, included_assets, support_duration_days",
    )
    .eq("id", packageId)
    .eq("is_active", true)
    .maybeSingle();

  if (!projectPackage) notFound();

  const [{ data: project }, { data: existingOrder }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, seller_id, title, slug")
      .eq("id", projectPackage.project_id)
      .eq("status", "published")
      .maybeSingle(),
    supabase
      .from("orders")
      .select("id, status")
      .eq("buyer_id", auth.userId)
      .eq("project_package_id", packageId)
      .in("status", ["pending", "paid", "delivered", "completed"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!project) notFound();

  const { data: seller } = await supabase
    .from("profiles")
    .select("display_name, is_verified")
    .eq("id", project.seller_id)
    .maybeSingle();
  const isOwnProject = project.seller_id === auth.userId;

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
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
            Demo Payment
          </span>
          <span className="text-xs text-muted-foreground">
            No real money will be charged
          </span>
        </div>
        <h1 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          Confirm your project package
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Review the project, package, license, and total before creating a demo
          order.
        </p>
      </header>

      {hasError && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
          This demo order could not be created. The package may no longer be
          available.
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-white/[0.045]">
          <p className="text-xs font-semibold text-primary">Ready-made project</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sold by {seller?.display_name ?? "CampusStall seller"}
            {seller?.is_verified ? " · Verified seller" : ""}
          </p>

          <div className="mt-6 rounded-xl border bg-background/55 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{projectPackage.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {projectPackage.description}
                </p>
              </div>
              <p className="shrink-0 font-semibold">
                {formatBdt(projectPackage.price_bdt)}
              </p>
            </div>
            <p className="mt-4 flex items-center gap-2 border-t pt-4 text-xs font-medium">
              <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
              {licenseLabels[projectPackage.license_type]}
            </p>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold">Included content</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {projectPackage.included_assets.map((asset) => (
                <p className="flex items-center gap-2 text-xs text-muted-foreground" key={asset}>
                  <Check aria-hidden="true" className="size-3.5 text-primary" />
                  {humanizeAsset(asset)}
                </p>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3 text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatBdt(projectPackage.price_bdt)}</span>
            </div>
            <div className="flex justify-between gap-3 text-muted-foreground">
              <span>Platform fee</span>
              <span>{formatBdt(0)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t pt-3 font-semibold">
              <span>Total</span>
              <span>{formatBdt(projectPackage.price_bdt)}</span>
            </div>
          </div>

          {existingOrder ? (
            <Link
              className={cn(buttonVariants(), "mt-5 h-10 w-full")}
              href={`/orders/${existingOrder.id}`}
            >
              Continue existing order
            </Link>
          ) : (
            <form action={createDemoOrderAction} className="mt-5">
              <input name="packageId" type="hidden" value={packageId} />
              <button
                className={cn(buttonVariants(), "h-10 w-full")}
                disabled={isOwnProject}
                type="submit"
              >
                <CreditCard aria-hidden="true" />
                Create demo order
              </button>
            </form>
          )}

          {isOwnProject && (
            <p className="mt-3 text-xs leading-5 text-destructive">
              You cannot purchase your own project.
            </p>
          )}
          <div className="mt-5 flex items-start gap-2 border-t pt-4 text-[10px] leading-4 text-muted-foreground">
            <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Payment is simulated. Private files remain protected until the demo
            payment is completed.
          </div>
        </aside>
      </div>
    </div>
  );
}
