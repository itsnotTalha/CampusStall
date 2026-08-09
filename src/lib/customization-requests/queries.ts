import "server-only";

import type { CustomizationRequestView } from "@/data/customization-requests";
import { createClient } from "@/lib/supabase/server";

const requestSelection =
  "id, project_id, buyer_id, seller_id, project_title, project_slug, requested_changes, budget_bdt, deadline, note, status, accepted_at, started_at, completed_at, created_at, updated_at";

type RequestRow = {
  accepted_at: string | null;
  budget_bdt: number;
  buyer_id: string;
  completed_at: string | null;
  created_at: string;
  deadline: string;
  id: string;
  note: string | null;
  project_id: string;
  project_slug: string;
  project_title: string;
  requested_changes: string;
  seller_id: string;
  started_at: string | null;
  status: CustomizationRequestView["status"];
  updated_at: string;
};

function toRequestView(
  row: RequestRow,
  profileNames: Map<string, string>,
): CustomizationRequestView {
  return {
    acceptedAt: row.accepted_at,
    budgetBdt: row.budget_bdt,
    buyerId: row.buyer_id,
    buyerName: profileNames.get(row.buyer_id) ?? "CampusStall buyer",
    completedAt: row.completed_at,
    createdAt: row.created_at,
    deadline: row.deadline,
    id: row.id,
    note: row.note,
    projectId: row.project_id,
    projectSlug: row.project_slug,
    projectTitle: row.project_title,
    requestedChanges: row.requested_changes,
    sellerId: row.seller_id,
    sellerName: profileNames.get(row.seller_id) ?? "CampusStall seller",
    startedAt: row.started_at,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

async function addParticipantNames(rows: RequestRow[]) {
  if (rows.length === 0) return [];

  const supabase = await createClient();
  const participantIds = [
    ...new Set(rows.flatMap((row) => [row.buyer_id, row.seller_id])),
  ];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", participantIds);
  const profileNames = new Map(
    profiles?.map((profile) => [profile.id, profile.display_name]) ?? [],
  );

  return rows.map((row) => toRequestView(row, profileNames));
}

export async function getCustomizationRequestsForUser(
  userId: string,
  perspective: "buyer" | "seller",
) {
  const supabase = await createClient();
  const column = perspective === "buyer" ? "buyer_id" : "seller_id";
  const { data, error } = await supabase
    .from("project_customization_requests")
    .select(requestSelection)
    .eq(column, userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return addParticipantNames(data);
}

export async function getCustomizationRequestForUser(
  requestId: string,
  userId: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_customization_requests")
    .select(requestSelection)
    .eq("id", requestId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .maybeSingle();

  if (error || !data) return null;
  const [request] = await addParticipantNames([data]);
  return request ?? null;
}
