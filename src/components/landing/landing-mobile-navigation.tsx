"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { landingNavigation } from "@/data/landing";
import { cn } from "@/lib/utils";

export function LandingMobileNavigation({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button
            aria-label="Open navigation"
            className="md:hidden"
            size="icon"
            variant="ghost"
          />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent className="w-[19rem] gap-0 p-0 sm:max-w-[19rem]" side="right">
        <SheetHeader className="border-b px-5 py-[1.15rem]">
          <SheetTitle className="sr-only">CampusStall navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Explore the CampusStall student marketplace.
          </SheetDescription>
          <BrandMark href="/" name="CampusStall" />
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {landingNavigation.map((item) => (
            <Link
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2 border-t p-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "lg" }), "h-10 w-full")}
              >
                Open Dashboard
              </Link>
              <form action="/auth/sign-out" method="post">
                <Button className="h-10 w-full" size="lg" type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ size: "lg" }), "h-10 w-full")}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-10 w-full",
                )}
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
