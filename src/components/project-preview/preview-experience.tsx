/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  ExternalLink,
  Images,
  MonitorPlay,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { SendMessageButton } from "@/components/marketplace/send-message-button";
import { DashboardPreview } from "@/components/project-preview/dashboard-preview";
import { GenericProjectPreview } from "@/components/project-preview/generic-project-preview";
import { MachineLearningPreview } from "@/components/project-preview/machine-learning-preview";
import { ScreenshotMock } from "@/components/project-preview/screenshot-mock";
import type {
  ProjectPreviewKind,
  ProjectPreviewMedia,
  ProjectScreenshot,
} from "@/data/project-details";
import { cn } from "@/lib/utils";

type MediaTab = "preview" | "screenshots" | "demo";

type PreviewExperienceProps = {
  demoUrl?: string | null;
  projectId?: string;
  projectTitle: string;
  previewKind: ProjectPreviewKind;
  screenshots: readonly ProjectScreenshot[];
  uploadedMedia?: readonly ProjectPreviewMedia[];
};

type MediaTabDefinition = {
  id: MediaTab;
  label: string;
  icon: typeof Sparkles;
};

const mockListingTabs: MediaTabDefinition[] = [
  {
    id: "preview",
    label: "Interactive preview",
    icon: Sparkles,
  },
  {
    id: "screenshots",
    label: "Screenshots",
    icon: Images,
  },
  {
    id: "demo",
    label: "Demo",
    icon: MonitorPlay,
  },
];

export function PreviewExperience({
  demoUrl,
  projectId,
  projectTitle,
  previewKind,
  screenshots,
  uploadedMedia,
}: PreviewExperienceProps) {
  /*
   * uploadedMedia === undefined means this is one of the built-in
   * CampusStall demo/mock listings.
   *
   * Any real database listing passes an array, even when that array
   * is empty. Real seller listings must never receive simulated
   * dashboard/ML/screenshots.
   */
  const isLiveListing =
    uploadedMedia !== undefined;

  const hasUploadedMedia =
    Boolean(
      uploadedMedia &&
        uploadedMedia.length > 0,
    );

  const hasDemo =
    Boolean(demoUrl);

  /*
   * Real listings expose only media the seller actually supplied.
   *
   * Mock listings keep the old simulated preview experience so the
   * static CampusStall showcase projects continue to work.
   */
  const tabs: MediaTabDefinition[] =
    isLiveListing
      ? [
          ...(hasUploadedMedia
            ? [
                {
                  id: "screenshots" as const,
                  label: "Project media",
                  icon: Images,
                },
              ]
            : []),
          ...(hasDemo
            ? [
                {
                  id: "demo" as const,
                  label: "Live demo",
                  icon: MonitorPlay,
                },
              ]
            : []),
          ...(!hasUploadedMedia && !hasDemo
            ? [
                {
                  id: "preview" as const,
                  label: "Preview",
                  icon: Images,
                },
              ]
            : []),
        ]
      : mockListingTabs;

  const initialTab: MediaTab =
    isLiveListing
      ? hasUploadedMedia
        ? "screenshots"
        : hasDemo
          ? "demo"
          : "preview"
      : "preview";

  const [activeTab, setActiveTab] =
    useState<MediaTab>(
      initialTab,
    );

  const [
    activeScreenshotId,
    setActiveScreenshotId,
  ] = useState(
    screenshots[0]?.id ?? "",
  );

  const activeScreenshot =
    screenshots.find(
      (item) =>
        item.id ===
        activeScreenshotId,
    ) ?? screenshots[0];

  const [
    activeMediaId,
    setActiveMediaId,
  ] = useState(
    uploadedMedia?.[0]?.id ??
      "",
  );

  const activeMedia =
    uploadedMedia?.find(
      (item) =>
        item.id === activeMediaId,
    ) ??
    uploadedMedia?.[0];

  return (
    <section
      aria-label="Project media"
      className="overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="flex flex-col gap-2 border-b bg-muted/25 p-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                aria-pressed={
                  activeTab === tab.id
                }
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors",
                  activeTab ===
                    tab.id &&
                    "bg-card text-foreground shadow-xs",
                )}
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id,
                  )
                }
                type="button"
              >
                <Icon
                  aria-hidden="true"
                  className="size-3.5"
                />

                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-start pr-1 sm:self-auto">
          <span className="hidden text-[10px] font-medium text-muted-foreground sm:flex">
            {isLiveListing
              ? hasUploadedMedia ||
                hasDemo
                ? "Seller-provided preview"
                : "No seller preview provided"
              : "Safe simulated media"}
          </span>

          <SendMessageButton
            className="size-9"
            projectId={projectId}
          />
        </div>
      </div>

      {/*
       * REAL DATABASE LISTING:
       * Never render simulated preview components.
       */}
      {isLiveListing &&
        activeTab === "preview" &&
        !hasUploadedMedia &&
        !hasDemo && (
          <div className="flex min-h-[26rem] items-center justify-center bg-muted/20 p-6">
            <div className="max-w-md text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-xs">
                <Images
                  aria-hidden="true"
                  className="size-6"
                />
              </span>

              <h3 className="mt-4 text-lg font-semibold">
                No preview provided
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The seller has not
                uploaded project
                screenshots or added a
                live demo for{" "}
                {projectTitle}.
              </p>
            </div>
          </div>
        )}

      {/*
       * MOCK / BUILT-IN SHOWCASE LISTING:
       * Keep CampusStall's simulated interactive previews.
       */}
      {!isLiveListing &&
        activeTab === "preview" && (
          <div>
            {previewKind ===
              "dashboard" && (
              <DashboardPreview />
            )}

            {previewKind ===
              "machine-learning" && (
              <MachineLearningPreview />
            )}

            {previewKind ===
              "generic" && (
              <GenericProjectPreview
                projectTitle={
                  projectTitle
                }
              />
            )}
          </div>
        )}

      {/*
       * REAL SELLER MEDIA
       */}
      {activeTab ===
        "screenshots" &&
        isLiveListing &&
        hasUploadedMedia &&
        activeMedia && (
          <div className="bg-muted/30 p-4 sm:p-6">
            <div className="overflow-hidden rounded-xl border bg-background">
              <img
                alt={
                  activeMedia.altText
                }
                className="max-h-[38rem] min-h-72 w-full object-contain"
                src={
                  activeMedia.url
                }
              />
            </div>

            {uploadedMedia.length >
              1 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {uploadedMedia.map(
                  (item) => (
                    <button
                      aria-label={`Show ${item.title}`}
                      aria-pressed={
                        item.id ===
                        activeMedia.id
                      }
                      className={cn(
                        "overflow-hidden rounded-lg border bg-card p-1.5 text-left transition-colors",
                        item.id ===
                          activeMedia.id &&
                          "border-primary ring-2 ring-primary/10",
                      )}
                      key={
                        item.id
                      }
                      onClick={() =>
                        setActiveMediaId(
                          item.id,
                        )
                      }
                      type="button"
                    >
                      <img
                        alt=""
                        className="aspect-video w-full rounded-md object-cover"
                        loading="lazy"
                        src={
                          item.url
                        }
                      />

                      <p className="truncate px-1 pt-2 pb-1 text-[10px] font-semibold">
                        {
                          item.title
                        }
                      </p>
                    </button>
                  ),
                )}
              </div>
            )}

            <p className="mt-3 text-xs text-muted-foreground">
              {activeMedia.kind ===
              "cover"
                ? "Project cover uploaded by the seller"
                : "Project screenshot uploaded by the seller"}
            </p>
          </div>
        )}

      {/*
       * MOCK LISTING SCREENSHOTS
       */}
      {activeTab ===
        "screenshots" &&
        !isLiveListing &&
        activeScreenshot && (
          <div className="bg-muted/30 p-4 sm:p-6">
            <div className="min-h-[22rem] sm:min-h-[30rem]">
              <ScreenshotMock
                layout={
                  activeScreenshot.layout
                }
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {screenshots.map(
                (screenshot) => (
                  <button
                    aria-label={`Show ${screenshot.title}`}
                    aria-pressed={
                      screenshot.id ===
                      activeScreenshot.id
                    }
                    className={cn(
                      "rounded-lg border bg-card p-1.5 text-left transition-colors",
                      screenshot.id ===
                        activeScreenshot.id &&
                        "border-primary ring-2 ring-primary/10",
                    )}
                    key={
                      screenshot.id
                    }
                    onClick={() =>
                      setActiveScreenshotId(
                        screenshot.id,
                      )
                    }
                    type="button"
                  >
                    <div className="hidden sm:block">
                      <ScreenshotMock
                        compact
                        layout={
                          screenshot.layout
                        }
                      />
                    </div>

                    <p className="truncate px-1 py-1 text-[10px] font-semibold sm:pt-2">
                      {
                        screenshot.title
                      }
                    </p>
                  </button>
                ),
              )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {
                activeScreenshot.description
              }
            </p>
          </div>
        )}

      {/*
       * SELLER-PROVIDED LIVE DEMO
       */}
      {activeTab === "demo" &&
        demoUrl && (
          <div className="flex min-h-[30rem] items-center justify-center bg-slate-950 p-6 text-white">
            <div className="max-w-md text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <PlayCircle
                  aria-hidden="true"
                  className="size-7"
                />
              </span>

              <h3 className="mt-5 text-lg font-semibold">
                Seller-hosted live
                demo
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Open the
                seller-provided demo
                in a separate tab.
                CampusStall does not
                embed or execute
                external content on
                this page.
              </p>

              <a
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                href={demoUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Open live demo

                <ExternalLink
                  aria-hidden="true"
                  className="size-4"
                />
              </a>
            </div>
          </div>
        )}

      {/*
       * MOCK LISTING DEMO PLACEHOLDER
       */}
      {!isLiveListing &&
        activeTab === "demo" &&
        !demoUrl && (
          <div className="flex min-h-[30rem] items-center justify-center bg-slate-950 p-6 text-white">
            <div className="max-w-md text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <PlayCircle
                  aria-hidden="true"
                  className="size-7"
                />
              </span>

              <h3 className="mt-5 text-lg font-semibold">
                Demo placeholder
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                This built-in
                CampusStall demo
                listing does not
                execute external
                content.
              </p>
            </div>
          </div>
        )}
    </section>
  );
}