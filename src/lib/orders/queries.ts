import "server-only";

import { parseOrderSnapshot, type OrderView } from "@/data/orders";
import { createClient } from "@/lib/supabase/server";

const orderSelection =
  "id, buyer_id, seller_id, project_package_id, status, total_bdt, currency, license_type, fulfillment_metadata, completed_at, created_at";

function toOrderView(
  order: {
    buyer_id: string;
    completed_at: string | null;
    created_at: string;
    currency: string;
    fulfillment_metadata: Parameters<typeof parseOrderSnapshot>[0];
    id: string;
    license_type: OrderView["licenseType"];
    project_package_id: string | null;
    seller_id: string;
    status: OrderView["status"];
    total_bdt: number;
  },
): OrderView {
  return {
    buyerId: order.buyer_id,
    completedAt: order.completed_at,
    createdAt: order.created_at,
    currency: order.currency,
    id: order.id,
    licenseType: order.license_type,
    projectPackageId: order.project_package_id,
    sellerId: order.seller_id,
    snapshot: parseOrderSnapshot(order.fulfillment_metadata),
    status: order.status,
    totalBdt: order.total_bdt,
  };
}

export async function getOrdersForUser(
  userId: string,
  perspective: "buyer" | "seller",
) {
  const supabase = await createClient();
  const column = perspective === "buyer" ? "buyer_id" : "seller_id";
  const { data, error } = await supabase
    .from("orders")
    .select(orderSelection)
    .eq(column, userId)
    .eq("item_type", "project")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data.map(toOrderView);
}

export async function getOrderForUser(orderId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(orderSelection)
    .eq("id", orderId)
    .eq("item_type", "project")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .maybeSingle();

  if (error || !data) return null;
  return toOrderView(data);
}

export async function getEntitledProjectFileName(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_entitled_project_file", {
    target_order_id: orderId,
  });

  if (error || !data?.[0]) return null;
  return data[0].original_filename;
}
