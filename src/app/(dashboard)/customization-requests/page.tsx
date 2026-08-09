import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Store } from "lucide-react";

import { CustomizationRequestList } from "@/components/customization/customization-request-list";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { getCustomizationRequestsForUser } from "@/lib/customization-requests/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Customization Requests" };

export default async function BuyerCustomizationRequestsPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/customization-requests");

  const requests = await getCustomizationRequestsForUser(auth.userId, "buyer");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Buyer workspace</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Customization requests
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track requests you sent to project sellers.
          </p>
        </div>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          href="/sell/customization-requests"
        >
          <Store aria-hidden="true" />
          Seller requests
        </Link>
      </header>

      <CustomizationRequestList
        emptyMessage="Request changes from a published project page to begin."
        perspective="buyer"
        requests={requests}
      />
    </div>
  );
}
