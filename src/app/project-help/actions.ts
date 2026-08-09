"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projectHelpCategories } from "@/data/project-help";
import { getAuthContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type ProjectHelpFormState = { error?: string };

export async function createProjectHelpRequestAction(
  _previousState: ProjectHelpFormState,
  formData: FormData,
): Promise<ProjectHelpFormState> {
  const description = readText(formData, "description").replace(/\s+/g, " ");
  const categorySlug = readText(formData, "category");
  const technologyTags = parseTechnologyTags(readText(formData, "technology"));
  const budgetBdt = Number(readText(formData, "budgetBdt"));
  const deadline = readText(formData, "deadline");

  if (description.length < 20 || description.length > 10000) {
    return { error: "Describe the help you need in 20 to 10,000 characters." };
  }
  if (!projectHelpCategories.some((category) => category.slug === categorySlug)) {
    return { error: "Choose a valid project category." };
  }
  if (technologyTags.length === 0 || technologyTags.length > 10) {
    return { error: "Add between 1 and 10 relevant technologies." };
  }
  if (!Number.isInteger(budgetBdt) || budgetBdt < 1 || budgetBdt > 10000000) {
    return { error: "Enter a valid budget in BDT." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || deadline < todayDate()) {
    return { error: "Choose a valid deadline that is not in the past." };
  }

  const auth = await getAuthContext();
  if (!auth) return { error: "Sign in before submitting a help request." };

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) {
    return { error: "This category is not available in the marketplace yet." };
  }

  const { data: request, error } = await supabase
    .from("project_requests")
    .insert({
      assigned_to: null,
      budget_max_bdt: budgetBdt,
      budget_min_bdt: budgetBdt,
      category_id: category.id,
      department: auth.profile?.department ?? null,
      description,
      desired_completion_date: deadline,
      requested_by: auth.userId,
      status: "open",
      technology_tags: technologyTags,
      title: createRequestTitle(description, category.name),
      visibility: "public",
    })
    .select("id")
    .single();

  if (error || !request) {
    return { error: "Your request could not be created. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/project-help");
  redirect(`/project-help?submitted=1&request=${request.id}#matches`);
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseTechnologyTags(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length >= 1 && tag.length <= 40),
    ),
  ].slice(0, 10);
}

function createRequestTitle(description: string, categoryName: string) {
  const firstThought = description.split(/[.!?]/)[0]?.trim() ?? "";
  const title = firstThought.slice(0, 120).trim();
  return title.length >= 5 ? title : `${categoryName} help request`;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}
