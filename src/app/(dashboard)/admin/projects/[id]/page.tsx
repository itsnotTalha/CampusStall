/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileArchive,
  Gift,
  GitBranch,
  GraduationCap,
  HardDrive,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

import { ModerationControls } from "@/components/admin/moderation-controls";
import { ProjectStatusBadge } from "@/components/admin/project-status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  humanizeAsset,
  licenseLabels,
} from "@/data/orders";
import { getAdminProject } from "@/lib/admin/projects";
import { databaseIdPattern } from "@/lib/database-id";
import {
  formatBdt,
  formatDate,
} from "@/lib/format";

export const metadata: Metadata = {
  title: "Review Project",
};

type ProjectReviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.ceil(
      bytes / 1024,
    )} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}

export default async function ProjectReviewPage({
  params,
}: ProjectReviewPageProps) {
  const { id } = await params;

  if (!databaseIdPattern.test(id)) {
    notFound();
  }

  const project =
    await getAdminProject(id);

  if (!project) {
    notFound();
  }

  const isFree =
    project.accessType === "free";

  const deliveryLabel =
    project.deliveryMethod ===
    "github"
      ? "GitHub repository"
      : project.deliveryMethod ===
          "google_drive"
        ? "Google Drive"
        : "Private project archive";

  const DeliveryIcon =
    project.deliveryMethod ===
    "github"
      ? GitBranch
      : project.deliveryMethod ===
          "google_drive"
        ? HardDrive
        : FileArchive;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back */}
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        href="/admin"
      >
        <ArrowLeft
          aria-hidden="true"
          className="size-4"
        />

        Back to moderation
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <ProjectStatusBadge
            status={project.status}
          />

          <span className="text-xs text-muted-foreground">
            Submitted{" "}
            {formatDate(
              project.createdAt,
            )}
          </span>

          <span
            className={
              isFree
                ? "rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
                : "rounded-full border bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground"
            }
          >
            {isFree
              ? "FREE"
              : "PAID"}
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary">
            {project.category}
          </p>

          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            {project.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {project.department} ·{" "}
            {project.difficulty} ·{" "}
            {isFree ? (
              <span className="font-semibold text-primary">
                Free project
              </span>
            ) : (
              <>
                Base price{" "}
                {formatBdt(
                  project.basePriceBdt,
                )}
              </>
            )}
          </p>
        </div>
      </header>

      {/* Moderation actions */}
      {project.status ===
        "pending" && (
        <ModerationControls
          projectId={project.id}
        />
      )}

      {/* Rejection */}
      {project.rejectionReason && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/8 p-4">
          <p className="text-sm font-semibold text-destructive">
            Rejection reason
          </p>

          <p className="mt-1 text-sm leading-6">
            {
              project.rejectionReason
            }
          </p>
        </div>
      )}

      {/* Access + delivery summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isFree ? (
                <Gift
                  aria-hidden="true"
                  className="size-4 text-primary"
                />
              ) : (
                <WalletCards
                  aria-hidden="true"
                  className="size-4 text-primary"
                />
              )}

              Project access
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-semibold">
              {isFree
                ? "Free"
                : "Paid"}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {isFree
                ? "Anyone can access this project without payment after approval."
                : `Users must purchase this project. Base price: ${formatBdt(
                    project.basePriceBdt,
                  )}.`}
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DeliveryIcon
                aria-hidden="true"
                className="size-4 text-primary"
              />

              Delivery method
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-semibold">
              {deliveryLabel}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {project.deliveryMethod ===
              "upload"
                ? "CampusStall will deliver the private uploaded archive."
                : "Users will be redirected to the seller-provided external project source after access is authorized."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          {/* Description */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                Project description
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <p className="whitespace-pre-wrap text-sm leading-7">
                {project.description}
              </p>

              {project.requirements && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold">
                    Requirements
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {
                      project.requirements
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tech + deliverables */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                Technology and
                deliverables
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Tech stack
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologyTags.map(
                    (tag) => (
                      <span
                        className="rounded-md bg-muted px-2.5 py-1 text-xs"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Included assets
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  {project.includedAssets.map(
                    (asset) => (
                      <span
                        className="rounded-md border px-2.5 py-1 text-xs"
                        key={asset}
                      >
                        {humanizeAsset(
                          asset,
                        )}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  License options
                </h3>

                <p className="mt-2 text-sm">
                  {project.licenseOptions
                    .map(
                      (license) =>
                        licenseLabels[
                          license
                        ],
                    )
                    .join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                Media previews
              </CardTitle>
            </CardHeader>

            <CardContent>
              {project.media.length >
              0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.media.map(
                    (item) => (
                      <figure
                        className="overflow-hidden rounded-xl border bg-muted"
                        key={item.id}
                      >
                        <img
                          alt={
                            item.altText
                          }
                          className="aspect-video w-full object-cover"
                          loading="lazy"
                          src={
                            item.url
                          }
                        />

                        <figcaption className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                          <span className="truncate">
                            {
                              item.title
                            }
                          </span>

                          <span className="shrink-0 text-muted-foreground">
                            {
                              item.kind
                            }
                          </span>
                        </figcaption>
                      </figure>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No preview media
                  attached.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Packages */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                {isFree
                  ? "Project package"
                  : "Packages and pricing"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {project.packages.length >
              0 ? (
                project.packages.map(
                  (item) => (
                    <div
                      className="rounded-xl border bg-background/50 p-4"
                      key={item.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">
                            {
                              item.name
                            }
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {
                              item.description
                            }
                          </p>
                        </div>

                        <p className="shrink-0 font-semibold">
                          {isFree
                            ? "FREE"
                            : formatBdt(
                                item.priceBdt,
                              )}
                        </p>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">
                        {
                          licenseLabels[
                            item
                              .licenseType
                          ]
                        }{" "}
                        ·{" "}
                        {
                          item.supportDurationDays
                        }{" "}
                        support days
                      </p>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  No packages
                  attached.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          {/* Seller */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound
                  aria-hidden="true"
                  className="size-4 text-primary"
                />

                Seller
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">
                {
                  project.seller
                    .displayName
                }

                {project.seller
                  .isVerified
                  ? " · Verified"
                  : ""}
              </p>

              <p className="text-muted-foreground">
                {[
                  project.seller
                    .department,
                  project.seller
                    .university,
                ]
                  .filter(Boolean)
                  .join(" · ") ||
                  "No institution details"}
              </p>

              {project.seller.bio && (
                <p className="pt-2 text-xs leading-5 text-muted-foreground">
                  {
                    project.seller
                      .bio
                  }
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upload delivery */}
          {project.deliveryMethod ===
            "upload" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileArchive
                    aria-hidden="true"
                    className="size-4 text-primary"
                  />

                  Private archive
                </CardTitle>
              </CardHeader>

              <CardContent>
                {project.archive ? (
                  <div className="space-y-1 text-sm">
                    <p className="break-all font-medium">
                      {
                        project
                          .archive
                          .filename
                      }
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatBytes(
                        project
                          .archive
                          .sizeBytes,
                      )}{" "}
                      ·{" "}
                      {
                        project
                          .archive
                          .mimeType
                      }
                    </p>

                    <p className="pt-2 text-xs leading-5 text-muted-foreground">
                      Metadata only. The
                      private archive is
                      not linked,
                      downloaded, or
                      executed during
                      moderation.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-destructive">
                    No archive metadata
                    found.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* GitHub / Drive delivery */}
          {project.deliveryMethod !==
            "upload" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DeliveryIcon
                    aria-hidden="true"
                    className="size-4 text-primary"
                  />

                  Delivery destination
                </CardTitle>
              </CardHeader>

              <CardContent>
                {project.externalDeliveryUrl ? (
                  <>
                    <a
                      className="inline-flex items-center gap-2 break-all text-sm font-medium text-primary hover:underline"
                      href={
                        project.externalDeliveryUrl
                      }
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Review{" "}
                      {deliveryLabel}

                      <ExternalLink
                        aria-hidden="true"
                        className="size-3.5 shrink-0"
                      />
                    </a>

                    <p className="mt-3 break-all text-xs leading-5 text-muted-foreground">
                      {
                        project.externalDeliveryUrl
                      }
                    </p>

                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      This link was
                      provided by the
                      seller. Review its
                      contents and sharing
                      permissions before
                      approving the
                      project.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-destructive">
                    No external delivery
                    URL found.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Demo URL */}
          {project.demoUrl && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  Demo URL
                </CardTitle>
              </CardHeader>

              <CardContent>
                <a
                  className="inline-flex items-center gap-2 break-all text-sm font-medium text-primary hover:underline"
                  href={
                    project.demoUrl
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open external demo

                  <ExternalLink
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                  />
                </a>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  External demos are
                  seller-provided.
                  Review them cautiously.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Ownership */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-4 text-primary"
                />

                Ownership declaration
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-xs leading-5 text-muted-foreground">
                No explicit ownership
                declaration is stored by
                the current seller
                workflow. Confirm
                authorship or
                distribution rights
                before approval.
              </p>
            </CardContent>
          </Card>

          {/* Academic notice */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap
                  aria-hidden="true"
                  className="size-4 text-primary"
                />

                Academic-use notice
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-xs leading-5 text-muted-foreground">
                Projects must be used
                for legitimate learning
                and in accordance with
                the buyer&apos;s
                institutional
                academic-integrity
                rules.
              </p>
            </CardContent>
          </Card>

          {/* Published status */}
          {project.status ===
            "published" && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2
                aria-hidden="true"
                className="size-4"
              />

              This project is public.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}