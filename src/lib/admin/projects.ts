import "server-only";

import { cache } from "react";

import type {
  ProjectAccessType,
  ProjectDeliveryMethod,
} from "@/data/seller-project";
import { createClient } from "@/lib/supabase/server";
import type {
  Database,
  Json,
} from "@/types/database";

type ListingStatus =
  Database["public"]["Enums"]["listing_status"];

export type AdminProjectSummary = {
  basePriceBdt: number;
  category: string;
  coverUrl: string | null;
  createdAt: string;
  department: string;
  id: string;
  seller: string;
  status: ListingStatus;
  title: string;
};

export type AdminProjectDetail = {
  /*
   * Free / Paid
   */
  accessType: ProjectAccessType;

  /*
   * Uploaded private archive, if this project
   * uses CampusStall file delivery.
   */
  archive: {
    createdAt: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
  } | null;

  basePriceBdt: number;

  category: string;

  createdAt: string;

  /*
   * Project delivery:
   * upload / github / google_drive
   */
  deliveryMethod: ProjectDeliveryMethod;

  demoUrl: string | null;

  department: string;

  description: string;

  difficulty:
    Database["public"]["Enums"]["difficulty_level"];

  /*
   * GitHub / Google Drive URL.
   *
   * This is returned only to the server-rendered
   * admin moderation page.
   */
  externalDeliveryUrl: string | null;

  id: string;

  includedAssets: string[];

  licenseOptions:
    Database["public"]["Enums"]["license_type"][];

  media: {
    altText: string;
    id: string;
    kind: "cover" | "screenshot";
    title: string;
    url: string;
  }[];

  packages: {
    description: string;
    id: string;
    includedAssets: string[];
    licenseType:
      Database["public"]["Enums"]["license_type"];
    name: string;
    priceBdt: number;
    supportDurationDays: number;
  }[];

  rejectionReason: string | null;

  requirements: string;

  seller: {
    bio: string | null;
    department: string | null;
    displayName: string;
    id: string;
    isVerified: boolean;
    university: string | null;
  };

  status: ListingStatus;

  supportDurationDays: number;

  technologyTags: string[];

  title: string;
};

export type AdminDashboardData = {
  counts: {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
    users: number;
  };

  pendingProjects:
    AdminProjectSummary[];
};

function readMetadataValue(
  metadata: Json,
  key: string,
) {
  if (
    metadata &&
    typeof metadata === "object" &&
    !Array.isArray(metadata)
  ) {
    return metadata[key];
  }

  return undefined;
}

/*
 * The new Postgres columns are currently
 * generated as string values in database.ts.
 *
 * Convert them into the stricter application
 * union types.
 */
function normalizeAccessType(
  value: string,
): ProjectAccessType {
  return value === "free"
    ? "free"
    : "paid";
}

function normalizeDeliveryMethod(
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

async function getProjectSummaries(
  status?: ListingStatus,
) {
  const supabase =
    await createClient();

  let query = supabase
    .from("projects")
    .select(
      "id, seller_id, category_id, title, department, base_price_bdt, status, created_at",
    )
    .order("created_at", {
      ascending: false,
    });

  if (status) {
    query = query.eq(
      "status",
      status,
    );
  }

  const { data: projects } =
    await query;

  if (
    !projects ||
    projects.length === 0
  ) {
    return [];
  }

  const projectIds =
    projects.map(
      (project) => project.id,
    );

  const categoryIds = [
    ...new Set(
      projects.map(
        (project) =>
          project.category_id,
      ),
    ),
  ];

  const sellerIds = [
    ...new Set(
      projects.map(
        (project) =>
          project.seller_id,
      ),
    ),
  ];

  const [
    { data: categories },
    { data: sellers },
    { data: media },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .in("id", categoryIds),

    supabase
      .from("profiles")
      .select(
        "id, display_name",
      )
      .in("id", sellerIds),

    supabase
      .from("project_media")
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
      .order("sort_order"),
  ]);

  const categoryNames =
    new Map(
      (categories ?? []).map(
        (category) => [
          category.id,
          category.name,
        ],
      ),
    );

  const sellerNames =
    new Map(
      (sellers ?? []).map(
        (seller) => [
          seller.id,
          seller.display_name,
        ],
      ),
    );

  const coverPaths =
    new Map<
      string,
      string
    >();

  for (
    const item of
    media ?? []
  ) {
    const kind =
      readMetadataValue(
        item.preview_metadata,
        "kind",
      );

    if (
      kind === "cover" &&
      !coverPaths.has(
        item.project_id,
      )
    ) {
      coverPaths.set(
        item.project_id,
        item.storage_path,
      );
    }
  }

  return projects.map(
    (project) => {
      const coverPath =
        coverPaths.get(
          project.id,
        );

      return {
        basePriceBdt:
          project.base_price_bdt,

        category:
          categoryNames.get(
            project.category_id,
          ) ??
          "Uncategorized",

        coverUrl: coverPath
          ? supabase.storage
              .from(
                "project-media",
              )
              .getPublicUrl(
                coverPath,
              ).data.publicUrl
          : null,

        createdAt:
          project.created_at,

        department:
          project.department,

        id: project.id,

        seller:
          sellerNames.get(
            project.seller_id,
          ) ??
          "Unknown seller",

        status:
          project.status,

        title:
          project.title,
      } satisfies AdminProjectSummary;
    },
  );
}

export const getAdminDashboardData =
  cache(
    async function getAdminDashboardData(): Promise<AdminDashboardData> {
      const supabase =
        await createClient();

      const [
        pendingProjects,
        { count: pending },
        { count: approved },
        { count: rejected },
        { count: total },
        { count: users },
      ] = await Promise.all([
        getProjectSummaries(
          "pending",
        ),

        supabase
          .from("projects")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq(
            "status",
            "pending",
          ),

        supabase
          .from("projects")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq(
            "status",
            "published",
          ),

        supabase
          .from("projects")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq(
            "status",
            "rejected",
          ),

        supabase
          .from("projects")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("profiles")
          .select("id", {
            count: "exact",
            head: true,
          }),
      ]);

      return {
        counts: {
          approved:
            approved ?? 0,

          pending:
            pending ?? 0,

          rejected:
            rejected ?? 0,

          total:
            total ?? 0,

          users:
            users ?? 0,
        },

        pendingProjects,
      };
    },
  );

export const getAdminProjects =
  cache(
    async function getAdminProjects() {
      return getProjectSummaries();
    },
  );

export const getAdminProject =
  cache(
    async function getAdminProject(
      projectId: string,
    ): Promise<AdminProjectDetail | null> {
      const supabase =
        await createClient();

      /*
       * IMPORTANT:
       * Load the new access and delivery fields.
       */
      const { data: project } =
        await supabase
          .from("projects")
          .select(
            `
              id,
              seller_id,
              category_id,
              title,
              description,
              department,
              difficulty,
              technology_tags,
              requirements,
              base_price_bdt,
              access_type,
              delivery_method,
              external_delivery_url,
              status,
              license_options,
              included_assets,
              support_duration_days,
              preview_metadata,
              rejection_reason,
              created_at
            `,
          )
          .eq(
            "id",
            projectId,
          )
          .maybeSingle();

      if (!project) {
        return null;
      }

      const [
        { data: category },
        { data: seller },
        { data: packages },
        { data: media },
        { data: files },
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("name")
          .eq(
            "id",
            project.category_id,
          )
          .maybeSingle(),

        supabase
          .from("profiles")
          .select(
            "id, display_name, university, department, bio, is_verified",
          )
          .eq(
            "id",
            project.seller_id,
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
            projectId,
          )
          .order("price_bdt"),

        supabase
          .from("project_media")
          .select(
            "id, storage_path, title, alt_text, preview_metadata",
          )
          .eq(
            "project_id",
            projectId,
          )
          .eq(
            "media_type",
            "image",
          )
          .order("sort_order"),

        supabase
          .from("project_files")
          .select(
            "original_filename, mime_type, size_bytes, created_at",
          )
          .eq(
            "project_id",
            projectId,
          )
          .order(
            "created_at",
            {
              ascending: false,
            },
          )
          .limit(1),
      ]);

      if (!seller) {
        return null;
      }

      const accessType =
        normalizeAccessType(
          project.access_type,
        );

      const deliveryMethod =
        normalizeDeliveryMethod(
          project.delivery_method,
        );

      const demoUrl =
        readMetadataValue(
          project.preview_metadata,
          "demo_url",
        );

      return {
        /*
         * Free / Paid
         */
        accessType,

        archive: files?.[0]
          ? {
              createdAt:
                files[0]
                  .created_at,

              filename:
                files[0]
                  .original_filename,

              mimeType:
                files[0]
                  .mime_type,

              sizeBytes:
                files[0]
                  .size_bytes,
            }
          : null,

        /*
         * Free projects are always displayed
         * as price 0 to the admin as well.
         */
        basePriceBdt:
          accessType === "free"
            ? 0
            : project.base_price_bdt,

        category:
          category?.name ??
          "Uncategorized",

        createdAt:
          project.created_at,

        /*
         * Upload / GitHub / Google Drive
         */
        deliveryMethod,

        demoUrl:
          typeof demoUrl ===
            "string" &&
          demoUrl
            ? demoUrl
            : null,

        department:
          project.department,

        description:
          project.description,

        difficulty:
          project.difficulty,

        /*
         * Only retain the external URL when
         * external delivery is actually used.
         */
        externalDeliveryUrl:
          deliveryMethod ===
          "upload"
            ? null
            : project.external_delivery_url ??
              null,

        id:
          project.id,

        includedAssets:
          project.included_assets,

        licenseOptions:
          project.license_options,

        media: (
          media ?? []
        ).map((item) => ({
          altText:
            item.alt_text ??
            `${project.title} preview`,

          id:
            item.id,

          kind:
            readMetadataValue(
              item.preview_metadata,
              "kind",
            ) === "cover"
              ? "cover"
              : "screenshot",

          title:
            item.title ??
            "Project screenshot",

          url:
            supabase.storage
              .from(
                "project-media",
              )
              .getPublicUrl(
                item.storage_path,
              ).data.publicUrl,
        })),

        packages: (
          packages ?? []
        ).map((item) => ({
          description:
            item.description,

          id:
            item.id,

          includedAssets:
            item.included_assets,

          licenseType:
            item.license_type,

          name:
            item.name,

          priceBdt:
            accessType === "free"
              ? 0
              : item.price_bdt,

          supportDurationDays:
            item.support_duration_days,
        })),

        rejectionReason:
          project.rejection_reason,

        requirements:
          project.requirements,

        seller: {
          bio:
            seller.bio,

          department:
            seller.department,

          displayName:
            seller.display_name,

          id:
            seller.id,

          isVerified:
            seller.is_verified,

          university:
            seller.university,
        },

        status:
          project.status,

        supportDurationDays:
          project.support_duration_days,

        technologyTags:
          project.technology_tags,

        title:
          project.title,
      };
    },
  );