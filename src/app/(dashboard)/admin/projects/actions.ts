"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminAuth } from "@/lib/auth/admin";
import { databaseIdPattern } from "@/lib/database-id";
import { createClient } from "@/lib/supabase/server";

export type ModerationActionState = {
  error: string | null;
};

function isValidExternalDeliveryUrl(
  method: string,
  value: string | null,
) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return false;
    }

    if (method === "github") {
      if (url.hostname !== "github.com") {
        return false;
      }

      const pathParts = url.pathname
        .split("/")
        .filter(Boolean);

      return pathParts.length >= 2;
    }

    if (method === "google_drive") {
      return (
        url.hostname ===
        "drive.google.com"
      );
    }

    return false;
  } catch {
    return false;
  }
}

export async function moderateProjectAction(
  _previousState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const auth = await getAdminAuth();

  if (!auth) {
    return {
      error:
        "You are not authorized to moderate projects.",
    };
  }

  const projectId =
    formData.get("projectId");

  const intent =
    formData.get("intent");

  const rejectionReasonValue =
    formData.get(
      "rejectionReason",
    );

  if (
    typeof projectId !== "string" ||
    !databaseIdPattern.test(
      projectId,
    )
  ) {
    return {
      error:
        "Invalid project listing.",
    };
  }

  if (
    intent !== "approve" &&
    intent !== "reject"
  ) {
    return {
      error:
        "Invalid moderation action.",
    };
  }

  const rejectionReason =
    typeof rejectionReasonValue ===
    "string"
      ? rejectionReasonValue.trim()
      : "";

  if (
    intent === "reject" &&
    (rejectionReason.length < 5 ||
      rejectionReason.length > 500)
  ) {
    return {
      error:
        "Enter a rejection reason between 5 and 500 characters.",
    };
  }

  const supabase =
    await createClient();

  /*
   * Approval has stricter validation.
   *
   * Rejecting a project does not require
   * valid delivery information because the
   * whole purpose may be to reject an
   * incomplete submission.
   */
  if (intent === "approve") {
    const {
      data: project,
      error: projectError,
    } = await supabase
      .from("projects")
      .select(
        `
          id,
          status,
          access_type,
          delivery_method,
          external_delivery_url,
          base_price_bdt
        `,
      )
      .eq("id", projectId)
      .eq("status", "pending")
      .maybeSingle();

    if (
      projectError ||
      !project
    ) {
      return {
        error:
          "Unable to load this pending project.",
      };
    }

    /*
     * ----------------------------
     * Access validation
     * ----------------------------
     */
    if (
      project.access_type !==
        "free" &&
      project.access_type !==
        "paid"
    ) {
      return {
        error:
          "This project has an invalid access type.",
      };
    }

    if (
      project.access_type ===
        "free" &&
      project.base_price_bdt !==
        0
    ) {
      return {
        error:
          "A free project must have a price of 0 BDT before approval.",
      };
    }

    if (
      project.access_type ===
        "paid" &&
      project.base_price_bdt <=
        0
    ) {
      return {
        error:
          "A paid project must have a valid price before approval.",
      };
    }

    /*
     * ----------------------------
     * Upload delivery
     * ----------------------------
     */
    if (
      project.delivery_method ===
      "upload"
    ) {
      const {
        data: projectFile,
        error: fileError,
      } = await supabase
        .from("project_files")
        .select("id")
        .eq(
          "project_id",
          projectId,
        )
        .limit(1)
        .maybeSingle();

      if (
        fileError ||
        !projectFile
      ) {
        return {
          error:
            "This project uses file delivery but no private project archive is attached.",
        };
      }

      /*
       * Upload projects should not retain
       * an external delivery URL.
       */
      if (
        project.external_delivery_url
      ) {
        return {
          error:
            "This upload project still contains an external delivery URL. Ask the seller to resave the listing.",
        };
      }
    }

    /*
     * ----------------------------
     * GitHub delivery
     * ----------------------------
     */
    else if (
      project.delivery_method ===
      "github"
    ) {
      if (
        !isValidExternalDeliveryUrl(
          "github",
          project.external_delivery_url,
        )
      ) {
        return {
          error:
            "The GitHub repository URL is missing or invalid.",
        };
      }
    }

    /*
     * ----------------------------
     * Google Drive delivery
     * ----------------------------
     */
    else if (
      project.delivery_method ===
      "google_drive"
    ) {
      if (
        !isValidExternalDeliveryUrl(
          "google_drive",
          project.external_delivery_url,
        )
      ) {
        return {
          error:
            "The Google Drive URL is missing or invalid.",
        };
      }
    }

    /*
     * Unknown delivery values should never
     * reach publication.
     */
    else {
      return {
        error:
          "This project has an invalid delivery method.",
      };
    }
  }

  /*
   * Publish or reject.
   *
   * The status = pending condition prevents
   * an already moderated listing from being
   * changed by a stale form submission.
   */
  const {
    data,
    error,
  } = await supabase
    .from("projects")
    .update({
      rejection_reason:
        intent === "reject"
          ? rejectionReason
          : null,

      status:
        intent === "approve"
          ? "published"
          : "rejected",
    })
    .eq("id", projectId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      error:
        "Unable to update this project. Please try again.",
    };
  }

  if (!data) {
    return {
      error:
        "Only pending projects can be moderated.",
    };
  }

  /*
   * Refresh affected pages.
   */
  revalidatePath("/admin");
  revalidatePath(
    "/admin/projects",
  );
  revalidatePath(
    `/admin/projects/${projectId}`,
  );

  revalidatePath("/explore");
  revalidatePath("/projects");
  revalidatePath(
    `/projects/${projectId}`,
  );

  revalidatePath(
    "/sell/projects",
  );

  redirect(
    `/admin?moderated=${
      intent === "approve"
        ? "approved"
        : "rejected"
    }`,
  );
}