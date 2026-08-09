import Link from "next/link";
import { CircleHelp } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { MarketplaceSearch } from "@/components/layout/marketplace-search";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import type { AuthContext } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export function TopHeader({ auth }: { auth: AuthContext }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileNavigation auth={auth} />
        <BrandMark className="lg:hidden" />
        <MarketplaceSearch className="ml-auto hidden max-w-xl sm:block lg:ml-0" />
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Link
            aria-label="Help and support"
            className={cn(
              buttonVariants({ size: "icon", variant: "ghost" }),
              "hidden text-muted-foreground sm:inline-flex",
            )}
            href="/project-help"
          >
            <CircleHelp aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="px-4 pb-3 sm:hidden">
        <MarketplaceSearch />
      </div>
    </header>
  );
}
