import type { CustomizationRequestView } from "@/data/customization-requests";
import type { ConversationSummary } from "@/data/messages";
import type { OrderView } from "@/data/orders";
import type { Database } from "@/types/database";

export type DashboardProject = {
  basePriceBdt: number;
  id: string;
  slug: string;
  status: Database["public"]["Enums"]["listing_status"];
  title: string;
  updatedAt: string;
};

export type SalesTrendPoint = {
  key: string;
  label: string;
  orderCount: number;
  valueBdt: number;
};

export type DashboardData = {
  buyer: {
    conversations: ConversationSummary[];
    purchases: OrderView[];
    requests: CustomizationRequestView[];
    savedProjectCount: number;
    unreadMessageCount: number;
  };
  seller: {
    activeProjectCount: number;
    averageRating: number | null;
    enabled: boolean;
    orders: OrderView[];
    paidOrderCount: number;
    pendingProjectCount: number;
    projects: DashboardProject[];
    requests: CustomizationRequestView[];
    reviewCount: number;
    salesTrend: SalesTrendPoint[];
    totalOrderCount: number;
    totalSalesBdt: number;
  };
};

export const revenueOrderStatuses: readonly OrderView["status"][] = [
  "paid",
  "delivered",
  "completed",
];

const monthLabelFormatter = new Intl.DateTimeFormat("en-BD", {
  month: "short",
});

export function createSalesTrend(
  orders: OrderView[],
  now = new Date(),
): SalesTrendPoint[] {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1),
    );

    return {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      label: monthLabelFormatter.format(date),
      orderCount: 0,
      valueBdt: 0,
    } satisfies SalesTrendPoint;
  });
  const monthByKey = new Map(months.map((month) => [month.key, month]));

  for (const order of orders) {
    if (!revenueOrderStatuses.includes(order.status)) continue;

    const date = new Date(order.createdAt);
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    const month = monthByKey.get(key);

    if (month) {
      month.orderCount += 1;
      month.valueBdt += order.totalBdt;
    }
  }

  return months;
}
