import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type SavedProject = {
  basePriceBdt: number;
  description: string;
  id: string;
  savedAt: string;
  slug: string;
  title: string;
};

export async function isProjectSaved(userId: string, projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_items")
    .select("id")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .maybeSingle();

  return Boolean(data);
}

export const getSavedProjects = cache(async function getSavedProjects(
  userId: string,
): Promise<SavedProject[]> {
  const supabase = await createClient();
  const { data: savedRows } = await supabase
    .from("saved_items")
    .select("project_id, created_at")
    .eq("user_id", userId)
    .not("project_id", "is", null)
    .order("created_at", { ascending: false });

  const projectIds = (savedRows ?? [])
    .map((item) => item.project_id)
    .filter((id): id is string => Boolean(id));

  if (projectIds.length === 0) return [];

  const { data: projects } = await supabase
    .from("projects")
    .select("id, slug, title, description, base_price_bdt")
    .in("id", projectIds)
    .eq("status", "published");
  const projectsById = new Map(
    (projects ?? []).map((project) => [project.id, project]),
  );

  return (savedRows ?? []).flatMap((savedItem) => {
    if (!savedItem.project_id) return [];
    const project = projectsById.get(savedItem.project_id);
    if (!project) return [];

    return [
      {
        basePriceBdt: project.base_price_bdt,
        description: project.description,
        id: project.id,
        savedAt: savedItem.created_at,
        slug: project.slug,
        title: project.title,
      },
    ];
  });
});
