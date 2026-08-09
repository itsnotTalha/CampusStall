import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPanel({
  actionHref,
  actionLabel,
  children,
  description,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <Card className="gap-0" variant="glass">
      <CardHeader className="border-b pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-semibold">{title}</CardTitle>
            {description && (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actionHref && actionLabel && (
            <Link
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
              href={actionHref}
            >
              {actionLabel}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0">{children}</CardContent>
    </Card>
  );
}
