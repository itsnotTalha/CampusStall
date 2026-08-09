"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CustomizationRequestStatus } from "@/data/customization-requests";
import { getAuthContext } from "@/lib/auth/session";
import { readDatabaseId } from "@/lib/database-id";
import { createClient } from "@/lib/supabase/server";

export type CustomizationRequestFormState = {
  error?: string;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createCustomizationRequestAction(
  _previousState: CustomizationRequestFormState,
  formData: FormData,
): Promise<CustomizationRequestFormState> {
  const projectId = readDatabaseId(formData.get("projectId"));
  const requestedChanges = readText(formData, "requestedChanges");
  const budgetBdt = Number(readText(formData, "budgetBdt"));
  const deadline = readText(formData, "deadline");
  const note = readText(formData, "note");

  if (!projectId) return { error: "This project is not available." };
  if (requestedChanges.length < 20 || requestedChanges.length > 10000) {
    return { error: "Requested changes must be between 20 and 10,000 characters." };
  }
  if (!Number.isInteger(budgetBdt) || budgetBdt < 1 || budgetBdt > 10000000) {
    return { error: "Enter a valid budget in BDT." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return { error: "Choose a valid deadline." };
  }
  if (note.length > 2000) {
    return { error: "The optional note must be 2,000 characters or fewer." };
  }

  const auth = await getAuthContext();
  if (!auth) return { error: "Sign in to request project customization." };

  const supabase = await createClient();
  const { data: requestId, error } = await supabase.rpc(
    "create_project_customization_request",
    {
      proposed_budget_bdt: budgetBdt,
      requested_changes: requestedChanges,
      requested_deadline: deadline,
      target_project_id: projectId,
      ...(note ? { optional_note: note } : {}),
    },
  );

  if (error || !requestId) {
    return {
      error:
        "Unable to create this request. Check the deadline or review any active request for this project.",
    };
  }

  revalidatePath("/customization-requests");
  revalidatePath("/sell/customization-requests");
  redirect(`/customization-requests/${requestId}?created=1`);
}

export async function transitionCustomizationRequestAction(formData: FormData) {
  const requestId = readDatabaseId(formData.get("requestId"));
  const requestedStatus = formData.get("status");
  const allowedStatuses: readonly CustomizationRequestStatus[] = [
    "accepted",
    "declined",
    "in_progress",
    "completed",
    "cancelled",
  ];

  if (
    !requestId ||
    typeof requestedStatus !== "string" ||
    !allowedStatuses.includes(requestedStatus as CustomizationRequestStatus)
  ) {
    redirect("/customization-requests?error=invalid-status");
  }

  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=/customization-requests/${requestId}`);

  const supabase = await createClient();
  const { error } = await supabase.rpc(
    "transition_project_customization_request",
    {
      target_request_id: requestId,
      target_status: requestedStatus as CustomizationRequestStatus,
    },
  );

  if (error) {
    redirect(`/customization-requests/${requestId}?error=transition`);
  }

  revalidatePath("/customization-requests");
  revalidatePath(`/customization-requests/${requestId}`);
  revalidatePath("/sell/customization-requests");
  redirect(`/customization-requests/${requestId}?status=updated`);
}
