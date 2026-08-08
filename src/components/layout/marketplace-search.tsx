import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MarketplaceSearchProps = {
  className?: string;
};

export function MarketplaceSearch({ className }: MarketplaceSearchProps) {
  return (
    <div className={cn("relative w-full", className)} role="search">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Search CampusStall"
        className="h-10 border-border/90 bg-muted/45 pr-14 pl-9 shadow-none placeholder:text-muted-foreground/90 focus-visible:bg-card"
        placeholder="Search projects, talent, and perks"
        type="search"
      />
      <span className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs sm:inline-flex">
        /
      </span>
    </div>
  );
}
