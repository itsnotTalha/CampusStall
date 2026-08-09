import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { LandingMobileNavigation } from "@/components/landing/landing-mobile-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { landingNavigation } from "@/data/landing";
import { getAuthContext } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export async function PublicHeader({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  const auth = await getAuthContext();
  const accountLabel = auth?.profile?.display_name ?? "Dashboard";

  if (variant === "compact") {
    return (
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
        <PageContainer className="flex h-14 items-center py-0">
          <BrandMark href="/" name="CampusStall" />
          <span className="ml-3 hidden border-l pl-3 text-xs font-medium text-muted-foreground sm:inline">
            Marketplace
          </span>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Link
              href={auth ? "/dashboard" : "/sign-in"}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-8 max-w-40 px-2.5 text-xs",
              )}
            >
              <span className="truncate">
                {auth ? accountLabel : "Sign in"}
              </span>
            </Link>
          </div>
        </PageContainer>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <PageContainer className="flex h-16 items-center py-0 lg:h-[4.5rem]">
        <BrandMark href="/" name="CampusStall" />
        <nav
          aria-label="Landing page navigation"
          className="ml-10 hidden items-center gap-1 md:flex"
        >
          {landingNavigation.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {auth ? (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-9 max-w-44 px-3",
                )}
              >
                <span className="truncate">{accountLabel}</span>
              </Link>
              <form action="/auth/sign-out" method="post">
                <Button className="h-9 px-3" type="submit" variant="ghost">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-3")}
              >
                Sign in
              </Link>
              <Link
                href="/sell"
                className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-3")}
              >
                Sell your project
              </Link>
            </>
          )}
          <Link
            href="/explore"
            className={cn(buttonVariants(), "h-9 px-4 shadow-sm")}
          >
            Explore
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <LandingMobileNavigation isAuthenticated={Boolean(auth)} />
        </div>
      </PageContainer>
    </header>
  );
}
