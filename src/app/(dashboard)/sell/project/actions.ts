"use server";

import { revalidatePath } from "next/cache";

import {
  maxArchiveFileSize,
  maxMediaFileSize,
  maxScreenshotCount,
  archiveFileExtensions,
  mediaFileExtensions,
  mediaMimeTypes,
  packageOptions,
  type ProjectDraftResult,
  type ProjectMutationResult,
  type SellerProjectInput,
  type UploadedArchive,
  type UploadedMedia,
} from "@/data/seller-project";
import { getAuthContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  isAllowedArchiveMimeType,
  validateSellerProjectInput,
} from "@/lib/seller-project/validation";
import type { Json } from "@/types/database";

const projectIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createSlug(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 110);

  return `${base || "student-project"}-${crypto.randomUUID().slice(0, 8)}`;
}

function projectPreviewMetadata(input: SellerProjectInput): Json {
  return {
    demo_url: input.demoUrl || null,
    package_options: input.packageOptions,
  };
}

function validateUploadedMedia(value: unknown): UploadedMedia[] | null {
  if (!Array.isArray(value) || value.length > 7) {
    return null;
  }

  const media: UploadedMedia[] = [];

  for (const item of value) {
    if (!isRecord(item)) return null;

    const kind = item.kind;
    const mimeType = item.mimeType;
    const originalName = item.originalName;
    const path = item.path;
    const sizeBytes = Number(item.sizeBytes);

    if (
      (kind !== "cover" && kind !== "screenshot") ||
      typeof mimeType !== "string" ||
      !mediaMimeTypes.includes(mimeType as (typeof mediaMimeTypes)[number]) ||
      typeof originalName !== "string" ||
      originalName.length < 1 ||
      originalName.length > 255 ||
      typeof path !== "string" ||
      !Number.isInteger(sizeBytes) ||
      sizeBytes < 1 ||
      sizeBytes > maxMediaFileSize
    ) {
      return null;
    }

    media.push({ kind, mimeType, originalName, path, sizeBytes });
  }

  if (
    media.filter((item) => item.kind === "cover").length > 1 ||
    media.filter((item) => item.kind === "screenshot").length >
      maxScreenshotCount
  ) {
    return null;
  }

  return media;
}

function validateUploadedArchive(value: unknown): UploadedArchive | null {
  if (!isRecord(value)) return null;

  const mimeType = value.mimeType;
  const originalName = value.originalName;
  const path = value.path;
  const sizeBytes = Number(value.sizeBytes);

  if (
    typeof mimeType !== "string" ||
    !isAllowedArchiveMimeType(mimeType) ||
    typeof originalName !== "string" ||
    originalName.length < 1 ||
    originalName.length > 255 ||
    typeof path !== "string" ||
    !Number.isInteger(sizeBytes) ||
    sizeBytes < 1 ||
    sizeBytes > maxArchiveFileSize
  ) {
    return null;
  }

  return { mimeType, originalName, path, sizeBytes };
}

function hasSafePath(path: string, prefix: string, folder: "media" | "archive") {
  const expectedPrefix = `${prefix}/${folder}/`;
  const filename = path.slice(expectedPrefix.length);

  return (
    path.startsWith(expectedPrefix) &&
    filename.length > 5 &&
    !filename.includes("/") &&
    /^[a-z0-9-]+\.[a-z0-9]+$/i.test(filename)
  );
}

function hasExpectedExtension(path: string, mimeType: string, archive: boolean) {
  const extensions = archive ? archiveFileExtensions : mediaFileExtensions;
  const expected = extensions[mimeType as keyof typeof extensions];
  return typeof expected === "string" && path.toLowerCase().endsWith(`.${expected}`);
}

async function storageObjectExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  path: string,
) {
  const lastSlash = path.lastIndexOf("/");
  const folder = path.slice(0, lastSlash);
  const filename = path.slice(lastSlash + 1);
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, { limit: 10, search: filename });

  return !error && data.some((object) => object.name === filename);
}

function getMediaKind(metadata: Json): "cover" | "screenshot" | null {
  if (
    metadata &&
    typeof metadata === "object" &&
    !Array.isArray(metadata) &&
    (metadata.kind === "cover" || metadata.kind === "screenshot")
  ) {
    return metadata.kind;
  }

  return null;
}

export async function saveProjectDraftAction(
  projectId: string | null,
  input: unknown,
): Promise<ProjectDraftResult> {
  const validation = validateSellerProjectInput(input);
  if (!validation.success) return { ok: false, error: validation.error };

  const auth = await getAuthContext();
  if (!auth) return { ok: false, error: "Sign in to create a project listing." };

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("id", validation.data.categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) return { ok: false, error: "Choose an active project category." };

  const projectValues = {
    base_price_bdt: validation.data.basePriceBdt,
    category_id: validation.data.categoryId,
    department: validation.data.department,
    description: validation.data.description,
    difficulty: validation.data.difficulty,
    included_assets: validation.data.includedAssets,
    license_options: [validation.data.licenseType],
    preview_metadata: projectPreviewMetadata(validation.data),
    requirements: validation.data.requirements,
    status: "draft" as const,
    support_duration_days: validation.data.supportDurationDays,
    technology_tags: validation.data.technologyTags,
    title: validation.data.title,
  };

  let savedProjectId: string;

  if (projectId) {
    if (!projectIdPattern.test(projectId)) {
      return { ok: false, error: "Invalid project listing." };
    }

    const { data: ownedProject } = await supabase
      .from("projects")
      .select("id, status")
      .eq("id", projectId)
      .eq("seller_id", auth.userId)
      .maybeSingle();

    if (!ownedProject) return { ok: false, error: "Project listing not found." };
    if (ownedProject.status === "published") {
      return {
        ok: false,
        error: "Published projects cannot be edited from this workflow.",
      };
    }

    const { error } = await supabase
      .from("projects")
      .update(projectValues)
      .eq("id", projectId)
      .eq("seller_id", auth.userId);

    if (error) return { ok: false, error: "Unable to save the project draft." };
    savedProjectId = projectId;
  } else {
    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        ...projectValues,
        seller_id: auth.userId,
        slug: createSlug(validation.data.title),
      })
      .select("id")
      .single();

    if (error || !project) {
      return { ok: false, error: "Unable to create the project draft." };
    }
    savedProjectId = project.id;
  }

  await supabase
    .from("profiles")
    .update({ is_seller: true })
    .eq("id", auth.userId);

  revalidatePath("/sell/projects");
  return {
    ok: true,
    pathPrefix: `${auth.userId}/${savedProjectId}`,
    projectId: savedProjectId,
  };
}

export async function submitProjectAction(
  projectId: string,
  input: unknown,
  uploadedMedia: unknown,
  uploadedArchive: unknown,
): Promise<ProjectMutationResult> {
  if (!projectIdPattern.test(projectId)) {
    return { ok: false, error: "Invalid project listing." };
  }

  const validation = validateSellerProjectInput(input);
  const media = validateUploadedMedia(uploadedMedia);
  const archive = uploadedArchive ? validateUploadedArchive(uploadedArchive) : null;

  if (!validation.success) return { ok: false, error: validation.error };
  if (!media) return { ok: false, error: "Invalid uploaded media information." };
  if (uploadedArchive && !archive) {
    return { ok: false, error: "Invalid project archive information." };
  }

  const auth = await getAuthContext();
  if (!auth) return { ok: false, error: "Your session has expired." };

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("id", validation.data.categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) return { ok: false, error: "Choose an active project category." };

  const { data: project } = await supabase
    .from("projects")
    .select("id, status")
    .eq("id", projectId)
    .eq("seller_id", auth.userId)
    .maybeSingle();

  if (!project) return { ok: false, error: "Project listing not found." };
  if (project.status === "published") {
    return {
      ok: false,
      error: "Published projects cannot be resubmitted from this workflow.",
    };
  }

  const pathPrefix = `${auth.userId}/${projectId}`;
  for (const item of media) {
    if (
      !hasSafePath(item.path, pathPrefix, "media") ||
      !hasExpectedExtension(item.path, item.mimeType, false) ||
      !(await storageObjectExists(supabase, "project-media", item.path))
    ) {
      return { ok: false, error: "A preview image upload could not be verified." };
    }
  }

  if (
    archive &&
    (!hasSafePath(archive.path, pathPrefix, "archive") ||
      !hasExpectedExtension(archive.path, archive.mimeType, true) ||
      !(await storageObjectExists(supabase, "project-archives", archive.path)))
  ) {
    return { ok: false, error: "The private project archive could not be verified." };
  }

  const { data: existingMedia } = await supabase
    .from("project_media")
    .select("id, storage_path, preview_metadata")
    .eq("project_id", projectId);
  const { data: existingFiles } = await supabase
    .from("project_files")
    .select("id, storage_path, mime_type")
    .eq("project_id", projectId);
  const existingCover = existingMedia?.find(
    (item) => getMediaKind(item.preview_metadata) === "cover",
  );
  const hasExistingCover = Boolean(
    existingCover &&
      hasSafePath(existingCover.storage_path, pathPrefix, "media") &&
      (await storageObjectExists(
        supabase,
        "project-media",
        existingCover.storage_path,
      )),
  );
  let hasExistingArchive = false;

  for (const file of existingFiles ?? []) {
    if (
      hasSafePath(file.storage_path, pathPrefix, "archive") &&
      hasExpectedExtension(file.storage_path, file.mime_type, true) &&
      (await storageObjectExists(supabase, "project-archives", file.storage_path))
    ) {
      hasExistingArchive = true;
      break;
    }
  }

  if (!hasExistingCover && !media.some((item) => item.kind === "cover")) {
    return { ok: false, error: "Add a cover image before submitting." };
  }

  if (!hasExistingArchive && !archive) {
    return { ok: false, error: "Add a private project archive before submitting." };
  }

  const replaceKinds = new Set(media.map((item) => item.kind));
  const mediaToReplace =
    existingMedia?.filter((item) => {
      const kind = getMediaKind(item.preview_metadata);
      return kind ? replaceKinds.has(kind) : false;
    }) ?? [];

  if (media.length > 0) {
    const { error } = await supabase.from("project_media").insert(
      media.map((item, index) => ({
        alt_text: `${validation.data.title} ${item.kind}`,
        is_public: true,
        media_type: "image" as const,
        preview_metadata: { kind: item.kind },
        project_id: projectId,
        sort_order: item.kind === "cover" ? 0 : index + 1,
        storage_path: item.path,
        title: item.kind === "cover" ? "Cover" : item.originalName,
      })),
    );
    if (error) return { ok: false, error: "Unable to save project media." };
  }

  if (mediaToReplace.length > 0) {
    const { error: deleteError } = await supabase
      .from("project_media")
      .delete()
      .in(
        "id",
        mediaToReplace.map((item) => item.id),
      );
    if (deleteError) return { ok: false, error: "Unable to update project media." };

    const { error: removeError } = await supabase.storage
      .from("project-media")
      .remove(mediaToReplace.map((item) => item.storage_path));
    if (removeError) return { ok: false, error: "Unable to replace existing media." };
  }

  if (archive) {
    const { error } = await supabase.from("project_files").insert({
      mime_type: archive.mimeType,
      original_filename: archive.originalName,
      project_id: projectId,
      size_bytes: archive.sizeBytes,
      storage_path: archive.path,
    });
    if (error) return { ok: false, error: "Unable to record the private archive." };

    if (existingFiles && existingFiles.length > 0) {
      const { error: deleteError } = await supabase
        .from("project_files")
        .delete()
        .in(
          "id",
          existingFiles.map((file) => file.id),
        );
      if (deleteError) return { ok: false, error: "Unable to update the archive." };

      const { error: removeError } = await supabase.storage
        .from("project-archives")
        .remove(existingFiles.map((file) => file.storage_path));
      if (removeError) return { ok: false, error: "Unable to replace the archive." };
    }
  }

  const { error: packageDeleteError } = await supabase
    .from("project_packages")
    .delete()
    .eq("project_id", projectId);
  if (packageDeleteError) return { ok: false, error: "Unable to update packages." };

  const selectedPackages = packageOptions.filter((option) =>
    validation.data.packageOptions.includes(option.value),
  );
  const { error: packageInsertError } = await supabase
    .from("project_packages")
    .insert(
      selectedPackages.map((option) => ({
        description: option.description,
        included_assets: validation.data.includedAssets,
        license_type: validation.data.licenseType,
        name: option.label,
        package_type: option.value,
        price_bdt: Math.round(validation.data.basePriceBdt * option.multiplier),
        project_id: projectId,
        support_duration_days:
          option.value === "complete_support"
            ? validation.data.supportDurationDays
            : 0,
      })),
    );
  if (packageInsertError) return { ok: false, error: "Unable to save packages." };

  const { error: submitError } = await supabase
    .from("projects")
    .update({
      base_price_bdt: validation.data.basePriceBdt,
      category_id: validation.data.categoryId,
      department: validation.data.department,
      description: validation.data.description,
      difficulty: validation.data.difficulty,
      included_assets: validation.data.includedAssets,
      license_options: [validation.data.licenseType],
      preview_metadata: projectPreviewMetadata(validation.data),
      requirements: validation.data.requirements,
      status: "pending",
      support_duration_days: validation.data.supportDurationDays,
      technology_tags: validation.data.technologyTags,
      title: validation.data.title,
    })
    .eq("id", projectId)
    .eq("seller_id", auth.userId);
  if (submitError) return { ok: false, error: "Unable to submit the project." };

  revalidatePath("/sell/projects");
  return { ok: true };
}

export async function deleteProjectAction(
  projectId: string,
): Promise<ProjectMutationResult> {
  if (!projectIdPattern.test(projectId)) {
    return { ok: false, error: "Invalid project listing." };
  }

  const auth = await getAuthContext();
  if (!auth) return { ok: false, error: "Your session has expired." };

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, status")
    .eq("id", projectId)
    .eq("seller_id", auth.userId)
    .maybeSingle();

  if (!project) return { ok: false, error: "Project listing not found." };
  if (project.status === "published") {
    return { ok: false, error: "Published projects must be archived before deletion." };
  }

  const [{ data: media }, { data: files }] = await Promise.all([
    supabase.from("project_media").select("storage_path").eq("project_id", projectId),
    supabase.from("project_files").select("storage_path").eq("project_id", projectId),
  ]);

  if (media && media.length > 0) {
    const { error } = await supabase.storage
      .from("project-media")
      .remove(media.map((item) => item.storage_path));
    if (error) return { ok: false, error: "Unable to remove project media." };
  }

  if (files && files.length > 0) {
    const { error } = await supabase.storage
      .from("project-archives")
      .remove(files.map((item) => item.storage_path));
    if (error) return { ok: false, error: "Unable to remove the private archive." };
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("seller_id", auth.userId);

  if (error) return { ok: false, error: "Unable to delete this project." };

  revalidatePath("/sell/projects");
  return { ok: true };
}
