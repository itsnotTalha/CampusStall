import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  FileText,
  LockKeyhole,
  UserRound,
  WandSparkles,
} from "lucide-react";

import { transitionCustomizationRequestAction } from "@/app/(dashboard)/customization-requests/actions";
import { CustomizationStatusBadge } from "@/components/customization/customization-status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  customizationStatusDetails,
  type CustomizationRequestStatus,
} from "@/data/customization-requests";
import { getAuthContext } from "@/lib/auth/session";
import { getCustomizationRequestForUser } from "@/lib/customization-requests/queries";
import { databaseIdPattern } from "@/lib/database-id";
import { formatBdt, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Customization Request" };

type CustomizationRequestPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    created?: string | string[];
    error?: string | string[];
    status?: string | string[];
  }>;
};

export default async function CustomizationRequestPage({
  params,
  searchParams,
}: CustomizationRequestPageProps) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/customization-requests");

  const { id } = await params;
  if (!databaseIdPattern.test(id)) notFound();

  const request = await getCustomizationRequestForUser(id, auth.userId);
  if (!request) notFound();

  const query = await searchParams;
  const isBuyer = request.buyerId === auth.userId;
  const isSeller = request.sellerId === auth.userId;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        href={isBuyer ? "/customization-requests" : "/sell/customization-requests"}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to requests
      </Link>

      {(query.created || query.status) && (
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-sm">
          {query.created
            ? "Customization request sent privately to the project seller."
            : "Customization request status updated."}
        </div>
      )}
      {query.error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
          That status change is not allowed for your role or the current request state.
        </div>
      )}

      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CustomizationStatusBadge status={request.status} />
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              <LockKeyhole aria-hidden="true" className="size-3" />
              Private request
            </span>
          </div>
          <h1 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            {request.projectTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Request #{request.id.slice(0, 8).toUpperCase()} · Created {formatDate(request.createdAt)}
          </p>
        </div>
        <p className="text-2xl font-semibold">{formatBdt(request.budgetBdt)}</p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-white/[0.045]">
            <div className="flex items-center gap-2">
              <WandSparkles aria-hidden="true" className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Requested changes</h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {request.requestedChanges}
            </p>

            {request.note && (
              <div className="mt-6 border-t pt-5">
                <div className="flex items-center gap-2">
                  <FileText aria-hidden="true" className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Additional note</h3>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {request.note}
                </p>
              </div>
            )}
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <Detail icon={CircleDollarSign} label="Proposed budget">
              {formatBdt(request.budgetBdt)}
            </Detail>
            <Detail icon={CalendarDays} label="Requested deadline">
              {formatDate(request.deadline)}
            </Detail>
            <Detail icon={UserRound} label={isBuyer ? "Seller" : "Buyer"}>
              {isBuyer ? request.sellerName : request.buyerName}
            </Detail>
          </section>
        </div>

        <aside className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
          <h2 className="text-sm font-semibold">Request status</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {customizationStatusDetails[request.status].description}
          </p>

          <div className="mt-5 space-y-2 border-t pt-5">
            {isSeller && request.status === "pending" && (
              <>
                <TransitionForm
                  label="Accept request"
                  requestId={request.id}
                  status="accepted"
                />
                <TransitionForm
                  label="Decline request"
                  requestId={request.id}
                  status="declined"
                  variant="outline"
                />
              </>
            )}
            {isSeller && request.status === "accepted" && (
              <TransitionForm
                label="Start work"
                requestId={request.id}
                status="in_progress"
              />
            )}
            {isSeller && request.status === "in_progress" && (
              <TransitionForm
                label="Mark completed"
                requestId={request.id}
                status="completed"
              />
            )}
            {isBuyer && ["pending", "accepted"].includes(request.status) && (
              <TransitionForm
                label="Cancel request"
                requestId={request.id}
                status="cancelled"
                variant="outline"
              />
            )}
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full")}
              href={`/projects/${request.projectSlug}`}
            >
              View project
            </Link>
          </div>

          <p className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-muted-foreground">
            <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Only this buyer and project seller can read the request details. No
            realtime messaging is included.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Detail({
  children,
  icon: Icon,
  label,
}: {
  children: React.ReactNode;
  icon: typeof CircleDollarSign;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-4 dark:border-white/10 dark:bg-white/[0.045]">
      <Icon aria-hidden="true" className="size-4 text-primary" />
      <p className="mt-3 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{children}</p>
    </div>
  );
}

function TransitionForm({
  label,
  requestId,
  status,
  variant = "default",
}: {
  label: string;
  requestId: string;
  status: Exclude<CustomizationRequestStatus, "pending">;
  variant?: "default" | "outline";
}) {
  return (
    <form action={transitionCustomizationRequestAction}>
      <input name="requestId" type="hidden" value={requestId} />
      <input name="status" type="hidden" value={status} />
      <button
        className={cn(buttonVariants({ variant }), "h-10 w-full")}
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}
