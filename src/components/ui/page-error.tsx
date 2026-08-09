"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageErrorProps = {
  reset: () => void;
};

export function PageError({ reset }: PageErrorProps) {
  return (
    <main className="flex min-h-[70svh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center" role="alert">
        <AlertCircle
          aria-hidden="true"
          className="mx-auto size-8 text-destructive"
        />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The page could not be loaded. Try again, or return to the marketplace.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} type="button">
            Try again
          </Button>
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
