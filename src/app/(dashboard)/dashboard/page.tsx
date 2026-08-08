import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
};

const placeholderMetrics = [
  { label: "Purchases", detail: "No purchases yet" },
  { label: "Listings", detail: "No active listings" },
  { label: "Messages", detail: "No unread messages" },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium text-primary">Overview</p>
        <h1 className="font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Your CampusStall activity will be organized here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {placeholderMetrics.map((metric) => (
          <Card className="gap-3 shadow-xs" key={metric.label} size="sm">
            <CardHeader>
              <CardDescription className="font-medium">
                {metric.label}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                —
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {metric.detail}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-80 justify-center border-border/80 shadow-xs">
        <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-muted/60 text-muted-foreground shadow-xs">
            <LayoutDashboard aria-hidden="true" className="size-5" />
          </span>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Your activity will appear here
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Purchases, listings, messages, and saved items will populate this
            dashboard as those features become available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
