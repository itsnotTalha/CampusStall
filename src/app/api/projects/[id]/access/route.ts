import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { getSupabasePublicEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

const projectIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/*
 * Never cache project access responses.
 */
export const dynamic = "force-dynamic";

/*
 * Create a backend-only Supabase client.
 *
 * IMPORTANT:
 * SUPABASE_SECRET_KEY must NEVER use NEXT_PUBLIC_.
 */
function createAdminClient() {
  const { url } = getSupabasePublicEnv();

  const secretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not configured.",
    );
  }

  return createClient<Database>(
    url,
    secretKey,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
}

/*
 * Validate external delivery URLs again before redirecting.
 *
 * We do not blindly redirect to whatever value is stored
 * in the database.
 */
function getSafeExternalUrl(
  method: "github" | "google_drive",
  value: string | null,
): URL | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    /*
     * Only HTTPS.
     */
    if (url.protocol !== "https:") {
      return null;
    }

    /*
     * GitHub repositories.
     */
    if (method === "github") {
      if (url.hostname !== "github.com") {
        return null;
      }

      const pathParts = url.pathname
        .split("/")
        .filter(Boolean);

      /*
       * Require:
       * github.com/username/repository
       */
      if (pathParts.length < 2) {
        return null;
      }

      return url;
    }

    /*
     * Google Drive.
     */
    if (
      method === "google_drive" &&
      url.hostname === "drive.google.com"
    ) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const { id } = await params;

  /*
   * Reject malformed project IDs.
   */
  if (!projectIdPattern.test(id)) {
    return NextResponse.json(
      {
        error: "Project not found.",
      },
      {
        status: 404,
      },
    );
  }

  let supabase;

  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      {
        error:
          "Project access is temporarily unavailable.",
      },
      {
        status: 500,
      },
    );
  }

  /*
   * SECURITY CHECK
   *
   * Because this client bypasses RLS, we MUST explicitly
   * enforce all access requirements here.
   *
   * Anonymous access is allowed ONLY when:
   *
   * status = published
   * access_type = free
   */
  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .select(
      "id, status, access_type, delivery_method, external_delivery_url",
    )
    .eq("id", id)
    .eq("status", "published")
    .eq("access_type", "free")
    .maybeSingle();

  /*
   * Use a generic 404 instead of revealing whether
   * the project exists but is paid/private/unpublished.
   */
  if (projectError || !project) {
    return NextResponse.json(
      {
        error: "Project not found.",
      },
      {
        status: 404,
      },
    );
  }

  /*
   * ============================================
   * GitHub delivery
   * ============================================
   */
  if (
    project.delivery_method === "github"
  ) {
    const url = getSafeExternalUrl(
      "github",
      project.external_delivery_url,
    );

    if (!url) {
      return NextResponse.json(
        {
          error:
            "The GitHub repository link is unavailable.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.redirect(
      url,
      307,
    );
  }

  /*
   * ============================================
   * Google Drive delivery
   * ============================================
   */
  if (
    project.delivery_method ===
    "google_drive"
  ) {
    const url = getSafeExternalUrl(
      "google_drive",
      project.external_delivery_url,
    );

    if (!url) {
      return NextResponse.json(
        {
          error:
            "The Google Drive link is unavailable.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.redirect(
      url,
      307,
    );
  }

  /*
   * ============================================
   * Uploaded private archive
   * ============================================
   */
  if (
    project.delivery_method === "upload"
  ) {
    /*
     * Find the private archive belonging to this project.
     */
    const {
      data: projectFile,
      error: fileError,
    } = await supabase
      .from("project_files")
      .select(
        "storage_path, original_filename",
      )
      .eq("project_id", project.id)
      .limit(1)
      .maybeSingle();

    if (
      fileError ||
      !projectFile
    ) {
      return NextResponse.json(
        {
          error:
            "The project file is unavailable.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Extra path safety check.
     *
     * Existing seller uploads use:
     *
     * sellerId/projectId/archive/file.ext
     *
     * At minimum, make sure this path belongs
     * to this project and the archive folder.
     */
    const safeProjectPart =
      `/${project.id}/archive/`;

    if (
      !projectFile.storage_path.includes(
        safeProjectPart,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The project file is invalid.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * Create a short-lived download URL.
     *
     * The project-archives bucket remains PRIVATE.
     *
     * URL expires after 60 seconds.
     */
    const {
      data: signedFile,
      error: signedUrlError,
    } = await supabase.storage
      .from("project-archives")
      .createSignedUrl(
        projectFile.storage_path,
        60,
        {
          download:
            projectFile.original_filename ||
            true,
        },
      );

    if (
      signedUrlError ||
      !signedFile?.signedUrl
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to prepare the project download.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.redirect(
      signedFile.signedUrl,
      307,
    );
  }

  /*
   * Unknown delivery method.
   */
  return NextResponse.json(
    {
      error:
        "This project does not have a valid delivery method.",
    },
    {
      status: 500,
    },
  );
}