import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MarketplaceSearchProps = {
  className?: string;
};

export function MarketplaceSearch({ className }: MarketplaceSearchProps) {
  return (
    <form
      action="/explore"
      className={cn("relative w-full", className)}
      method="get"
      role="search"
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Search CampusStall"
        className="h-10 border-border/90 bg-muted/45 pl-9 shadow-none placeholder:text-muted-foreground/90 focus-visible:bg-card"
        name="q"
        placeholder="Search projects, talent, and perks"
        type="search"
      />
    </form>
  );
}
