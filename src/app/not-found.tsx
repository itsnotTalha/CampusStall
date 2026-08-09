import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page may have moved, or the address may be incorrect.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link className={cn(buttonVariants())} href="/">
            Go home
          </Link>
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            href="/explore"
          >
            Explore marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
