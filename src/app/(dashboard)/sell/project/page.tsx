import type { Metadata } from "next";
import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import { FolderKanban } from "lucide-react";

import { ProjectListingForm } from "@/components/seller/project-listing-form";
import { buttonVariants } from "@/components/ui/button";
import type {
  PackageType,
  SellerProjectInitialData,
} from "@/data/seller-project";
import { getAuthContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

export const metadata: Metadata = {
  title: "Sell a project",
};

type SellProjectPageProps = {
  searchParams: Promise<{
    project?: string | string[];
  }>;
};

function readPreviewValue(
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
 * The database columns are currently generated
 * as strings, while our application uses stricter
 * union types.
 */
function normalizeAccessType(
  value: string,
): SellerProjectInitialData["accessType"] {
  return value === "free"
    ? "free"
    : "paid";
}

function normalizeDeliveryMethod(
  value: string,
): SellerProjectInitialData["deliveryMethod"] {
  if (value === "github") {
    return "github";
  }

  if (value === "google_drive") {
    return "google_drive";
  }

  return "upload";
}

export default async function SellProjectPage({
  searchParams,
}: SellProjectPageProps) {
  const auth = await getAuthContext();

  if (!auth) {
    redirect(
      "/sign-in?next=/sell/project",
    );
  }

  const params = await searchParams;

  const requestedId = Array.isArray(
    params.project,
  )
    ? params.project[0]
    : params.project;

  const supabase =
    await createClient();

  /*
   * Load active categories for the form.
   */
  const { data: categories } =
    await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order")
      .order("name");

  let initialData:
    | SellerProjectInitialData
    | undefined;

  /*
   * Editing an existing project.
   */
  if (requestedId) {
    const { data: project } =
      await supabase
        .from("projects")
        .select(
          `
            id,
            title,
            description,
            category_id,
            department,
            difficulty,
            technology_tags,
            requirements,
            base_price_bdt,
            access_type,
            delivery_method,
            external_delivery_url,
            support_duration_days,
            license_options,
            included_assets,
            preview_metadata,
            status
          `,
        )
        .eq("id", requestedId)
        .eq(
          "seller_id",
          auth.userId,
        )
        .maybeSingle();

    if (!project) {
      notFound();
    }

    /*
     * Load packages, preview media and any
     * previously uploaded project archive.
     */
    const [
      { data: packages },
      { data: media },
      { data: files },
    ] = await Promise.all([
      supabase
        .from(
          "project_packages",
        )
        .select("package_type")
        .eq(
          "project_id",
          requestedId,
        ),

      supabase
        .from("project_media")
        .select(
          "storage_path, preview_metadata",
        )
        .eq(
          "project_id",
          requestedId,
        ),

      supabase
        .from("project_files")
        .select(
          "original_filename",
        )
        .eq(
          "project_id",
          requestedId,
        )
        .limit(1),
    ]);

    /*
     * Existing cover image.
     */
    const cover = media?.find(
      (item) =>
        readPreviewValue(
          item.preview_metadata,
          "kind",
        ) === "cover",
    );

    /*
     * Older drafts may still have package options
     * stored inside preview_metadata.
     */
    const packageMetadata =
      readPreviewValue(
        project.preview_metadata,
        "package_options",
      );

    const metadataPackages =
      Array.isArray(packageMetadata)
        ? packageMetadata.filter(
            (
              value,
            ): value is PackageType =>
              [
                "source_only",
                "complete",
                "complete_support",
              ].includes(
                String(value),
              ),
          )
        : [];

    const packageTypes =
      packages
        ?.map(
          (item) =>
            item.package_type,
        )
        .filter(
          (
            value,
          ): value is PackageType =>
            [
              "source_only",
              "complete",
              "complete_support",
            ].includes(value),
        ) ?? [];

    const demoUrl =
      readPreviewValue(
        project.preview_metadata,
        "demo_url",
      );

    const coverUrl = cover
      ? supabase.storage
          .from("project-media")
          .getPublicUrl(
            cover.storage_path,
          ).data.publicUrl
      : null;

    const accessType =
      normalizeAccessType(
        project.access_type,
      );

    const deliveryMethod =
      normalizeDeliveryMethod(
        project.delivery_method,
      );

    /*
     * Complete edit-form initial data.
     */
    initialData = {
      accessType,

      archiveName:
        files?.[0]
          ?.original_filename ??
        null,

      basePriceBdt:
        accessType === "free"
          ? 0
          : project.base_price_bdt,

      categoryId:
        project.category_id,

      coverUrl,

      deliveryMethod,

      demoUrl:
        typeof demoUrl ===
        "string"
          ? demoUrl
          : "",

      department:
        project.department,

      description:
        project.description,

      difficulty:
        project.difficulty,

      externalDeliveryUrl:
        deliveryMethod ===
        "upload"
          ? ""
          : project.external_delivery_url ??
            "",

      hasArchive:
        Boolean(files?.length),

      hasCover:
        Boolean(cover),

      id: project.id,

      includedAssets:
        project.included_assets,

      licenseType:
        project
          .license_options[0] ??
        "learning_personal",

      /*
       * Free projects always use Source Only
       * in our current package architecture.
       */
      packageOptions:
        accessType === "free"
          ? ["source_only"]
          : packageTypes.length >
              0
            ? packageTypes
            : metadataPackages.length >
                0
              ? metadataPackages
              : ["source_only"],

      requirements:
        project.requirements,

      status:
        project.status,

      supportDurationDays:
        project.support_duration_days,

      technologyTags:
        project.technology_tags,

      title:
        project.title,
    };
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Seller workspace
          </p>

          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            {initialData
              ? "Edit project listing"
              : "List a project"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Add clear deliverables,
            licensing, preview media,
            and choose how users will
            receive the project.
          </p>
        </div>

        <Link
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "gap-2",
          )}
          href="/sell/projects"
        >
          <FolderKanban
            aria-hidden="true"
          />

          My Projects
        </Link>
      </header>

      {categories &&
      categories.length > 0 ? (
        <ProjectListingForm
          categories={categories}
          initialData={initialData}
        />
      ) : (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-5 text-sm">
          No active categories are
          available. Make sure the
          required Supabase migrations
          have been applied before
          creating a listing.
        </div>
      )}
    </div>
  );
}