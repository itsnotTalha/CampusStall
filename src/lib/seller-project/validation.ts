import {
  archiveMimeTypes,
  difficultyOptions,
  includedAssetOptions,
  licenseOptions,
  packageOptions,
  type SellerProjectInput,
} from "@/data/seller-project";

type ValidationResult =
  | { success: true; data: SellerProjectInput }
  | { success: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateSellerProjectInput(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return { success: false, error: "Invalid project information." };
  }

  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  const categoryId =
    typeof input.categoryId === "string" ? input.categoryId.trim() : "";
  const department =
    typeof input.department === "string" ? input.department.trim() : "";
  const requirements =
    typeof input.requirements === "string" ? input.requirements.trim() : "";
  const demoUrl = typeof input.demoUrl === "string" ? input.demoUrl.trim() : "";
  const basePriceBdt = Number(input.basePriceBdt);
  const supportDurationDays = Number(input.supportDurationDays);

  if (title.length < 5 || title.length > 160) {
    return { success: false, error: "Title must be between 5 and 160 characters." };
  }

  if (description.length < 20 || description.length > 20000) {
    return {
      success: false,
      error: "Description must be between 20 and 20,000 characters.",
    };
  }

  if (!categoryId || department.length < 2 || department.length > 80) {
    return { success: false, error: "Choose a category and enter a department." };
  }

  const difficulties = difficultyOptions.map((option) => option.value);
  if (
    typeof input.difficulty !== "string" ||
    !difficulties.includes(input.difficulty as SellerProjectInput["difficulty"])
  ) {
    return { success: false, error: "Choose a valid difficulty." };
  }

  if (!isStringArray(input.technologyTags)) {
    return { success: false, error: "Enter valid technology tags." };
  }

  const technologyTags = [...new Set(input.technologyTags.map((tag) => tag.trim()))]
    .filter(Boolean)
    .slice(0, 12);

  if (
    technologyTags.length === 0 ||
    technologyTags.some((tag) => tag.length > 30)
  ) {
    return { success: false, error: "Add 1–12 technology tags of up to 30 characters." };
  }

  if (requirements.length > 4000) {
    return { success: false, error: "Requirements must be 4,000 characters or fewer." };
  }

  if (!Number.isInteger(basePriceBdt) || basePriceBdt < 0 || basePriceBdt > 1000000) {
    return { success: false, error: "Enter a valid base price in BDT." };
  }

  if (
    !Number.isInteger(supportDurationDays) ||
    supportDurationDays < 0 ||
    supportDurationDays > 365
  ) {
    return { success: false, error: "Support duration must be between 0 and 365 days." };
  }

  const validPackageTypes = packageOptions.map((option) => option.value);
  if (
    !isStringArray(input.packageOptions) ||
    input.packageOptions.length === 0 ||
    input.packageOptions.some(
      (option) =>
        !validPackageTypes.includes(option as SellerProjectInput["packageOptions"][number]),
    )
  ) {
    return { success: false, error: "Select at least one valid package option." };
  }

  const validLicenses = licenseOptions.map((option) => option.value);
  if (
    typeof input.licenseType !== "string" ||
    !validLicenses.includes(input.licenseType as SellerProjectInput["licenseType"])
  ) {
    return { success: false, error: "Choose a valid license type." };
  }

  const validAssets = includedAssetOptions.map((option) => option.value as string);
  if (
    !isStringArray(input.includedAssets) ||
    input.includedAssets.length === 0 ||
    input.includedAssets.some((asset) => !validAssets.includes(asset))
  ) {
    return { success: false, error: "Select at least one included item." };
  }

  if (demoUrl) {
    try {
      const parsedUrl = new URL(demoUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error("Unsupported protocol");
      }
    } catch {
      return { success: false, error: "Enter a valid http or https demo URL." };
    }
  }

  return {
    success: true,
    data: {
      basePriceBdt,
      categoryId,
      demoUrl,
      department,
      description,
      difficulty: input.difficulty as SellerProjectInput["difficulty"],
      includedAssets: [...new Set(input.includedAssets)],
      licenseType: input.licenseType as SellerProjectInput["licenseType"],
      packageOptions: [
        ...new Set(input.packageOptions),
      ] as SellerProjectInput["packageOptions"],
      requirements,
      supportDurationDays,
      technologyTags,
      title,
    },
  };
}

export function isAllowedArchiveMimeType(value: string) {
  return archiveMimeTypes.includes(value as (typeof archiveMimeTypes)[number]);
}
