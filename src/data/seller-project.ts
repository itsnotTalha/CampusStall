import type { Database } from "@/types/database";

export type DifficultyLevel =
  Database["public"]["Enums"]["difficulty_level"];

export type LicenseType =
  Database["public"]["Enums"]["license_type"];

export type PackageType =
  Database["public"]["Enums"]["package_type"];

/*
 * Project pricing/access model.
 */
export type ProjectAccessType = "free" | "paid";

/*
 * How the buyer receives the project.
 */
export type ProjectDeliveryMethod =
  | "upload"
  | "github"
  | "google_drive";

export type SellerCategory = {
  id: string;
  name: string;
};

export type SellerProjectInput = {
  accessType: ProjectAccessType;
  basePriceBdt: number;
  categoryId: string;
  deliveryMethod: ProjectDeliveryMethod;
  demoUrl: string;
  department: string;
  description: string;
  difficulty: DifficultyLevel;
  externalDeliveryUrl: string;
  includedAssets: string[];
  licenseType: LicenseType;
  packageOptions: PackageType[];
  requirements: string;
  supportDurationDays: number;
  technologyTags: string[];
  title: string;
};

export type SellerProjectInitialData = SellerProjectInput & {
  archiveName: string | null;
  coverUrl: string | null;
  hasArchive: boolean;
  hasCover: boolean;
  id: string;
  status: Database["public"]["Enums"]["listing_status"];
};

export type UploadedMedia = {
  kind: "cover" | "screenshot";
  mimeType: string;
  originalName: string;
  path: string;
  sizeBytes: number;
};

export type UploadedArchive = {
  mimeType: string;
  originalName: string;
  path: string;
  sizeBytes: number;
};

export type ProjectDraftResult =
  | {
      ok: true;
      pathPrefix: string;
      projectId: string;
    }
  | {
      ok: false;
      error: string;
    };

export type ProjectMutationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    };

/*
 * Project listing form steps.
 *
 * Keep the number/order of steps unchanged because
 * ProjectListingForm currently uses the numeric indexes.
 */
export const projectFormSteps = [
  "Basic information",
  "Technology",
  "Access & pricing",
  "Included content",
  "Media",
  "Delivery",
  "Review",
] as const;

/*
 * Free / Paid options.
 */
export const projectAccessOptions: {
  description: string;
  label: string;
  value: ProjectAccessType;
}[] = [
  {
    label: "Free",
    value: "free",
    description:
      "Anyone can access this project without making a payment.",
  },
  {
    label: "Paid",
    value: "paid",
    description:
      "Users must purchase this project before receiving access.",
  },
];

/*
 * Project delivery options.
 */
export const projectDeliveryOptions: {
  description: string;
  label: string;
  value: ProjectDeliveryMethod;
}[] = [
  {
    label: "Upload project file",
    value: "upload",
    description:
      "Upload a private project archive to CampusStall.",
  },
  {
    label: "GitHub repository",
    value: "github",
    description:
      "Provide a GitHub repository link for the project.",
  },
  {
    label: "Google Drive",
    value: "google_drive",
    description:
      "Provide a shared Google Drive file or folder link.",
  },
];

export const difficultyOptions: {
  label: string;
  value: DifficultyLevel;
}[] = [
  {
    label: "Beginner",
    value: "beginner",
  },
  {
    label: "Intermediate",
    value: "intermediate",
  },
  {
    label: "Advanced",
    value: "advanced",
  },
];

export const packageOptions: {
  description: string;
  label: string;
  multiplier: number;
  value: PackageType;
}[] = [
  {
    label: "Source Only",
    value: "source_only",
    description:
      "Core source files and the selected license.",
    multiplier: 1,
  },
  {
    label: "Complete Package",
    value: "complete",
    description:
      "Source plus all selected supporting assets.",
    multiplier: 1.35,
  },
  {
    label: "Complete + Support",
    value: "complete_support",
    description:
      "Complete package with the listed support duration.",
    multiplier: 1.7,
  },
];

export const licenseOptions: {
  label: string;
  value: LicenseType;
}[] = [
  {
    label: "Learning / Personal License",
    value: "learning_personal",
  },
  {
    label: "Single Project License",
    value: "single_project",
  },
  {
    label: "Commercial License",
    value: "commercial",
  },
];

export const includedAssetOptions = [
  {
    label: "Source code",
    value: "source_code",
  },
  {
    label: "Database",
    value: "database",
  },
  {
    label: "Dataset",
    value: "dataset",
  },
  {
    label: "Trained model",
    value: "trained_model",
  },
  {
    label: "Documentation",
    value: "documentation",
  },
  {
    label: "Presentation",
    value: "presentation",
  },
  {
    label: "Installation guide",
    value: "installation_guide",
  },
  {
    label: "Demo files",
    value: "demo_files",
  },
] as const;

/*
 * Supported preview image types.
 */
export const mediaMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/*
 * Supported uploaded project archive types.
 */
export const archiveMimeTypes = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-tar",
  "application/gzip",
  "application/x-gzip",
  "application/x-7z-compressed",
] as const;

export const mediaFileExtensions: Record<
  (typeof mediaMimeTypes)[number],
  string
> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const archiveFileExtensions: Record<
  (typeof archiveMimeTypes)[number],
  string
> = {
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/x-tar": "tar",
  "application/gzip": "gz",
  "application/x-gzip": "gz",
  "application/x-7z-compressed": "7z",
};

export const maxMediaFileSize =
  8 * 1024 * 1024;

export const maxArchiveFileSize =
  50 * 1024 * 1024;

export const maxScreenshotCount = 6;