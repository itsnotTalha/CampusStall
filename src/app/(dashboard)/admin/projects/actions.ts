"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminAuth } from "@/lib/auth/admin";
import { databaseIdPattern } from "@/lib/database-id";
import { createClient } from "@/lib/supabase/server";

export type ModerationActionState = { error: string | null };

export async function moderateProjectAction(
  _previousState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const auth = await getAdminAuth();
  if (!auth) return { error: "You are not authorized to moderate projects." };

  const projectId = formData.get("projectId");
  const intent = formData.get("intent");
  const rejectionReasonValue = formData.get("rejectionReason");

  if (typeof projectId !== "string" || !databaseIdPattern.test(projectId)) {
    return { error: "Invalid project listing." };
  }

  if (intent !== "approve" && intent !== "reject") {
    return { error: "Invalid moderation action." };
  }

  const rejectionReason =
    typeof rejectionReasonValue === "string" ? rejectionReasonValue.trim() : "";

  if (
    intent === "reject" &&
    (rejectionReason.length < 5 || rejectionReason.length > 500)
  ) {
    return { error: "Enter a rejection reason between 5 and 500 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      rejection_reason: intent === "reject" ? rejectionReason : null,
      status: intent === "approve" ? "published" : "rejected",
    })
    .eq("id", projectId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: "Unable to update this project. Please try again." };
  }

  if (!data) {
    return { error: "Only pending projects can be moderated." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/explore");
  revalidatePath("/sell/projects");
  redirect(`/admin?moderated=${intent === "approve" ? "approved" : "rejected"}`);
}
