import "server-only";

import { cache } from "react";
import { Code2 } from "lucide-react";

import type {
  DeliverableName,
  ProjectDetail,
} from "@/data/project-details";
import type { MarketplaceProject } from "@/data/marketplace";
import type { PublicProjectPackage } from "@/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

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
  const demoUrl = readDemoUrl(row.preview_metadata);
  const requirements = row.requirements
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const project: MarketplaceProject = {
    category: category.name,
    createdAt: row.created_at,
    department: row.department,
    difficulty: capitalizeDifficulty(row.difficulty),
    hasPreview: Boolean(demoUrl),
    icon: Code2,
    id: row.slug,
    popularity: 0,
    price: packages[0]?.priceBdt ?? row.base_price_bdt,
    rating: 0,
    reviewCount: 0,
    seller: { name: seller.display_name, verified: seller.is_verified },
    summary: row.description,
    technologies: row.technology_tags,
    title: row.title,
    visualTone:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
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
