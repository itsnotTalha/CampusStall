import {
  archiveMimeTypes,
  difficultyOptions,
  includedAssetOptions,
  licenseOptions,
  packageOptions,
  projectAccessOptions,
  projectDeliveryOptions,
  type SellerProjectInput,
} from "@/data/seller-project";

type ValidationResult =
  | {
      success: true;
      data: SellerProjectInput;
    }
  | {
      success: false;
      error: string;
    };

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isStringArray(
  value: unknown,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

export function validateSellerProjectInput(
  input: unknown,
): ValidationResult {
  if (!isRecord(input)) {
    return {
      success: false,
      error: "Invalid project information.",
    };
  }

  /*
   * Basic text fields
   */
  const title =
    typeof input.title === "string"
      ? input.title.trim()
      : "";

  const description =
    typeof input.description === "string"
      ? input.description.trim()
      : "";

  const categoryId =
    typeof input.categoryId === "string"
      ? input.categoryId.trim()
      : "";

  const department =
    typeof input.department === "string"
      ? input.department.trim()
      : "";

  const requirements =
    typeof input.requirements === "string"
      ? input.requirements.trim()
      : "";

  const demoUrl =
    typeof input.demoUrl === "string"
      ? input.demoUrl.trim()
      : "";

  const externalDeliveryUrl =
    typeof input.externalDeliveryUrl === "string"
      ? input.externalDeliveryUrl.trim()
      : "";

  const basePriceBdt =
    Number(input.basePriceBdt);

  const supportDurationDays =
    Number(input.supportDurationDays);

  /*
   * Title
   */
  if (
    title.length < 5 ||
    title.length > 160
  ) {
    return {
      success: false,
      error:
        "Title must be between 5 and 160 characters.",
    };
  }

  /*
   * Description
   */
  if (
    description.length < 20 ||
    description.length > 20000
  ) {
    return {
      success: false,
      error:
        "Description must be between 20 and 20,000 characters.",
    };
  }

  /*
   * Category + department
   */
  if (
    !categoryId ||
    department.length < 2 ||
    department.length > 80
  ) {
    return {
      success: false,
      error:
        "Choose a category and enter a department.",
    };
  }

  /*
   * Difficulty
   */
  const difficulties =
    difficultyOptions.map(
      (option) => option.value,
    );

  if (
    typeof input.difficulty !== "string" ||
    !difficulties.includes(
      input.difficulty as SellerProjectInput["difficulty"],
    )
  ) {
    return {
      success: false,
      error: "Choose a valid difficulty.",
    };
  }

  /*
   * Technology tags
   */
  if (!isStringArray(input.technologyTags)) {
    return {
      success: false,
      error: "Enter valid technology tags.",
    };
  }

  const technologyTags = [
    ...new Set(
      input.technologyTags.map(
        (tag) => tag.trim(),
      ),
    ),
  ]
    .filter(Boolean)
    .slice(0, 12);

  if (
    technologyTags.length === 0 ||
    technologyTags.some(
      (tag) => tag.length > 30,
    )
  ) {
    return {
      success: false,
      error:
        "Add 1–12 technology tags of up to 30 characters.",
    };
  }

  /*
   * Requirements
   */
  if (requirements.length > 4000) {
    return {
      success: false,
      error:
        "Requirements must be 4,000 characters or fewer.",
    };
  }

  /*
   * Free / Paid access
   */
  const validAccessTypes =
    projectAccessOptions.map(
      (option) => option.value,
    );

  if (
    typeof input.accessType !== "string" ||
    !validAccessTypes.includes(
      input.accessType as SellerProjectInput["accessType"],
    )
  ) {
    return {
      success: false,
      error:
        "Choose whether the project is free or paid.",
    };
  }

  const accessType =
    input.accessType as SellerProjectInput["accessType"];

  /*
   * Price rules
   *
   * FREE:
   * Must always be ৳0.
   *
   * PAID:
   * Must be at least ৳1.
   */
  if (accessType === "free") {
    if (
      !Number.isInteger(basePriceBdt) ||
      basePriceBdt !== 0
    ) {
      return {
        success: false,
        error:
          "Free projects must have a price of ৳0.",
      };
    }
  }

  if (accessType === "paid") {
    if (
      !Number.isInteger(basePriceBdt) ||
      basePriceBdt < 1 ||
      basePriceBdt > 1000000
    ) {
      return {
        success: false,
        error:
          "Enter a valid project price in BDT.",
      };
    }
  }

  /*
   * Seller support
   */
  if (
    !Number.isInteger(
      supportDurationDays,
    ) ||
    supportDurationDays < 0 ||
    supportDurationDays > 365
  ) {
    return {
      success: false,
      error:
        "Support duration must be between 0 and 365 days.",
    };
  }

  /*
   * Package options
   *
   * We keep at least one package for both
   * free and paid projects because existing
   * CampusStall project pages use packages.
   *
   * Free projects can simply use
   * Source Only at ৳0.
   */
  const validPackageTypes =
    packageOptions.map(
      (option) => option.value,
    );

  if (
    !isStringArray(
      input.packageOptions,
    ) ||
    input.packageOptions.length === 0 ||
    input.packageOptions.some(
      (option) =>
        !validPackageTypes.includes(
          option as SellerProjectInput["packageOptions"][number],
        ),
    )
  ) {
    return {
      success: false,
      error:
        "Select at least one valid package option.",
    };
  }

  /*
   * License
   */
  const validLicenses =
    licenseOptions.map(
      (option) => option.value,
    );

  if (
    typeof input.licenseType !== "string" ||
    !validLicenses.includes(
      input.licenseType as SellerProjectInput["licenseType"],
    )
  ) {
    return {
      success: false,
      error:
        "Choose a valid license type.",
    };
  }

  /*
   * Included assets
   */
  const validAssets =
    includedAssetOptions.map(
      (option) => option.value as string,
    );

  if (
    !isStringArray(
      input.includedAssets,
    ) ||
    input.includedAssets.length === 0 ||
    input.includedAssets.some(
      (asset) =>
        !validAssets.includes(asset),
    )
  ) {
    return {
      success: false,
      error:
        "Select at least one included item.",
    };
  }

  /*
   * Optional demo URL
   */
  if (demoUrl) {
    try {
      const parsedUrl =
        new URL(demoUrl);

      if (
        !["http:", "https:"].includes(
          parsedUrl.protocol,
        )
      ) {
        throw new Error(
          "Unsupported protocol",
        );
      }
    } catch {
      return {
        success: false,
        error:
          "Enter a valid http or https demo URL.",
      };
    }
  }

  /*
   * Delivery method
   */
  const validDeliveryMethods =
    projectDeliveryOptions.map(
      (option) => option.value,
    );

  if (
    typeof input.deliveryMethod !== "string" ||
    !validDeliveryMethods.includes(
      input.deliveryMethod as SellerProjectInput["deliveryMethod"],
    )
  ) {
    return {
      success: false,
      error:
        "Choose how the project will be delivered.",
    };
  }

  const deliveryMethod =
    input.deliveryMethod as SellerProjectInput["deliveryMethod"];

  /*
   * Validate GitHub / Google Drive URL.
   *
   * Upload delivery does not use an
   * external URL.
   */
  const deliveryUrlError =
    validateExternalDeliveryUrl(
      deliveryMethod,
      externalDeliveryUrl,
    );

  if (deliveryUrlError) {
    return {
      success: false,
      error: deliveryUrlError,
    };
  }

  /*
   * Return sanitized and validated input.
   */
  return {
    success: true,

    data: {
      accessType,

      basePriceBdt:
        accessType === "free"
          ? 0
          : basePriceBdt,

      categoryId,

      deliveryMethod,

      demoUrl,

      department,

      description,

      difficulty:
        input.difficulty as SellerProjectInput["difficulty"],

      externalDeliveryUrl:
        deliveryMethod === "upload"
          ? ""
          : externalDeliveryUrl,

      includedAssets: [
        ...new Set(
          input.includedAssets,
        ),
      ],

      licenseType:
        input.licenseType as SellerProjectInput["licenseType"],

      packageOptions: [
        ...new Set(
          input.packageOptions,
        ),
      ] as SellerProjectInput["packageOptions"],

      requirements,

      supportDurationDays,

      technologyTags,

      title,
    },
  };
}

/*
 * Validate the external project delivery URL.
 *
 * We only validate the URL.
 * CampusStall does NOT fetch the URL server-side.
 */
function validateExternalDeliveryUrl(
  method: SellerProjectInput["deliveryMethod"],
  value: string,
): string | null {
  /*
   * Uploaded projects do not require
   * an external delivery URL.
   */
  if (method === "upload") {
    return null;
  }

  if (!value) {
    return method === "github"
      ? "Add the GitHub repository URL."
      : "Add the Google Drive URL.";
  }

  try {
    const url = new URL(value);

    /*
     * External project links must use HTTPS.
     */
    if (url.protocol !== "https:") {
      return "Project delivery links must use HTTPS.";
    }

    /*
     * GitHub repository
     */
    if (method === "github") {
      if (url.hostname !== "github.com") {
        return "Use a valid github.com repository URL.";
      }

      /*
       * Require:
       *
       * github.com/username/repository
       */
      const pathParts =
        url.pathname
          .split("/")
          .filter(Boolean);

      if (pathParts.length < 2) {
        return "Enter a GitHub repository URL, for example https://github.com/username/project.";
      }

      return null;
    }

    /*
     * Google Drive
     */
    if (method === "google_drive") {
      if (
        url.hostname !==
        "drive.google.com"
      ) {
        return "Use a valid drive.google.com link.";
      }

      return null;
    }

    return "Choose a valid project delivery method.";
  } catch {
    return method === "github"
      ? "Enter a valid GitHub repository URL."
      : "Enter a valid Google Drive URL.";
  }
}

/*
 * Used by actions.ts when checking
 * uploaded project archives.
 */
export function isAllowedArchiveMimeType(
  value: string,
) {
  return archiveMimeTypes.includes(
    value as (typeof archiveMimeTypes)[number],
  );
}