"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { OrderStatus } from "@/data/orders";
import { getAuthContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { readDatabaseId } from "@/lib/orders/validation";

export async function createDemoOrderAction(formData: FormData) {
  const packageId = readDatabaseId(formData.get("packageId"));
  if (!packageId) redirect("/purchases?error=invalid-package");

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/checkout/project/${packageId}`);

  const supabase = await createClient();
  const { data: orderId, error } = await supabase.rpc(
    "create_demo_project_order",
    { target_package_id: packageId },
  );

  if (error || !orderId) {
    redirect(`/checkout/project/${packageId}?error=unavailable`);
  }

  revalidatePath("/orders");
  revalidatePath("/purchases");
  redirect(`/orders/${orderId}?checkout=created`);
}

export async function completeDemoPaymentAction(formData: FormData) {
  const orderId = readDatabaseId(formData.get("orderId"));
  if (!orderId) redirect("/purchases?error=invalid-order");

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/orders/${orderId}`);

  const supabase = await createClient();
  const { error } = await supabase.rpc("complete_demo_project_payment", {
    target_order_id: orderId,
  });

  if (error) redirect(`/orders/${orderId}?error=payment`);

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/purchases");
  redirect(`/orders/${orderId}?payment=complete`);
}

export async function transitionProjectOrderAction(formData: FormData) {
  const orderId = readDatabaseId(formData.get("orderId"));
  const requestedStatus = formData.get("status");
  const allowedStatuses: readonly OrderStatus[] = [
    "cancelled",
    "delivered",
    "completed",
  ];

  if (
    !orderId ||
    typeof requestedStatus !== "string" ||
    !allowedStatuses.includes(requestedStatus as OrderStatus)
  ) {
    redirect("/orders?error=invalid-status");
  }

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/orders/${orderId}`);

  const supabase = await createClient();
  const { error } = await supabase.rpc("transition_project_order", {
    target_order_id: orderId,
    target_status: requestedStatus as OrderStatus,
  });

  if (error) redirect(`/orders/${orderId}?error=transition`);

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/purchases");
  redirect(`/orders/${orderId}?status=updated`);
}
