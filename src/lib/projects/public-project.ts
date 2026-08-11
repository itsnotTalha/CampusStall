import "server-only";

import { cache } from "react";
import { Code2 } from "lucide-react";

import type {
  DeliverableName,
  ProjectDetail,
  ProjectPreviewMedia,
} from "@/data/project-details";
import type {
  MarketplaceProject,
  PublicMarketplaceProject,
} from "@/data/marketplace";
import type { PublicProjectPackage } from "@/data/orders";
import type {
  ProjectAccessType,
  ProjectDeliveryMethod,
} from "@/data/seller-project";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProjectListingRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  | "access_type"
  | "base_price_bdt"
  | "category_id"
  | "created_at"
  | "delivery_method"
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
  accessType: ProjectAccessType;
  databaseProjectId: string;
  deliveryMethod: ProjectDeliveryMethod;
  demoUrl: string | null;
  detail: ProjectDetail;
  media: ProjectPreviewMedia[];
  packages: PublicProjectPackage[];
  project: MarketplaceProject;
};

const deliverableNames: Record<
  string,
  DeliverableName
> = {
  source_code: "Source Code",
  database: "Database",
  dataset: "Dataset",
  trained_model: "Trained Model",
  documentation: "Documentation",
  presentation: "Presentation",
  installation_guide: "Installation Guide",
  demo_files: "Demo",
};

function capitalizeDifficulty(
  value:
    | "beginner"
    | "intermediate"
    | "advanced",
) {
  return `${value
    .slice(0, 1)
    .toUpperCase()}${value.slice(
    1,
  )}` as MarketplaceProject["difficulty"];
}

function readDemoUrl(
  metadata: unknown,
) {
  if (
    !metadata ||
    typeof metadata !== "object" ||
    Array.isArray(metadata)
  ) {
    return null;
  }

  const value = (
    metadata as Record<
      string,
      unknown
    >
  ).demo_url;

  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    return null;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" ||
      url.protocol === "https:"
      ? value
      : null;
  } catch {
    return null;
  }
}

function readMediaKind(
  metadata: unknown,
):
  | "cover"
  | "screenshot"
  | null {
  if (
    !metadata ||
    typeof metadata !== "object" ||
    Array.isArray(metadata)
  ) {
    return null;
  }

  const value = (
    metadata as Record<
      string,
      unknown
    >
  ).kind;

  return value === "cover" ||
    value === "screenshot"
    ? value
    : null;
}

function normalizeProjectAccessType(
  value: string,
): ProjectAccessType {
  return value === "free"
    ? "free"
    : "paid";
}

function normalizeProjectDeliveryMethod(
  value: string,
): ProjectDeliveryMethod {
  if (value === "github") {
    return "github";
  }

  if (value === "google_drive") {
    return "google_drive";
  }

  return "upload";
}

/*
 * Public installation/use instructions.
 *
 * These instructions deliberately do not expose
 * the actual GitHub or Google Drive URL.
 *
 * The protected URL will be resolved by the
 * project access API.
 */
function getInstallationSteps(
  accessType: ProjectAccessType,
  deliveryMethod: ProjectDeliveryMethod,
): string[] {
  if (deliveryMethod === "github") {
    return [
      accessType === "free"
        ? "Use Get Free Project to access the seller-provided GitHub repository."
        : "After purchase, use your project access option to open the seller-provided GitHub repository.",
      "Review the repository README, documentation, and project requirements.",
      "Clone or download the repository using the instructions provided by the seller.",
      "Install the required dependencies and configure the local environment.",
    ];
  }

  if (
    deliveryMethod ===
    "google_drive"
  ) {
    return [
      accessType === "free"
        ? "Use Get Free Project to access the seller-provided Google Drive files."
        : "After purchase, use your project access option to open the seller-provided Google Drive files.",
      "Download or copy the required project files from Google Drive.",
      "Read the included documentation and project requirements.",
      "Install the required dependencies and configure the local environment.",
    ];
  }

  return [
    accessType === "free"
      ? "Use Get Free Project to download the private project archive."
      : "After purchase, download the private project archive from your project access page.",
    "Read the included documentation and requirements.",
    "Install dependencies and configure the local environment.",
    "Run the included demo or verification workflow.",
  ];
}

function toMarketplaceProject(
  row: ProjectListingRow,
  category: string,
  seller: {
    display_name: string;
    is_verified: boolean;
  },
  price: number,
  media: {
    coverUrl?: string;
    hasMedia?: boolean;
  } = {},
  reviews: {
    rating: number;
    reviewCount: number;
  } = {
    rating: 0,
    reviewCount: 0,
  },
): PublicMarketplaceProject {
  return {
    category,
    coverUrl: media.coverUrl,
    createdAt: row.created_at,
    databaseProjectId: row.id,
    department: row.department,
    difficulty:
      capitalizeDifficulty(
        row.difficulty,
      ),
    hasPreview:
      Boolean(
        readDemoUrl(
          row.preview_metadata,
        ),
      ) ||
      Boolean(media.hasMedia),
    id: row.slug,
    isDemoListing: false,
    popularity: 0,
    price:
      row.access_type === "free"
        ? 0
        : price,
    rating: reviews.rating,
    reviewCount:
      reviews.reviewCount,
    seller: {
      name: seller.display_name,
      verified:
        seller.is_verified,
    },
    summary: row.description,
    technologies:
      row.technology_tags,
    title: row.title,
    visualTone:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300",
  };
}

export const getPublicMarketplaceProjects =
  cache(
    async function getPublicMarketplaceProjects(): Promise<
      PublicMarketplaceProject[]
    > {
      if (
        !isSupabaseConfigured()
      ) {
        return [];
      }

      const supabase =
        await createClient();

      const { data: rows } =
        await supabase
          .from("projects")
          .select(
            "id, seller_id, category_id, title, slug, description, department, difficulty, technology_tags, base_price_bdt, access_type, delivery_method, preview_metadata, created_at",
          )
          .eq(
            "status",
            "published",
          )
          .order(
            "published_at",
            {
              ascending: false,
            },
          );

      if (
        !rows ||
        rows.length === 0
      ) {
        return [];
      }

      const projectIds =
        rows.map(
          (row) => row.id,
        );

      const categoryIds = [
        ...new Set(
          rows.map(
            (row) =>
              row.category_id,
          ),
        ),
      ];

      const sellerIds = [
        ...new Set(
          rows.map(
            (row) =>
              row.seller_id,
          ),
        ),
      ];

      const [
        {
          data: categories,
        },
        { data: sellers },
        { data: packages },
        { data: media },
        { data: reviews },
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name")
          .in(
            "id",
            categoryIds,
          ),

        supabase
          .from("profiles")
          .select(
            "id, display_name, is_verified",
          )
          .in(
            "id",
            sellerIds,
          ),

        supabase
          .from(
            "project_packages",
          )
          .select(
            "project_id, price_bdt",
          )
          .in(
            "project_id",
            projectIds,
          )
          .eq(
            "is_active",
            true,
          ),

        supabase
          .from(
            "project_media",
          )
          .select(
            "project_id, storage_path, sort_order, preview_metadata",
          )
          .in(
            "project_id",
            projectIds,
          )
          .eq(
            "media_type",
            "image",
          )
          .eq(
            "is_public",
            true,
          )
          .order("sort_order"),

        supabase
          .from("reviews")
          .select(
            "project_id, rating",
          )
          .in(
            "project_id",
            projectIds,
          )
          .eq(
            "is_published",
            true,
          ),
      ]);

      const categoryNames =
        new Map(
          (
            categories ?? []
          ).map(
            (category) => [
              category.id,
              category.name,
            ],
          ),
        );

      const sellersById =
        new Map(
          (sellers ?? []).map(
            (seller) => [
              seller.id,
              seller,
            ],
          ),
        );

      const minimumPrices =
        new Map<
          string,
          number
        >();

      const mediaByProject =
        new Map<
          string,
          {
            coverUrl?: string;
            hasMedia: boolean;
          }
        >();

      const ratingsByProject =
        new Map<
          string,
          number[]
        >();

      for (
        const item of
        packages ?? []
      ) {
        const currentPrice =
          minimumPrices.get(
            item.project_id,
          );

        if (
          currentPrice ===
            undefined ||
          item.price_bdt <
            currentPrice
        ) {
          minimumPrices.set(
            item.project_id,
            item.price_bdt,
          );
        }
      }

      for (
        const item of
        media ?? []
      ) {
        const current =
          mediaByProject.get(
            item.project_id,
          ) ?? {
            hasMedia: false,
          };

        current.hasMedia =
          true;

        if (
          !current.coverUrl &&
          readMediaKind(
            item.preview_metadata,
          ) === "cover"
        ) {
          current.coverUrl =
            supabase.storage
              .from(
                "project-media",
              )
              .getPublicUrl(
                item.storage_path,
              ).data.publicUrl;
        }

        mediaByProject.set(
          item.project_id,
          current,
        );
      }

      for (
        const review of
        reviews ?? []
      ) {
        if (
          !review.project_id
        ) {
          continue;
        }

        const ratings =
          ratingsByProject.get(
            review.project_id,
          ) ?? [];

        ratings.push(
          review.rating,
        );

        ratingsByProject.set(
          review.project_id,
          ratings,
        );
      }

      return rows.flatMap(
        (row) => {
          const category =
            categoryNames.get(
              row.category_id,
            );

          const seller =
            sellersById.get(
              row.seller_id,
            );

          if (
            !category ||
            !seller
          ) {
            return [];
          }

          const ratings =
            ratingsByProject.get(
              row.id,
            ) ?? [];

          const reviewCount =
            ratings.length;

          const rating =
            reviewCount
              ? ratings.reduce(
                  (
                    total,
                    value,
                  ) =>
                    total +
                    value,
                  0,
                ) /
                reviewCount
              : 0;

          const projectPrice =
            row.access_type ===
            "free"
              ? 0
              : minimumPrices.get(
                    row.id,
                  ) ??
                row.base_price_bdt;

          return [
            toMarketplaceProject(
              row,
              category,
              seller,
              projectPrice,
              mediaByProject.get(
                row.id,
              ),
              {
                rating,
                reviewCount,
              },
            ),
          ];
        },
      );
    },
  );

export const getPublicDatabaseProject =
  cache(
    async function getPublicDatabaseProject(
      slug: string,
    ): Promise<PublicDatabaseProject | null> {
      if (
        !isSupabaseConfigured()
      ) {
        return null;
      }

      const supabase =
        await createClient();

      const { data: row } =
        await supabase
          .from("projects")
          .select(
            "id, seller_id, category_id, title, slug, description, department, difficulty, technology_tags, requirements, base_price_bdt, access_type, delivery_method, included_assets, support_duration_days, preview_metadata, created_at",
          )
          .eq("slug", slug)
          .eq(
            "status",
            "published",
          )
          .maybeSingle();

      if (!row) {
        return null;
      }

      const accessType =
        normalizeProjectAccessType(
          row.access_type,
        );

      const deliveryMethod =
        normalizeProjectDeliveryMethod(
          row.delivery_method,
        );

      const [
        { data: category },
        { data: seller },
        {
          data: packageRows,
        },
        { data: mediaRows },
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("name")
          .eq(
            "id",
            row.category_id,
          )
          .maybeSingle(),

        supabase
          .from("profiles")
          .select(
            "display_name, is_verified",
          )
          .eq(
            "id",
            row.seller_id,
          )
          .maybeSingle(),

        supabase
          .from(
            "project_packages",
          )
          .select(
            "id, name, description, price_bdt, license_type, included_assets, support_duration_days",
          )
          .eq(
            "project_id",
            row.id,
          )
          .eq(
            "is_active",
            true,
          )
          .order("price_bdt"),

        supabase
          .from(
            "project_media",
          )
          .select(
            "id, storage_path, title, alt_text, preview_metadata",
          )
          .eq(
            "project_id",
            row.id,
          )
          .eq(
            "media_type",
            "image",
          )
          .eq(
            "is_public",
            true,
          )
          .order("sort_order"),
      ]);

      if (
        !category ||
        !seller ||
        !packageRows ||
        packageRows.length === 0
      ) {
        return null;
      }

      const packages: PublicProjectPackage[] =
        packageRows.map(
          (item) => ({
            description:
              item.description,
            id: item.id,
            includedAssets:
              item.included_assets,
            licenseType:
              item.license_type,
            name: item.name,
            priceBdt:
              row.access_type === "free"
                ? 0
                : item.price_bdt,
            supportDurationDays:
              item.support_duration_days,
          }),
        );

      const media: ProjectPreviewMedia[] =
        (
          mediaRows ?? []
        ).map((item) => ({
          altText:
            item.alt_text ??
            `${row.title} preview`,
          id: item.id,
          kind:
            readMediaKind(
              item.preview_metadata,
            ) ??
            "screenshot",
          title:
            item.title ??
            "Project preview",
          url: supabase.storage
            .from(
              "project-media",
            )
            .getPublicUrl(
              item.storage_path,
            ).data.publicUrl,
        }));

      const cover =
        media.find(
          (item) =>
            item.kind ===
            "cover",
        );

      const demoUrl =
        readDemoUrl(
          row.preview_metadata,
        );

      const requirements =
        row.requirements
          .split(/\r?\n/)
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean);

      const projectPrice =
        row.access_type === "free"
          ? 0
          : packages[0]
                ?.priceBdt ??
            row.base_price_bdt;

      const project: MarketplaceProject =
        {
          ...toMarketplaceProject(
            row,
            category.name,
            seller,
            projectPrice,
            {
              coverUrl:
                cover?.url,
              hasMedia:
                media.length >
                0,
            },
          ),

          icon: Code2,
        };

      const deliverables =
        row.included_assets
          .map(
            (asset) =>
              deliverableNames[
                asset
              ],
          )
          .filter(
            (
              asset,
            ): asset is DeliverableName =>
              Boolean(asset),
          );

      if (
        row.support_duration_days >
        0
      ) {
        deliverables.push(
          "Seller Support",
        );
      }

      const detail: ProjectDetail =
        {
          commercialLicenseAvailable:
            packages.some(
              (item) =>
                item.licenseType ===
                "commercial",
            ),

          deliverables,

          features:
            row.technology_tags.map(
              (technology) =>
                `${technology} implementation included in the project`,
            ),

          howItWorks: [
            "Review the seller-provided requirements and installation guide.",
            "Prepare the documented software, hardware, or service dependencies.",
            "Access the project using the seller's selected delivery method.",
            "Customize the project within the selected license terms.",
          ],

          installation:
            getInstallationSteps(
              accessType,
              deliveryMethod,
            ),

          overview:
            row.description,

          /*
           * Real seller listings must never invent an interactive
           * preview from their category or technology tags.
           *
           * PreviewExperience will use the seller-provided media and
           * demo URL instead. "generic" is kept only to satisfy the
           * existing ProjectDetail type until the preview component is
           * cleaned up in the next step.
           */
          previewKind: "generic",

          requirements:
            requirements.length >
            0
              ? requirements
              : [
                  "No additional requirements were listed by the seller.",
                ],

          reviews: [],

          /*
           * Do not generate fake overview/workspace/results screenshots.
           * Only actual seller-uploaded media should be shown publicly.
           */
          screenshots: [],

          supportDays:
            row.support_duration_days,
        };

        return {
          accessType,

          databaseProjectId:
            row.id,

          deliveryMethod,

        demoUrl,

        detail,

        media,

        packages,

        project,
      };
    },
  );