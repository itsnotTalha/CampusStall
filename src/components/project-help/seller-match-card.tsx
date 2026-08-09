import { BadgeCheck, CheckCircle2, Code2, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SellerServiceMatch } from "@/data/project-help";
import { formatBdt } from "@/lib/format";

export function SellerMatchCard({ match }: { match: SellerServiceMatch }) {
  return (
    <Card className="h-full gap-0" variant="glass">
      <CardHeader className="gap-3 border-b px-5 pb-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            {match.score}/100 match score
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {match.categoryName}
          </span>
        </div>
        <div>
          <h3 className="font-heading text-base font-semibold">{match.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <UserRound aria-hidden="true" className="size-3.5" />
            {match.sellerName}
            {match.sellerVerified && (
              <BadgeCheck
                aria-label="Verified seller"
                className="size-3.5 fill-primary text-primary-foreground"
              />
            )}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5 pt-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {match.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {match.technologyTags.slice(0, 5).map((tag) => (
            <span
              className="inline-flex items-center gap-1 rounded-md border bg-background/45 px-2 py-1 text-[10px] text-muted-foreground"
              key={tag}
            >
              <Code2 aria-hidden="true" className="size-3" />
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 border-t pt-4">
          <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Why it matched
          </p>
          <div className="mt-2 space-y-1.5">
            {match.reasons.map((reason) => (
              <p className="flex items-center gap-1.5 text-xs" key={reason}>
                <CheckCircle2 aria-hidden="true" className="size-3.5 text-primary" />
                {reason}
              </p>
            ))}
          </div>
        </div>
        <p className="mt-auto pt-5 text-sm font-semibold">
          Services from {formatBdt(match.startingPriceBdt)}
        </p>
      </CardContent>
    </Card>
  );
}
