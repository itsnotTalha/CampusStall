import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReceiptText, Store } from "lucide-react";

import { OrderList } from "@/components/orders/order-list";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Purchases" };

export default async function PurchasesPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/purchases");

  const orders = await getOrdersForUser(auth.userId, "buyer");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Buyer workspace</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Purchase history
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review project orders and access entitled files.
          </p>
        </div>
        <div className="flex gap-2">
          <Link className={cn(buttonVariants({ variant: "outline" }), "gap-2")} href="/orders">
            <Store aria-hidden="true" />
            Seller sales
          </Link>
          <Link className={cn(buttonVariants(), "gap-2")} href="/explore">
            <ReceiptText aria-hidden="true" />
            Explore
          </Link>
        </div>
      </header>

      <OrderList
        emptyMessage="Purchased ready-made projects will appear here after checkout."
        orders={orders}
        perspective="buyer"
      />
    </div>
  );
}
