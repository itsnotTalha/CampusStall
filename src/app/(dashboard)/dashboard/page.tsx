import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bookmark,
  CircleDollarSign,
  Clock3,
  FolderCheck,
  MessageSquareText,
  Plus,
  ReceiptText,
  ShoppingBag,
  Star,
  WandSparkles,
} from "lucide-react";

import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import {
  DashboardOrderList,
  DashboardProjectList,
  DashboardRequestList,
} from "@/components/dashboard/dashboard-lists";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/queries";
import { formatBdt } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/dashboard");

  const data = await getDashboardData(
    auth.userId,
    auth.profile?.is_seller ?? false,
  );
  const firstName =
    auth.profile?.display_name.trim().split(/\s+/)[0] ?? "there";
  const ratingValue =
    data.seller.averageRating === null
      ? "—"
      : data.seller.averageRating.toFixed(1);

  return (
    <div className="space-y-10 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Account overview
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            A live view of your CampusStall activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "h-9 gap-2")}
            href="/explore"
          >
            <ShoppingBag aria-hidden="true" className="size-4" />
            Explore
          </Link>
          <Link
            className={cn(buttonVariants(), "h-9 gap-2")}
            href="/sell/project"
          >
            <Plus aria-hidden="true" className="size-4" />
            List a project
          </Link>
        </div>
      </header>

      {data.seller.enabled ? (
        <section className="space-y-5" aria-labelledby="seller-overview">
          <div>
            <p className="text-xs font-semibold text-primary">Seller workspace</p>
            <h2
              className="mt-1 font-heading text-xl font-semibold tracking-tight"
              id="seller-overview"
            >
              Seller dashboard
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <AnalyticsCard
              detail="Published listings"
              href="/sell/projects"
              icon={FolderCheck}
              label="Active projects"
              value={String(data.seller.activeProjectCount)}
            />
            <AnalyticsCard
              detail="Awaiting review"
              href="/sell/projects"
              icon={Clock3}
              label="Pending projects"
              value={String(data.seller.pendingProjectCount)}
            />
            <AnalyticsCard
              detail={`${data.seller.paidOrderCount} paid or fulfilled`}
              href="/orders"
              icon={ReceiptText}
              label="Total orders"
              value={String(data.seller.totalOrderCount)}
            />
            <AnalyticsCard
              detail="Recorded demo-order value"
              href="/orders"
              icon={CircleDollarSign}
              label="Total sales value"
              value={formatBdt(data.seller.totalSalesBdt)}
            />
            <AnalyticsCard
              detail={
                data.seller.reviewCount > 0
                  ? `${data.seller.reviewCount} published review${data.seller.reviewCount === 1 ? "" : "s"}`
                  : "No published reviews"
              }
              href="/sell/projects"
              icon={Star}
              label="Average rating"
              value={ratingValue}
            />
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
            <DashboardPanel
              actionHref="/orders"
              actionLabel="Sales history"
              description="Recorded demo-order value over the last six months."
              title="Sales trend"
            >
              <SalesChart points={data.seller.salesTrend} />
            </DashboardPanel>
            <DashboardPanel
              actionHref="/sell/projects"
              actionLabel="Manage"
              description="Published, pending, and draft project listings."
              title="Project status"
            >
              <DashboardProjectList projects={data.seller.projects} />
            </DashboardPanel>
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-2">
            <DashboardPanel
              actionHref="/orders"
              actionLabel="View all"
              title="Recent purchases from buyers"
            >
              <DashboardOrderList
                orders={data.seller.orders}
                perspective="seller"
              />
            </DashboardPanel>
            <DashboardPanel
              actionHref="/sell/customization-requests"
              actionLabel="View all"
              title="Recent customization requests"
            >
              <DashboardRequestList
                perspective="seller"
                requests={data.seller.requests}
              />
            </DashboardPanel>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-primary/[0.045] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold">Have a project to share?</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Create your first listing to unlock seller analytics and order tracking.
            </p>
          </div>
          <Link
            className={cn(buttonVariants(), "h-9 shrink-0 gap-2")}
            href="/sell/project"
          >
            <Plus aria-hidden="true" className="size-4" />
            Sell a project
          </Link>
        </section>
      )}

      <section className="space-y-5" aria-labelledby="buyer-overview">
        <div>
          <p className="text-xs font-semibold text-primary">Buyer workspace</p>
          <h2
            className="mt-1 font-heading text-xl font-semibold tracking-tight"
            id="buyer-overview"
          >
            Your activity
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsCard
            detail="Project orders placed"
            href="/purchases"
            icon={ShoppingBag}
            label="Purchases"
            value={String(data.buyer.purchases.length)}
          />
          <AnalyticsCard
            detail="Saved ready-made projects"
            icon={Bookmark}
            label="Saved projects"
            value={String(data.buyer.savedProjectCount)}
          />
          <AnalyticsCard
            detail="Project help and customization"
            href="/customization-requests"
            icon={WandSparkles}
            label="Requests"
            value={String(data.buyer.totalRequestCount)}
          />
          <AnalyticsCard
            detail={`${data.buyer.conversations.length} conversation${data.buyer.conversations.length === 1 ? "" : "s"}`}
            href="/messages"
            icon={MessageSquareText}
            label="Unread messages"
            value={String(data.buyer.unreadMessageCount)}
          />
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-2">
          <DashboardPanel
            actionHref="/purchases"
            actionLabel="Purchase history"
            title="Recent purchases"
          >
            <DashboardOrderList
              orders={data.buyer.purchases}
              perspective="buyer"
            />
          </DashboardPanel>
          <DashboardPanel
            actionHref="/customization-requests"
            actionLabel="View all"
            title="Recent customization requests"
          >
            <DashboardRequestList
              perspective="buyer"
              requests={data.buyer.requests}
            />
          </DashboardPanel>
        </div>
      </section>
    </div>
  );
}
