import "server-only";

import {
  createSalesTrend,
  revenueOrderStatuses,
  type DashboardData,
  type DashboardProject,
} from "@/data/dashboard";
import { getCustomizationRequestsForUser } from "@/lib/customization-requests/queries";
import { getConversationsForUser } from "@/lib/messages/queries";
import { getOrdersForUser } from "@/lib/orders/queries";
import { createClient } from "@/lib/supabase/server";

export async function getDashboardData(
  userId: string,
  profileIsSeller: boolean,
): Promise<DashboardData> {
  const supabase = await createClient();
  const [
    { data: projectRows },
    { count: savedProjectCount },
    { count: projectHelpRequestCount },
    sellerOrders,
    buyerOrders,
    sellerRequests,
    buyerRequests,
    conversations,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, slug, status, base_price_bdt, updated_at")
      .eq("seller_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("saved_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("project_id", "is", null),
    supabase
      .from("project_requests")
      .select("id", { count: "exact", head: true })
      .eq("requested_by", userId),
    getOrdersForUser(userId, "seller"),
    getOrdersForUser(userId, "buyer"),
    getCustomizationRequestsForUser(userId, "seller"),
    getCustomizationRequestsForUser(userId, "buyer"),
    getConversationsForUser(userId),
  ]);

  const projects: DashboardProject[] = (projectRows ?? []).map((project) => ({
    basePriceBdt: project.base_price_bdt,
    id: project.id,
    slug: project.slug,
    status: project.status,
    title: project.title,
    updatedAt: project.updated_at,
  }));
  const projectIds = projects.map((project) => project.id);
  const { data: reviews } = projectIds.length
    ? await supabase
        .from("reviews")
        .select("rating")
        .in("project_id", projectIds)
        .eq("is_published", true)
    : { data: [] };
  const reviewRatings = (reviews ?? []).map((review) => review.rating);
  const qualifyingOrders = sellerOrders.filter((order) =>
    revenueOrderStatuses.includes(order.status),
  );

  return {
    buyer: {
      conversations,
      purchases: buyerOrders,
      requests: buyerRequests,
      savedProjectCount: savedProjectCount ?? 0,
      totalRequestCount:
        buyerRequests.length + (projectHelpRequestCount ?? 0),
      unreadMessageCount: conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0,
      ),
    },
    seller: {
      activeProjectCount: projects.filter(
        (project) => project.status === "published",
      ).length,
      averageRating:
        reviewRatings.length > 0
          ? reviewRatings.reduce((total, rating) => total + rating, 0) /
            reviewRatings.length
          : null,
      enabled: profileIsSeller || projects.length > 0,
      orders: sellerOrders,
      paidOrderCount: qualifyingOrders.length,
      pendingProjectCount: projects.filter(
        (project) => project.status === "pending",
      ).length,
      projects,
      requests: sellerRequests,
      reviewCount: reviewRatings.length,
      salesTrend: createSalesTrend(sellerOrders),
      totalOrderCount: sellerOrders.length,
      totalSalesBdt: qualifyingOrders.reduce(
        (total, order) => total + order.totalBdt,
        0,
      ),
    },
  };
}
