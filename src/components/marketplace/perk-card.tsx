import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DigitalPerk } from "@/data/landing";

type PerkCardProps = {
  perk: DigitalPerk;
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
          <p className="text-xs font-semibold text-primary">Digital perk</p>
          <h3 className="mt-1 font-heading text-base font-semibold">
            {perk.title}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5">
        <p className="text-sm leading-6 text-muted-foreground">
          {perk.description}
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          href="/perks"
        >
          View student perks
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
