import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type PerkCardProps = {
  perk: {
    category?: string;
    description: string;
    destinationUrl?: string;
    eligibility?: string;
    icon: LucideIcon;
    offerLabel?: string;
    providerName?: string;
    terms?: string;
    title: string;
  };
};

export function PerkCard({ perk }: PerkCardProps) {
  const Icon = perk.icon;

  return (
    <Card
      className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
      variant="glass"
    >
      <CardHeader className="gap-4 px-5">
        <span className="flex size-11 items-center justify-center rounded-xl border bg-primary/10 text-primary shadow-xs">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-primary">
              {perk.providerName ?? "Digital perk"}
            </p>
            {perk.category && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                {perk.category}
              </span>
            )}
          </div>
          <h3 className="mt-1 font-heading text-base font-semibold">
            {perk.title}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5">
        <p className="text-sm leading-6 text-muted-foreground">
          {perk.description}
        </p>
        {perk.offerLabel && (
          <p className="mt-4 inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            {perk.offerLabel}
          </p>
        )}
        {perk.eligibility && (
          <div className="mt-4 border-t pt-4">
            <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-primary"
              />
              {perk.eligibility}
            </p>
            {perk.terms && (
              <p className="mt-2 text-[10px] leading-4 text-muted-foreground/80">
                {perk.terms}
              </p>
            )}
          </div>
        )}
        {perk.destinationUrl ? (
          <a
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            href={perk.destinationUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            Visit official provider
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        ) : (
          <Link
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            href="/perks"
          >
            View student perks
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
