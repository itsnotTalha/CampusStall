import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { OrderList } from "@/components/orders/order-list";
import { buttonVariants } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Seller Orders" };

export default async function SellerOrdersPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/sign-in?next=/orders");

  const orders = await getOrdersForUser(auth.userId, "seller");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Seller workspace</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            Sales history
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track demo project sales and delivery status.
          </p>
        </div>
        <Link className={cn(buttonVariants({ variant: "outline" }), "gap-2")} href="/purchases">
          <ShoppingBag aria-hidden="true" />
          My purchases
        </Link>
      </header>

      <OrderList
        emptyMessage="Orders for your published ready-made projects will appear here."
        orders={orders}
        perspective="seller"
      />
    </div>
  );
}
