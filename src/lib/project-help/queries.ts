import "server-only";

import type {
  ProjectHelpRequestSummary,
  SellerServiceMatch,
} from "@/data/project-help";
import { createClient } from "@/lib/supabase/server";

const requestSelection =
  "id, category_id, title, description, technology_tags, budget_max_bdt, status, desired_completion_date, created_at";

export type ProjectHelpPageData = {
  currentRequest: ProjectHelpRequestSummary | null;
  matches: SellerServiceMatch[];
  recentRequests: ProjectHelpRequestSummary[];
};

export async function getProjectHelpPageData(
  userId: string,
  currentRequestId?: string,
): Promise<ProjectHelpPageData> {
  const supabase = await createClient();
  const { data: requestRows } = await supabase
    .from("project_requests")
    .select(requestSelection)
    .eq("requested_by", userId)
    .order("created_at", { ascending: false })
    .limit(8);
  const rows = requestRows ?? [];
  let currentRow = currentRequestId
    ? rows.find((request) => request.id === currentRequestId)
    : undefined;

  if (currentRequestId && !currentRow) {
    const { data } = await supabase
      .from("project_requests")
      .select(requestSelection)
      .eq("id", currentRequestId)
      .eq("requested_by", userId)
      .maybeSingle();
    currentRow = data ?? undefined;
  }

  const categoryIds = [
    ...new Set(
      [...rows, ...(currentRow ? [currentRow] : [])]
        .map((request) => request.category_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const { data: requestCategories } = categoryIds.length
    ? await supabase
        .from("categories")
        .select("id, name")
        .in("id", categoryIds)
    : { data: [] };
  const categoryNames = new Map(
    (requestCategories ?? []).map((category) => [category.id, category.name]),
  );
  const recentRequests = rows.map((request) =>
    toRequestSummary(request, categoryNames),
  );

  if (!currentRow) {
    return { currentRequest: null, matches: [], recentRequests };
  }

  const currentRequest = toRequestSummary(currentRow, categoryNames);
  const { data: services } = await supabase
    .from("services")
    .select(
      "id, seller_id, category_id, title, description, technology_tags, starting_price_bdt",
    )
    .eq("status", "published")
    .neq("seller_id", userId)
    .limit(100);

  if (!services || services.length === 0) {
    return { currentRequest, matches: [], recentRequests };
  }

  const serviceCategoryIds = [
    ...new Set(services.map((service) => service.category_id)),
  ];
  const sellerIds = [...new Set(services.map((service) => service.seller_id))];
  const [{ data: serviceCategories }, { data: profiles }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .in("id", serviceCategoryIds),
    supabase
      .from("profiles")
      .select("id, display_name, is_verified")
      .in("id", sellerIds),
  ]);
  const allCategoryNames = new Map([
    ...categoryNames,
    ...(serviceCategories ?? []).map(
      (category) => [category.id, category.name] as const,
    ),
  ]);
  const profilesById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );
  const normalizedRequestTags = currentRow.technology_tags.map(normalizeTag);
  const scoredMatches = services
    .map((service) => {
      const normalizedServiceTags = service.technology_tags.map(normalizeTag);
      const overlappingTags = currentRow.technology_tags.filter((_, index) =>
        normalizedServiceTags.some((tag) => tagsMatch(normalizedRequestTags[index], tag)),
      );
      const categoryMatch = service.category_id === currentRow.category_id;
      const searchableService = normalizeTag(
        `${service.title} ${service.description}`,
      );
      const mentionedTags = currentRow.technology_tags.filter((tag) =>
        searchableService.includes(normalizeTag(tag)),
      );
      const score = Math.min(
        100,
        (categoryMatch ? 55 : 0) +
          overlappingTags.length * 15 +
          mentionedTags.length * 5,
      );
      const seller = profilesById.get(service.seller_id);
      const reasons = [
        ...(categoryMatch ? ["Same category"] : []),
        ...(overlappingTags.length > 0
          ? [`${overlappingTags.slice(0, 3).join(", ")} technology match`]
          : []),
        ...(mentionedTags.length > overlappingTags.length
          ? ["Related service experience"]
          : []),
      ];

      return {
        categoryName:
          allCategoryNames.get(service.category_id) ?? "Student service",
        description: service.description,
        id: service.id,
        reasons,
        score,
        sellerId: service.seller_id,
        sellerName: seller?.display_name ?? "CampusStall seller",
        sellerVerified: seller?.is_verified ?? false,
        startingPriceBdt: service.starting_price_bdt,
        technologyTags: service.technology_tags,
        title: service.title,
      } satisfies SellerServiceMatch;
    })
    .filter((match) => match.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.startingPriceBdt - right.startingPriceBdt ||
        left.title.localeCompare(right.title),
    );
  const bestMatchBySeller = new Map<string, SellerServiceMatch>();

  for (const match of scoredMatches) {
    if (!bestMatchBySeller.has(match.sellerId)) {
      bestMatchBySeller.set(match.sellerId, match);
    }
  }

  return {
    currentRequest,
    matches: [...bestMatchBySeller.values()].slice(0, 6),
    recentRequests,
  };
}

function toRequestSummary(
  request: {
    budget_max_bdt: number | null;
    category_id: string | null;
    created_at: string;
    description: string;
    desired_completion_date: string | null;
    id: string;
    status: ProjectHelpRequestSummary["status"];
    technology_tags: string[];
    title: string;
  },
  categoryNames: Map<string, string>,
): ProjectHelpRequestSummary {
  return {
    budgetBdt: request.budget_max_bdt,
    categoryName:
      categoryNames.get(request.category_id ?? "") ?? "General project help",
    createdAt: request.created_at,
    deadline: request.desired_completion_date,
    description: request.description,
    id: request.id,
    status: request.status,
    technologyTags: request.technology_tags,
    title: request.title,
  };
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9+#]/g, "");
}

function tagsMatch(left: string, right: string) {
  return Boolean(
    left &&
      right &&
      (left === right ||
        (left.length >= 3 &&
          right.length >= 3 &&
          (left.includes(right) || right.includes(left)))),
  );
}
