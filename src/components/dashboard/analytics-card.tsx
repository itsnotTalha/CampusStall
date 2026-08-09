import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AnalyticsCard({
  detail,
  href,
  icon: Icon,
  label,
  value,
}: {
  detail: string;
  href?: string;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  const card = (
    <Card
      className="h-full gap-3 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/25 group-hover:shadow-md"
      size="sm"
      variant="glass"
    >
      <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-3">
        <div>
          <CardDescription className="text-xs font-medium">
            {label}
          </CardDescription>
          <CardTitle className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
            {value}
          </CardTitle>
        </div>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span className="truncate">{detail}</span>
        {href && (
          <ArrowUpRight
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 transition-transform",
              "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary",
            )}
          />
        )}
      </CardContent>
    </Card>
  );

  return href ? (
    <Link className="group block" href={href}>
      {card}
    </Link>
  ) : (
    <div>{card}</div>
  );
}
