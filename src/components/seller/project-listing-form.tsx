"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";

import {
  saveProjectDraftAction,
  submitProjectAction,
} from "@/app/(dashboard)/sell/project/actions";
import { ProjectFormStep } from "@/components/seller/project-form-step";
import { ProjectListingPreview } from "@/components/seller/project-listing-preview";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  archiveMimeTypes,
  archiveFileExtensions,
  maxArchiveFileSize,
  maxMediaFileSize,
  maxScreenshotCount,
  mediaMimeTypes,
  mediaFileExtensions,
  projectFormSteps,
  type SellerCategory,
  type SellerProjectInitialData,
  type SellerProjectInput,
  type UploadedArchive,
  type UploadedMedia,
} from "@/data/seller-project";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const defaultValues: SellerProjectInput = {
  basePriceBdt: 0,
  categoryId: "",
  demoUrl: "",
  department: "",
  description: "",
  difficulty: "intermediate",
  includedAssets: ["source_code"],
  licenseType: "learning_personal",
  packageOptions: ["source_only"],
  requirements: "",
  supportDurationDays: 7,
  technologyTags: [],
  title: "",
};

export function ProjectListingForm({
  categories,
  initialData,
}: {
  categories: SellerCategory[];
  initialData?: SellerProjectInitialData;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<SellerProjectInput>(
    initialData ?? defaultValues,
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const coverPreviewUrl = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : initialData?.coverUrl ?? null),
    [coverFile, initialData?.coverUrl],
  );

  useEffect(() => {
    return () => {
      if (coverFile && coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverFile, coverPreviewUrl]);

  function updateValue<Key extends keyof SellerProjectInput>(
    key: Key,
    value: SellerProjectInput[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function selectCover(file: File | null) {
    if (!file) {
      setCoverFile(null);
      return;
    }

    const fileError = validateMediaFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }

    setCoverFile(file);
    setError(null);
  }

  function selectScreenshots(files: File[]) {
    if (files.length > maxScreenshotCount) {
      setError(`Choose no more than ${maxScreenshotCount} screenshots.`);
      return;
    }

    const fileError = files.map(validateMediaFile).find(Boolean);
    if (fileError) {
      setError(fileError);
      return;
    }

    setScreenshotFiles(files);
    setError(null);
  }

  function selectArchive(file: File | null) {
    if (!file) {
      setArchiveFile(null);
      return;
    }

    const fileError = validateArchiveFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }

    setArchiveFile(file);
    setError(null);
  }

  function goForward() {
    const stepError = validateStep(step, values, {
      archiveFile,
      coverFile,
      initialData,
    });

    if (stepError) {
      setError(stepError);
      return;
    }

    setError(null);
    setStep((current) => Math.min(current + 1, projectFormSteps.length - 1));
  }

  async function submitProject() {
    for (let index = 0; index < projectFormSteps.length - 1; index += 1) {
      const stepError = validateStep(index, values, {
        archiveFile,
        coverFile,
        initialData,
      });
      if (stepError) {
        setStep(index);
        setError(stepError);
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    const draft = await saveProjectDraftAction(initialData?.id ?? null, values);
    if (!draft.ok) {
      setError(draft.error);
      setSubmitting(false);
      return;
    }

    const supabase = createClient();
    const newMedia: UploadedMedia[] = [];
    let newArchive: UploadedArchive | null = null;

    try {
      if (coverFile) {
        newMedia.push(
          await uploadMedia(supabase, draft.pathPrefix, coverFile, "cover"),
        );
      }

      for (const screenshot of screenshotFiles) {
        newMedia.push(
          await uploadMedia(
            supabase,
            draft.pathPrefix,
            screenshot,
            "screenshot",
          ),
        );
      }

      if (archiveFile) {
        newArchive = await uploadArchive(supabase, draft.pathPrefix, archiveFile);
      }
    } catch {
      await cleanupNewUploads(
        supabase,
        newMedia.map((item) => item.path),
        newArchive ? [newArchive.path] : [],
      );
      setError("A file upload failed. Check the file type and size, then try again.");
      setSubmitting(false);
      return;
    }

    const result = await submitProjectAction(
      draft.projectId,
      values,
      newMedia,
      newArchive,
    );

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push("/sell/projects?submitted=1");
    router.refresh();
  }

  const category = categories.find((item) => item.id === values.categoryId);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Project form progress">
        {projectFormSteps.map((label, index) => (
          <button
            aria-current={index === step ? "step" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
              index === step
                ? "bg-primary/10 text-primary"
                : index < step
                  ? "text-foreground"
                  : "text-muted-foreground",
            )}
            key={label}
            onClick={() => index <= step && setStep(index)}
            type="button"
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border text-[10px]",
                index <= step && "border-primary/30 bg-primary text-primary-foreground",
              )}
            >
              {index < step ? <Check aria-hidden="true" className="size-3" /> : index + 1}
            </span>
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-lg shadow-foreground/3 backdrop-blur-xl sm:p-7 dark:border-white/10 dark:bg-white/[0.045]">
        <div className="mb-6 border-b pb-5">
          <p className="text-xs font-semibold text-primary">
            Step {step + 1} of {projectFormSteps.length}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {projectFormSteps[step]}
          </h2>
        </div>

        {step < 6 ? (
          <ProjectFormStep
            archiveFile={archiveFile}
            categories={categories}
            coverFile={coverFile}
            initialData={initialData}
            onArchiveChange={selectArchive}
            onCoverChange={selectCover}
            onScreenshotsChange={selectScreenshots}
            onValueChange={updateValue}
            screenshotFiles={screenshotFiles}
            step={step}
            values={values}
          />
        ) : (
          <ProjectListingPreview
            category={category}
            coverUrl={coverPreviewUrl}
            values={values}
          />
        )}

        {error && (
          <p
            className="mt-5 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {step > 0 ? (
              <Button
                disabled={submitting}
                onClick={() => {
                  setError(null);
                  setStep((current) => current - 1);
                }}
                type="button"
                variant="outline"
              >
                <ArrowLeft aria-hidden="true" />
                Back
              </Button>
            ) : (
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href="/sell/projects"
              >
                Cancel
              </Link>
            )}
          </div>

          {step < projectFormSteps.length - 1 ? (
            <Button onClick={goForward} type="button">
              Continue
              <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button disabled={submitting} onClick={submitProject} type="button">
              {submitting ? (
                <>
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                  Uploading &amp; submitting…
                </>
              ) : (
                "Submit for review"
              )}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function validateStep(
  step: number,
  values: SellerProjectInput,
  files: {
    archiveFile: File | null;
    coverFile: File | null;
    initialData?: SellerProjectInitialData;
  },
) {
  if (step === 0) {
    if (values.title.trim().length < 5) return "Enter a project title of at least 5 characters.";
    if (values.description.trim().length < 20) {
      return "Describe the project in at least 20 characters.";
    }
    if (!values.categoryId || values.department.trim().length < 2) {
      return "Choose a category and enter your department.";
    }
  }

  if (step === 1) {
    const tags = values.technologyTags.map((tag) => tag.trim()).filter(Boolean);
    if (tags.length === 0 || tags.length > 12) return "Add between 1 and 12 technology tags.";
    if (tags.some((tag) => tag.length > 30)) return "Technology tags must be 30 characters or fewer.";
  }

  if (step === 2) {
    if (!Number.isInteger(values.basePriceBdt) || values.basePriceBdt < 0) {
      return "Enter a valid base price.";
    }
    if (values.packageOptions.length === 0) return "Select at least one package option.";
    if (values.supportDurationDays < 0 || values.supportDurationDays > 365) {
      return "Support duration must be between 0 and 365 days.";
    }
  }

  if (step === 3 && values.includedAssets.length === 0) {
    return "Select at least one included item.";
  }

  if (step === 4 && !files.coverFile && !files.initialData?.hasCover) {
    return "Add a cover image.";
  }

  if (step === 5 && !files.archiveFile && !files.initialData?.hasArchive) {
    return "Add the private project archive.";
  }

  return null;
}

function validateMediaFile(file: File) {
  if (!mediaMimeTypes.includes(file.type as (typeof mediaMimeTypes)[number])) {
    return "Preview images must be JPG, PNG, or WebP.";
  }
  const extension = file.name.split(".").pop()?.toLowerCase();
  const expectedExtension =
    mediaFileExtensions[file.type as keyof typeof mediaFileExtensions];
  if (
    !extension ||
    (file.type === "image/jpeg"
      ? !["jpg", "jpeg"].includes(extension)
      : extension !== expectedExtension)
  ) {
    return "The preview image extension does not match its file type.";
  }
  if (file.size < 1 || file.size > maxMediaFileSize) {
    return `Each preview image must be smaller than ${maxMediaFileSize / 1024 / 1024} MB.`;
  }
  return null;
}

function validateArchiveFile(file: File) {
  if (!archiveMimeTypes.includes(file.type as (typeof archiveMimeTypes)[number])) {
    return "Project archives must be ZIP, TAR, GZ, or 7Z files.";
  }
  const extension = file.name.split(".").pop()?.toLowerCase();
  const expectedExtension =
    archiveFileExtensions[file.type as keyof typeof archiveFileExtensions];
  if (extension !== expectedExtension) {
    return "The archive extension does not match its file type.";
  }
  if (file.size < 1 || file.size > maxArchiveFileSize) {
    return `The project archive must be smaller than ${maxArchiveFileSize / 1024 / 1024} MB.`;
  }
  return null;
}

async function uploadMedia(
  supabase: ReturnType<typeof createClient>,
  pathPrefix: string,
  file: File,
  kind: UploadedMedia["kind"],
): Promise<UploadedMedia> {
  const mimeType = file.type as keyof typeof mediaFileExtensions;
  const path = `${pathPrefix}/media/${crypto.randomUUID()}.${mediaFileExtensions[mimeType]}`;
  const { error } = await supabase.storage.from("project-media").upload(path, file, {
    cacheControl: "3600",
    contentType: mimeType,
    upsert: false,
  });

  if (error) throw error;
  return {
    kind,
    mimeType,
    originalName: file.name,
    path,
    sizeBytes: file.size,
  };
}

async function uploadArchive(
  supabase: ReturnType<typeof createClient>,
  pathPrefix: string,
  file: File,
): Promise<UploadedArchive> {
  const mimeType = file.type as keyof typeof archiveFileExtensions;
  const path = `${pathPrefix}/archive/${crypto.randomUUID()}.${archiveFileExtensions[mimeType]}`;
  const { error } = await supabase.storage
    .from("project-archives")
    .upload(path, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;
  return {
    mimeType,
    originalName: file.name,
    path,
    sizeBytes: file.size,
  };
}

async function cleanupNewUploads(
  supabase: ReturnType<typeof createClient>,
  mediaPaths: string[],
  archivePaths: string[],
) {
  await Promise.all([
    mediaPaths.length
      ? supabase.storage.from("project-media").remove(mediaPaths)
      : Promise.resolve(),
    archivePaths.length
      ? supabase.storage.from("project-archives").remove(archivePaths)
      : Promise.resolve(),
  ]);
}
