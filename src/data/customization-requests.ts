import type { Database } from "@/types/database";

export type CustomizationRequestStatus =
  Database["public"]["Enums"]["customization_request_status"];

export type CustomizationRequestView = {
  acceptedAt: string | null;
  budgetBdt: number;
  buyerId: string;
  buyerName: string;
  completedAt: string | null;
  createdAt: string;
  deadline: string;
  id: string;
  note: string | null;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  requestedChanges: string;
  sellerId: string;
  sellerName: string;
  startedAt: string | null;
  status: CustomizationRequestStatus;
  updatedAt: string;
};

export const customizationStatusDetails: Record<
  CustomizationRequestStatus,
  { description: string; label: string; style: string }
> = {
  pending: {
    label: "Pending",
    description: "Waiting for the seller to review the request.",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  accepted: {
    label: "Accepted",
    description: "The seller accepted the proposed customization.",
    style: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  declined: {
    label: "Declined",
    description: "The seller declined this request.",
    style: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  in_progress: {
    label: "In progress",
    description: "The seller is working on the requested changes.",
    style: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  completed: {
    label: "Completed",
    description: "The customization request was completed.",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    description: "The buyer cancelled this request.",
    style: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
};
