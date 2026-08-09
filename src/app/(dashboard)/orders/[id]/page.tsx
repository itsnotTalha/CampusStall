import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  completeDemoPaymentAction,
  transitionProjectOrderAction,
} from "@/app/(dashboard)/orders/actions";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  entitledOrderStatuses,
  humanizeAsset,
  licenseLabels,
  orderStatusDetails,
} from "@/data/orders";
import { getAuthContext } from "@/lib/auth/session";
import { formatBdt, formatDate } from "@/lib/format";
import {
  getEntitledProjectFileName,
  getOrderForUser,
} from "@/lib/orders/queries";
import { databaseIdPattern } from "@/lib/orders/validation";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Order details" };

type OrderPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    checkout?: string | string[];
    error?: string | string[];
    payment?: string | string[];
    status?: string | string[];
  }>;
};

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/orders");

  const { id } = await params;
  if (!databaseIdPattern.test(id)) notFound();

  const order = await getOrderForUser(id, auth.userId);
  if (!order) notFound();

  const query = await searchParams;
  const isBuyer = order.buyerId === auth.userId;
  const isSeller = order.sellerId === auth.userId;
  const isEntitled =
    isBuyer && entitledOrderStatuses.includes(order.status);
  const archiveName = isEntitled
    ? await getEntitledProjectFileName(order.id)
    : null;
  const includesDocumentation = order.snapshot.includedAssets.some((asset) =>
    ["documentation", "installation_guide", "presentation"].includes(asset),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        href={isBuyer ? "/purchases" : "/orders"}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to {isBuyer ? "purchases" : "sales"}
      </Link>

      {(query.checkout || query.payment || query.status) && (
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-sm">
          {query.checkout
            ? "Demo order created. Complete the simulated payment to unlock the protected project archive."
            : query.payment
              ? "Demo payment completed. Your authorized download is ready."
              : "Order status updated."}
        </div>
      )}
      {query.error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
          The requested order action could not be completed. Refresh and try again.
        </div>
      )}

      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
              Demo Payment
            </span>
          </div>
          <h1 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            {order.snapshot.projectTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Order #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.createdAt)}
          </p>
        </div>
        <p className="text-2xl font-semibold">{formatBdt(order.totalBdt)}</p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-white/[0.045]">
            <h2 className="text-base font-semibold">Order details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail icon={PackageCheck} label="Package">
                {order.snapshot.packageName}
              </Detail>
              <Detail icon={ShieldCheck} label="License">
                {order.licenseType
                  ? licenseLabels[order.licenseType]
                  : "Project license"}
              </Detail>
              <Detail icon={UserRound} label={isBuyer ? "Seller" : "Buyer"}>
                {isBuyer
                  ? order.snapshot.sellerName
                  : order.snapshot.buyerName}
              </Detail>
              <Detail icon={CalendarDays} label="Purchase date">
                {formatDate(order.createdAt)}
              </Detail>
            </div>

            {order.snapshot.includedAssets.length > 0 && (
              <div className="mt-6 border-t pt-5">
                <h3 className="text-sm font-semibold">Included content</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {order.snapshot.includedAssets.map((asset) => (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground" key={asset}>
                      <CheckCircle2 aria-hidden="true" className="size-3.5 text-primary" />
                      {humanizeAsset(asset)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-white/[0.045]">
            <h2 className="text-base font-semibold">Files &amp; documentation</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Protected archives use short-lived download links generated only
              after buyer entitlement is verified.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {archiveName ? (
                <Link
                  className={cn(buttonVariants(), "h-10 gap-2")}
                  href={`/orders/${order.id}/download`}
                >
                  <Download aria-hidden="true" />
                  Download {archiveName}
                </Link>
              ) : (
                <Button className="h-10" disabled type="button" variant="outline">
                  <Download aria-hidden="true" />
                  {isBuyer && order.status === "pending"
                    ? "Available after demo payment"
                    : "Download unavailable"}
                </Button>
              )}
              {order.snapshot.demoUrl && (
                <a
                  className={cn(buttonVariants({ variant: "outline" }), "h-10 gap-2")}
                  href={order.snapshot.demoUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <ExternalLink aria-hidden="true" />
                  Open seller demo
                </a>
              )}
            </div>
            {includesDocumentation && (
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <FileText aria-hidden="true" className="size-4 text-primary" />
                Documentation is included inside the protected project package.
              </p>
            )}
          </section>
        </div>

        <aside className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
          <h2 className="text-sm font-semibold">Order status</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {orderStatusDetails[order.status].description}
          </p>

          <div className="mt-5 space-y-2 border-t pt-5">
            {isBuyer && order.status === "pending" && (
              <>
                <form action={completeDemoPaymentAction}>
                  <input name="orderId" type="hidden" value={order.id} />
                  <button className={cn(buttonVariants(), "h-10 w-full")} type="submit">
                    Complete demo payment
                  </button>
                </form>
                <OrderTransitionForm
                  label="Cancel order"
                  orderId={order.id}
                  status="cancelled"
                  variant="ghost"
                />
              </>
            )}
            {isSeller && order.status === "paid" && (
              <OrderTransitionForm
                label="Mark as delivered"
                orderId={order.id}
                status="delivered"
              />
            )}
            {isBuyer && order.status === "delivered" && (
              <OrderTransitionForm
                label="Mark as completed"
                orderId={order.id}
                status="completed"
              />
            )}
            {order.snapshot.projectSlug && (
              <Link
                className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full")}
                href={`/projects/${order.snapshot.projectSlug}`}
              >
                View project
              </Link>
            )}
            {isBuyer && (
              <Button
                className="h-10 w-full"
                disabled
                title="Messaging will be enabled in Roadmap Phase 9"
                type="button"
                variant="outline"
              >
                <MessageCircle aria-hidden="true" />
                Contact seller
              </Button>
            )}
          </div>
          {isBuyer && (
            <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
              Seller messaging is reserved for Phase 9.
            </p>
          )}
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
  icon: typeof PackageCheck;
  label: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border bg-background/45 p-4">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>
        <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold">{children}</p>
      </div>
    </div>
  );
}

function OrderTransitionForm({
  label,
  orderId,
  status,
  variant = "default",
}: {
  label: string;
  orderId: string;
  status: "cancelled" | "delivered" | "completed";
  variant?: "default" | "ghost";
}) {
  return (
    <form action={transitionProjectOrderAction}>
      <input name="orderId" type="hidden" value={orderId} />
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
