import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import { CustomizationRequestList } from "@/components/customization/customization-request-list";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { getCustomizationRequestsForUser } from "@/lib/customization-requests/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Seller Customization Requests" };

export default async function SellerCustomizationRequestsPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/sell/customization-requests");

  const requests = await getCustomizationRequestsForUser(auth.userId, "seller");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Seller workspace</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Project customization requests
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review private requests sent for projects you own.
          </p>
        </div>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          href="/customization-requests"
        >
          <UserRound aria-hidden="true" />
          My requests
        </Link>
      </header>

      <CustomizationRequestList
        emptyMessage="Requests from buyers will appear here when they ask to customize your projects."
        perspective="seller"
        requests={requests}
      />
    </div>
  );
}
