import type { ReactNode } from "react";
import {
  Archive,
  CheckCircle2,
  Code2,
  Gift,
  GitBranch,
  HardDrive,
  PackageCheck,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  includedAssetOptions,
  licenseOptions,
  packageOptions,
  projectDeliveryOptions,
  type SellerCategory,
  type SellerProjectInput,
} from "@/data/seller-project";
import { formatBdt } from "@/lib/format";

export function ProjectListingPreview({
  category,
  coverUrl,
  values,
}: {
  category?: SellerCategory;
  coverUrl: string | null;
  values: SellerProjectInput;
}) {
  const selectedLicense = licenseOptions.find(
    (option) =>
      option.value === values.licenseType,
  );

  const selectedDeliveryMethod =
    projectDeliveryOptions.find(
      (option) =>
        option.value === values.deliveryMethod,
    );

  const isFree =
    values.accessType === "free";

  const DeliveryIcon =
    values.deliveryMethod === "github"
      ? GitBranch
      : values.deliveryMethod ===
          "google_drive"
        ? HardDrive
        : Archive;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_19rem]">
      {/* Project preview card */}
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
        <div
          className="relative aspect-video overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(99,102,241,0.2),transparent_38%),linear-gradient(145deg,#0f172a,#08111f)] bg-cover bg-center"
          style={
            coverUrl
              ? {
                  backgroundImage: `url(${coverUrl})`,
                }
              : undefined
          }
        >
          <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[9px] font-semibold tracking-wide text-slate-100 uppercase backdrop-blur-md">
            Pending review
          </span>

          {/* Free / Paid badge */}
          <span className="absolute top-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-md">
            {isFree ? "Free" : "Paid"}
          </span>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold text-primary">
            {category?.name ??
              "Project category"}
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-tight">
            {values.title ||
              "Your project title"}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {values.description ||
              "Your project description will appear here."}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {values.technologyTags
              .filter(Boolean)
              .map((tag) => (
                <span
                  className="rounded-md border bg-background/50 px-2 py-1 text-[11px] text-muted-foreground"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* External delivery preview */}
          {values.deliveryMethod !==
            "upload" &&
            values.externalDeliveryUrl && (
              <div className="mt-5 rounded-lg border border-border/70 bg-background/40 p-3">
                <p className="text-xs font-semibold">
                  Delivery link
                </p>

                <p className="mt-1 break-all text-xs leading-5 text-muted-foreground">
                  {
                    values.externalDeliveryUrl
                  }
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Project summary */}
      <aside className="rounded-xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
        {/* Price */}
        <p className="text-xs text-muted-foreground">
          {isFree
            ? "Project access"
            : "Base price"}
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {isFree
            ? "FREE"
            : formatBdt(
                values.basePriceBdt,
              )}
        </p>

        <div className="mt-5 space-y-3 border-t pt-4 text-xs">
          {/* Access type */}
          <PreviewLine
            icon={
              isFree
                ? Gift
                : WalletCards
            }
          >
            {isFree
              ? "Free access"
              : "Paid access"}
          </PreviewLine>

          {/* Delivery */}
          <PreviewLine
            icon={DeliveryIcon}
          >
            {selectedDeliveryMethod?.label ??
              "Delivery not selected"}
          </PreviewLine>

          {/* Package */}
          <PreviewLine
            icon={PackageCheck}
          >
            {values.packageOptions
              .map(
                (value) =>
                  packageOptions.find(
                    (option) =>
                      option.value ===
                      value,
                  )?.label,
              )
              .filter(Boolean)
              .join(", ")}
          </PreviewLine>

          {/* License */}
          <PreviewLine
            icon={ShieldCheck}
          >
            {selectedLicense?.label}
          </PreviewLine>

          {/* Included files/assets */}
          <PreviewLine icon={Code2}>
            {values.includedAssets
              .map(
                (value) =>
                  includedAssetOptions.find(
                    (option) =>
                      option.value ===
                      value,
                  )?.label,
              )
              .filter(Boolean)
              .join(", ")}
          </PreviewLine>

          {/* Support */}
          <PreviewLine
            icon={CheckCircle2}
          >
            {values.supportDurationDays ===
            0
              ? "No seller support"
              : `${
                  values.supportDurationDays
                } day${
                  values.supportDurationDays ===
                  1
                    ? ""
                    : "s"
                } support`}
          </PreviewLine>
        </div>

        {/* Free project explanation */}
        {isFree && (
          <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold text-primary">
              Free project
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Users will be able to
              access this project without
              payment after it is
              approved.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function PreviewLine({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-2 text-muted-foreground">
      <Icon
        aria-hidden="true"
        className="mt-0.5 size-3.5 shrink-0 text-primary"
      />

      <span className="leading-5">
        {children || "Not selected"}
      </span>
    </div>
  );
}