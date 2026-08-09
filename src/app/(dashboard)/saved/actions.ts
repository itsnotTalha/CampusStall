"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function setProjectSavedAction(projectId: string, saved: boolean) {
  if (!uuidPattern.test(projectId)) {
    return { error: "This project cannot be saved." };
  }

  const auth = await getAuthContext();
  if (!auth) return { error: "Sign in to save projects." };

  const supabase = await createClient();
  let error = null;

  if (saved) {
    const { data: existing, error: lookupError } = await supabase
      .from("saved_items")
      .select("id")
      .eq("user_id", auth.userId)
      .eq("project_id", projectId)
      .maybeSingle();

    error = lookupError;
    if (!error && !existing) {
      const insertResult = await supabase.from("saved_items").insert({
        project_id: projectId,
        user_id: auth.userId,
      });
      error = insertResult.error;
    }
  } else {
    const deleteResult = await supabase
      .from("saved_items")
      .delete()
      .eq("user_id", auth.userId)
      .eq("project_id", projectId);
    error = deleteResult.error;
  }

  if (error) {
    return { error: "Unable to update this saved project right now." };
  }

  revalidatePath("/saved");
  return { error: null };
}

export async function removeSavedProjectAction(projectId: string) {
  await setProjectSavedAction(projectId, false);
}
