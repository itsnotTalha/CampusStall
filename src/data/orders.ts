import type { Database, Json } from "@/types/database";

export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type LicenseType = Database["public"]["Enums"]["license_type"];

export type OrderSnapshot = {
  buyerName: string;
  demoUrl: string | null;
  includedAssets: string[];
  packageName: string;
  projectId: string | null;
  projectSlug: string | null;
  projectTitle: string;
  sellerName: string;
  supportDurationDays: number;
};

export type OrderView = {
  buyerId: string;
  completedAt: string | null;
  createdAt: string;
  currency: string;
  id: string;
  licenseType: LicenseType | null;
  projectPackageId: string | null;
  sellerId: string;
  snapshot: OrderSnapshot;
  status: OrderStatus;
  totalBdt: number;
};

export type PublicProjectPackage = {
  description: string;
  id: string;
  includedAssets: string[];
  licenseType: LicenseType;
  name: string;
  priceBdt: number;
  supportDurationDays: number;
};

export const entitledOrderStatuses: readonly OrderStatus[] = [
  "paid",
  "delivered",
  "completed",
];

export const orderStatusDetails: Record<
  OrderStatus,
  { description: string; label: string; style: string }
> = {
  pending: {
    label: "Pending",
    description: "Waiting for demo payment confirmation.",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  paid: {
    label: "Paid",
    description: "Demo payment completed. Files are available to the buyer.",
    style: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  delivered: {
    label: "Delivered",
    description: "The seller marked the ready-made project as delivered.",
    style: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  completed: {
    label: "Completed",
    description: "The buyer completed this order.",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    description: "This order was cancelled before payment.",
    style: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
  refunded: {
    label: "Refunded",
    description: "This order was refunded.",
    style: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
};

export const licenseLabels: Record<LicenseType, string> = {
  learning_personal: "Learning / Personal License",
  single_project: "Single Project License",
  commercial: "Commercial License",
};

function isRecord(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: Json | undefined) {
  return typeof value === "string" ? value : null;
}

function readStringArray(value: Json | undefined) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readSafeUrl(value: Json | undefined) {
  const candidate = readString(value);
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function parseOrderSnapshot(metadata: Json): OrderSnapshot {
  if (!isRecord(metadata)) {
    return emptyOrderSnapshot;
  }

  const supportDurationDays = Number(metadata.support_duration_days);

  return {
    buyerName: readString(metadata.buyer_name) ?? "CampusStall buyer",
    demoUrl: readSafeUrl(metadata.demo_url),
    includedAssets: readStringArray(metadata.included_assets),
    packageName: readString(metadata.package_name) ?? "Project package",
    projectId: readString(metadata.project_id),
    projectSlug: readString(metadata.project_slug),
    projectTitle: readString(metadata.project_title) ?? "Ready-made project",
    sellerName: readString(metadata.seller_name) ?? "CampusStall seller",
    supportDurationDays: Number.isInteger(supportDurationDays)
      ? supportDurationDays
      : 0,
  };
}

const emptyOrderSnapshot: OrderSnapshot = {
  buyerName: "CampusStall buyer",
  demoUrl: null,
  includedAssets: [],
  packageName: "Project package",
  projectId: null,
  projectSlug: null,
  projectTitle: "Ready-made project",
  sellerName: "CampusStall seller",
  supportDurationDays: 0,
};

export function humanizeAsset(value: string) {
  return value
    .split("_")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
