import "server-only";

import { cache } from "react";
import { Code2 } from "lucide-react";

import type {
  DeliverableName,
  ProjectDetail,
} from "@/data/project-details";
import type {
  MarketplaceProject,
  PublicMarketplaceProject,
} from "@/data/marketplace";
import type { PublicProjectPackage } from "@/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProjectListingRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  | "base_price_bdt"
  | "category_id"
  | "created_at"
  | "department"
  | "description"
  | "difficulty"
  | "id"
  | "preview_metadata"
  | "seller_id"
  | "slug"
  | "technology_tags"
  | "title"
>;

export type PublicDatabaseProject = {
  databaseProjectId: string;
  detail: ProjectDetail;
  packages: PublicProjectPackage[];
  project: MarketplaceProject;
};

const deliverableNames: Record<string, DeliverableName> = {
  source_code: "Source Code",
  database: "Database",
  dataset: "Dataset",
  trained_model: "Trained Model",
  documentation: "Documentation",
  presentation: "Presentation",
  installation_guide: "Installation Guide",
  demo_files: "Demo",
};

function capitalizeDifficulty(value: "beginner" | "intermediate" | "advanced") {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}` as MarketplaceProject["difficulty"];
}

function getPreviewKind(category: string, technologies: string[]) {
  const searchable = `${category} ${technologies.join(" ")}`.toLowerCase();
  if (/machine learning|computer vision|tensorflow|pytorch|scikit/.test(searchable)) {
    return "machine-learning" as const;
  }
  if (/web|dashboard|next|react|vue|angular/.test(searchable)) {
    return "dashboard" as const;
  }
  return "generic" as const;
}

function readDemoUrl(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const value = (metadata as Record<string, unknown>).demo_url;
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toMarketplaceProject(
  row: ProjectListingRow,
  category: string,
  seller: { display_name: string; is_verified: boolean },
  price: number,
  reviews: { rating: number; reviewCount: number } = {
    rating: 0,
    reviewCount: 0,
  },
): PublicMarketplaceProject {
  return {
    category,
    createdAt: row.created_at,
    databaseProjectId: row.id,
    department: row.department,
    difficulty: capitalizeDifficulty(row.difficulty),
    hasPreview: Boolean(readDemoUrl(row.preview_metadata)),
    id: row.slug,
    isDemoListing: false,
    popularity: 0,
    price,
    rating: reviews.rating,
    reviewCount: reviews.reviewCount,
    seller: { name: seller.display_name, verified: seller.is_verified },
    summary: row.description,
    technologies: row.technology_tags,
    title: row.title,
    visualTone:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
  };
}

export const getPublicMarketplaceProjects = cache(async function getPublicMarketplaceProjects(): Promise<PublicMarketplaceProject[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("projects")
    .select(
      "id, seller_id, category_id, title, slug, description, department, difficulty, technology_tags, base_price_bdt, preview_metadata, created_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (!rows || rows.length === 0) return [];

  const projectIds = rows.map((row) => row.id);
  const categoryIds = [...new Set(rows.map((row) => row.category_id))];
  const sellerIds = [...new Set(rows.map((row) => row.seller_id))];
  const [
    { data: categories },
    { data: sellers },
    { data: packages },
    { data: reviews },
  ] = await Promise.all([
    supabase.from("categories").select("id, name").in("id", categoryIds),
    supabase
      .from("profiles")
      .select("id, display_name, is_verified")
      .in("id", sellerIds),
    supabase
      .from("project_packages")
      .select("project_id, price_bdt")
      .in("project_id", projectIds)
      .eq("is_active", true),
    supabase
      .from("reviews")
      .select("project_id, rating")
      .in("project_id", projectIds)
      .eq("is_published", true),
  ]);
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const sellersById = new Map(
    (sellers ?? []).map((seller) => [seller.id, seller]),
  );
  const minimumPrices = new Map<string, number>();
  const ratingsByProject = new Map<string, number[]>();

  for (const item of packages ?? []) {
    const currentPrice = minimumPrices.get(item.project_id);
    if (currentPrice === undefined || item.price_bdt < currentPrice) {
      minimumPrices.set(item.project_id, item.price_bdt);
    }
  }

  for (const review of reviews ?? []) {
    if (!review.project_id) continue;
    const ratings = ratingsByProject.get(review.project_id) ?? [];
    ratings.push(review.rating);
    ratingsByProject.set(review.project_id, ratings);
  }

  return rows.flatMap((row) => {
    const category = categoryNames.get(row.category_id);
    const seller = sellersById.get(row.seller_id);
    if (!category || !seller) return [];

    const ratings = ratingsByProject.get(row.id) ?? [];
    const reviewCount = ratings.length;
    const rating = reviewCount
      ? ratings.reduce((total, value) => total + value, 0) / reviewCount
      : 0;

    return [
      toMarketplaceProject(
        row,
        category,
        seller,
        minimumPrices.get(row.id) ?? row.base_price_bdt,
        { rating, reviewCount },
      ),
    ];
  });
});

export const getPublicDatabaseProject = cache(async function getPublicDatabaseProject(
  slug: string,
): Promise<PublicDatabaseProject | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("projects")
    .select(
      "id, seller_id, category_id, title, slug, description, department, difficulty, technology_tags, requirements, base_price_bdt, included_assets, support_duration_days, preview_metadata, created_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!row) return null;

  const [{ data: category }, { data: seller }, { data: packageRows }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("name")
        .eq("id", row.category_id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("display_name, is_verified")
        .eq("id", row.seller_id)
        .maybeSingle(),
      supabase
        .from("project_packages")
        .select(
          "id, name, description, price_bdt, license_type, included_assets, support_duration_days",
        )
        .eq("project_id", row.id)
        .eq("is_active", true)
        .order("price_bdt"),
    ]);

  if (!category || !seller || !packageRows || packageRows.length === 0) {
    return null;
  }

  const packages = packageRows.map((item) => ({
    description: item.description,
    id: item.id,
    includedAssets: item.included_assets,
    licenseType: item.license_type,
    name: item.name,
    priceBdt: item.price_bdt,
    supportDurationDays: item.support_duration_days,
  }));
  const requirements = row.requirements
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const project: MarketplaceProject = {
    ...toMarketplaceProject(
      row,
      category.name,
      seller,
      packages[0]?.priceBdt ?? row.base_price_bdt,
    ),
    icon: Code2,
  };
  const deliverables = row.included_assets
    .map((asset) => deliverableNames[asset])
    .filter((asset): asset is DeliverableName => Boolean(asset));

  if (row.support_duration_days > 0) deliverables.push("Seller Support");

  const detail: ProjectDetail = {
    commercialLicenseAvailable: packages.some(
      (item) => item.licenseType === "commercial",
    ),
    deliverables,
    features: row.technology_tags.map(
      (technology) => `${technology} implementation included in the project`,
    ),
    howItWorks: [
      "Review the seller-provided requirements and installation guide.",
      "Prepare the documented software, hardware, or service dependencies.",
      "Run the included project files using the seller's instructions.",
      "Customize the project within the selected license terms.",
    ],
    installation: [
      "Download the private project archive after payment.",
      "Read the included documentation and requirements.",
      "Install dependencies and configure the local environment.",
      "Run the included demo or verification workflow.",
    ],
    overview: row.description,
    previewKind: getPreviewKind(category.name, row.technology_tags),
    requirements:
      requirements.length > 0
        ? requirements
        : ["No additional requirements were listed by the seller."],
    reviews: [],
    screenshots: [
      {
        id: `${row.id}-overview`,
        title: "Project overview",
        description: "Simulated overview based on this listing's project type.",
        layout: "overview",
      },
      {
        id: `${row.id}-workspace`,
        title: "Main workspace",
        description: "Simulated workspace for preview purposes.",
        layout: "workspace",
      },
      {
        id: `${row.id}-results`,
        title: "Results",
        description: "Simulated result presentation for this listing.",
        layout: "analytics",
      },
    ],
    supportDays: row.support_duration_days,
  };

  return { databaseProjectId: row.id, detail, packages, project };
});
