import { Bell, CircleHelp } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { MarketplaceSearch } from "@/components/layout/marketplace-search";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileNavigation />
        <BrandMark className="lg:hidden" />
        <MarketplaceSearch className="ml-auto hidden max-w-xl sm:block lg:ml-0" />
        <div className="ml-auto flex items-center gap-1">
          <Button
            aria-label="Help and support"
            className="hidden text-muted-foreground sm:inline-flex"
            size="icon"
            variant="ghost"
          >
            <CircleHelp aria-hidden="true" />
          </Button>
          <Button
            aria-label="Notifications"
            className="relative text-muted-foreground"
            size="icon"
            variant="ghost"
          >
            <Bell aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background" />
          </Button>
        </div>
      </div>
      <div className="px-4 pb-3 sm:hidden">
        <MarketplaceSearch />
      </div>
    </header>
  );
}
