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

const mediaTabs: { id: MediaTab; label: string; icon: typeof Sparkles }[] = [
  { id: "preview", label: "Interactive preview", icon: Sparkles },
  { id: "screenshots", label: "Screenshots", icon: Images },
  { id: "demo", label: "Demo video", icon: MonitorPlay },
];

export function PreviewExperience({
  demoUrl,
  projectId,
  projectTitle,
  previewKind,
  screenshots,
  uploadedMedia,
}: PreviewExperienceProps) {
  const isLiveListing = uploadedMedia !== undefined;
  const tabs = mediaTabs.filter(
    (tab) => tab.id !== "demo" || !isLiveListing || Boolean(demoUrl),
  );
  const [activeTab, setActiveTab] = useState<MediaTab>("preview");
  const [activeScreenshotId, setActiveScreenshotId] = useState(
    screenshots[0]?.id ?? "",
  );
  const activeScreenshot =
    screenshots.find((item) => item.id === activeScreenshotId) ?? screenshots[0];
  const [activeMediaId, setActiveMediaId] = useState(
    uploadedMedia?.[0]?.id ?? "",
  );
  const activeMedia =
    uploadedMedia?.find((item) => item.id === activeMediaId) ?? uploadedMedia?.[0];

  return (
    <section aria-label="Project media" className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-2 border-b bg-muted/25 p-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                aria-pressed={activeTab === tab.id}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors",
                  activeTab === tab.id && "bg-card text-foreground shadow-xs",
                )}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 self-start pr-1 sm:self-auto">
          <span className="hidden text-[10px] font-medium text-muted-foreground sm:flex">
            {isLiveListing ? "Seller-uploaded preview media" : "Safe simulated media"}
          </span>
          <SendMessageButton className="size-9" projectId={projectId} />
        </div>
      </div>

      {activeTab === "preview" && (
        <div>
          {previewKind === "dashboard" && <DashboardPreview />}
          {previewKind === "machine-learning" && <MachineLearningPreview />}
          {previewKind === "generic" && (
            <GenericProjectPreview projectTitle={projectTitle} />
          )}
        </div>
      )}

      {activeTab === "screenshots" && uploadedMedia && uploadedMedia.length > 0 && activeMedia && (
        <div className="bg-muted/30 p-4 sm:p-6">
          <div className="overflow-hidden rounded-xl border bg-background">
            <img
              alt={activeMedia.altText}
              className="max-h-[38rem] min-h-72 w-full object-contain"
              src={activeMedia.url}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {uploadedMedia.map((item) => (
              <button
                aria-label={`Show ${item.title}`}
                aria-pressed={item.id === activeMedia.id}
                className={cn(
                  "overflow-hidden rounded-lg border bg-card p-1.5 text-left transition-colors",
                  item.id === activeMedia.id &&
                    "border-primary ring-2 ring-primary/10",
                )}
                key={item.id}
                onClick={() => setActiveMediaId(item.id)}
                type="button"
              >
                <img
                  alt=""
                  className="aspect-video w-full rounded-md object-cover"
                  loading="lazy"
                  src={item.url}
                />
                <p className="truncate px-1 pt-2 pb-1 text-[10px] font-semibold">
                  {item.title}
                </p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {activeMedia.kind === "cover" ? "Project cover" : "Seller screenshot"}
          </p>
        </div>
      )}

      {activeTab === "screenshots" &&
        (!uploadedMedia || uploadedMedia.length === 0) &&
        activeScreenshot && (
        <div className="bg-muted/30 p-4 sm:p-6">
          <div className="min-h-[22rem] sm:min-h-[30rem]">
            <ScreenshotMock layout={activeScreenshot.layout} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {screenshots.map((screenshot) => (
              <button
                aria-label={`Show ${screenshot.title}`}
                aria-pressed={screenshot.id === activeScreenshot.id}
                className={cn(
                  "rounded-lg border bg-card p-1.5 text-left transition-colors",
                  screenshot.id === activeScreenshot.id &&
                    "border-primary ring-2 ring-primary/10",
                )}
                key={screenshot.id}
                onClick={() => setActiveScreenshotId(screenshot.id)}
                type="button"
              >
                <div className="hidden sm:block">
                  <ScreenshotMock compact layout={screenshot.layout} />
                </div>
                <p className="truncate px-1 py-1 text-[10px] font-semibold sm:pt-2">
                  {screenshot.title}
                </p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {activeScreenshot.description}
          </p>
        </div>
        )}

      {activeTab === "demo" && demoUrl && (
        <div className="flex min-h-[30rem] items-center justify-center bg-slate-950 p-6 text-white">
          <div className="max-w-md text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
              <PlayCircle aria-hidden="true" className="size-7" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">Seller-hosted live demo</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Open the seller-provided demo in a separate tab. CampusStall does not
              embed or execute external content on this page.
            </p>
            <a
              className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
              href={demoUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Open live demo
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      )}

      {activeTab === "demo" && demoUrl === undefined && (
        <div className="flex min-h-[30rem] items-center justify-center bg-slate-950 p-6 text-white">
          <div className="max-w-md text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
              <PlayCircle aria-hidden="true" className="size-7" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">Demo video placeholder</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Seller-hosted demos can be added after trusted media validation is
              available. Untrusted URLs and iframes are not loaded here.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
