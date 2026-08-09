import type { ReactNode } from "react";
import { Archive, ImagePlus, LockKeyhole, UploadCloud } from "lucide-react";

import {
  difficultyOptions,
  includedAssetOptions,
  licenseOptions,
  maxArchiveFileSize,
  maxMediaFileSize,
  maxScreenshotCount,
  packageOptions,
  type SellerCategory,
  type SellerProjectInitialData,
  type SellerProjectInput,
} from "@/data/seller-project";
import { formatBdt } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProjectFormStepProps = {
  archiveFile: File | null;
  categories: SellerCategory[];
  coverFile: File | null;
  initialData?: SellerProjectInitialData;
  onArchiveChange: (file: File | null) => void;
  onCoverChange: (file: File | null) => void;
  onScreenshotsChange: (files: File[]) => void;
  onValueChange: <Key extends keyof SellerProjectInput>(
    key: Key,
    value: SellerProjectInput[Key],
  ) => void;
  screenshotFiles: File[];
  step: number;
  values: SellerProjectInput;
};

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background/65 px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30 dark:border-white/10 dark:bg-white/[0.045]";
const textareaClass =
  "w-full resize-y rounded-lg border border-input bg-background/65 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 dark:border-white/10 dark:bg-white/[0.045]";

export function ProjectFormStep(props: ProjectFormStepProps) {
  const { step, values, onValueChange } = props;

  if (step === 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField className="sm:col-span-2" label="Project title">
          <input
            className={inputClass}
            maxLength={160}
            onChange={(event) => onValueChange("title", event.target.value)}
            placeholder="e.g. Smart Campus Energy Monitor"
            value={values.title}
          />
        </FormField>
        <FormField className="sm:col-span-2" label="Description">
          <textarea
            className={cn(textareaClass, "min-h-36")}
            maxLength={20000}
            onChange={(event) => onValueChange("description", event.target.value)}
            placeholder="Explain the problem, solution, main capabilities, and intended use."
            value={values.description}
          />
        </FormField>
        <FormField label="Category">
          <select
            className={inputClass}
            onChange={(event) => onValueChange("categoryId", event.target.value)}
            value={values.categoryId}
          >
            <option value="">Select category</option>
            {props.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Department">
          <input
            className={inputClass}
            maxLength={80}
            onChange={(event) => onValueChange("department", event.target.value)}
            placeholder="CSE, EEE, Architecture…"
            value={values.department}
          />
        </FormField>
        <FormField className="sm:col-span-2" label="Difficulty">
          <div className="grid gap-2 sm:grid-cols-3">
            {difficultyOptions.map((option) => (
              <button
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  values.difficulty === option.value
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/70 bg-background/45 text-muted-foreground hover:text-foreground dark:border-white/10",
                )}
                key={option.value}
                onClick={() => onValueChange("difficulty", option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-5">
        <FormField
          hint="Separate technologies with commas. Add up to 12."
          label="Technology stack"
        >
          <input
            className={inputClass}
            onChange={(event) =>
              onValueChange(
                "technologyTags",
                event.target.value.split(",").map((tag) => tag.trimStart()),
              )
            }
            placeholder="Next.js, TypeScript, PostgreSQL"
            value={values.technologyTags.join(",")}
          />
        </FormField>
        <FormField
          hint="Mention required software, hardware, accounts, or operating systems."
          label="Requirements"
        >
          <textarea
            className={cn(textareaClass, "min-h-40")}
            maxLength={4000}
            onChange={(event) => onValueChange("requirements", event.target.value)}
            placeholder="Node.js 22+, PostgreSQL, 8 GB RAM…"
            value={values.requirements}
          />
        </FormField>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField hint="Displayed in BDT (৳)." label="Base price">
            <input
              className={inputClass}
              min={0}
              onChange={(event) =>
                onValueChange("basePriceBdt", Number(event.target.value))
              }
              type="number"
              value={values.basePriceBdt}
            />
          </FormField>
          <FormField label="Support duration (days)">
            <input
              className={inputClass}
              max={365}
              min={0}
              onChange={(event) =>
                onValueChange("supportDurationDays", Number(event.target.value))
              }
              type="number"
              value={values.supportDurationDays}
            />
          </FormField>
        </div>

        <FormField label="Package options">
          <div className="grid gap-3 lg:grid-cols-3">
            {packageOptions.map((option) => {
              const selected = values.packageOptions.includes(option.value);
              return (
                <label
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition-colors",
                    selected
                      ? "border-primary/40 bg-primary/8"
                      : "border-border/70 bg-background/40 dark:border-white/10",
                  )}
                  key={option.value}
                >
                  <span className="flex items-start gap-3">
                    <input
                      checked={selected}
                      className="mt-1 size-4 accent-primary"
                      onChange={() =>
                        onValueChange(
                          "packageOptions",
                          selected
                            ? values.packageOptions.filter(
                                (item) => item !== option.value,
                              )
                            : [...values.packageOptions, option.value],
                        )
                      }
                      type="checkbox"
                    />
                    <span>
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </span>
                      <span className="mt-2 block text-xs font-semibold text-primary">
                        {formatBdt(Math.round(values.basePriceBdt * option.multiplier))}
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </FormField>

        <FormField label="License type">
          <select
            className={inputClass}
            onChange={(event) =>
              onValueChange(
                "licenseType",
                event.target.value as SellerProjectInput["licenseType"],
              )
            }
            value={values.licenseType}
          >
            {licenseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div>
        <p className="mb-4 text-sm leading-6 text-muted-foreground">
          Select everything buyers will receive. Only include assets you own or can
          legally distribute.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {includedAssetOptions.map((option) => {
            const selected = values.includedAssets.includes(option.value);
            return (
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors",
                  selected
                    ? "border-primary/40 bg-primary/8 text-foreground"
                    : "border-border/70 bg-background/40 text-muted-foreground dark:border-white/10",
                )}
                key={option.value}
              >
                <input
                  checked={selected}
                  className="size-4 accent-primary"
                  onChange={() =>
                    onValueChange(
                      "includedAssets",
                      selected
                        ? values.includedAssets.filter((item) => item !== option.value)
                        : [...values.includedAssets, option.value],
                    )
                  }
                  type="checkbox"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="space-y-5">
        <UploadField
          accept="image/jpeg,image/png,image/webp"
          description={`JPG, PNG, or WebP. Maximum ${maxMediaFileSize / 1024 / 1024} MB.`}
          icon={<ImagePlus aria-hidden="true" className="size-5" />}
          label="Cover image"
          multiple={false}
          onChange={(files) => props.onCoverChange(files[0] ?? null)}
          selected={
            props.coverFile?.name ??
            (props.initialData?.hasCover ? "Existing cover will be kept" : null)
          }
        />
        <UploadField
          accept="image/jpeg,image/png,image/webp"
          description={`Up to ${maxScreenshotCount} images, ${maxMediaFileSize / 1024 / 1024} MB each.`}
          icon={<UploadCloud aria-hidden="true" className="size-5" />}
          label="Screenshots"
          multiple
          onChange={props.onScreenshotsChange}
          selected={
            props.screenshotFiles.length > 0
              ? `${props.screenshotFiles.length} screenshot${props.screenshotFiles.length === 1 ? "" : "s"} selected`
              : null
          }
        />
        <FormField hint="Only http and https links are accepted." label="Demo URL (optional)">
          <input
            className={inputClass}
            onChange={(event) => onValueChange("demoUrl", event.target.value)}
            placeholder="https://demo.example.com"
            type="url"
            value={values.demoUrl}
          />
        </FormField>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="space-y-5">
        <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 p-4 text-sm leading-6">
          <LockKeyhole aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <p>
            Project archives are uploaded to a private bucket. They are never
            exposed through public URLs in this phase.
          </p>
        </div>
        <UploadField
          accept=".zip,.tar,.gz,.7z,application/zip,application/x-zip-compressed,application/x-tar,application/gzip,application/x-gzip,application/x-7z-compressed"
          description={`ZIP, TAR, GZ, or 7Z. Maximum ${maxArchiveFileSize / 1024 / 1024} MB.`}
          icon={<Archive aria-hidden="true" className="size-5" />}
          label="Private project archive"
          multiple={false}
          onChange={(files) => props.onArchiveChange(files[0] ?? null)}
          selected={
            props.archiveFile?.name ??
            props.initialData?.archiveName ??
            (props.initialData?.hasArchive ? "Existing archive will be kept" : null)
          }
        />
      </div>
    );
  }

  return null;
}

function FormField({
  children,
  className,
  hint,
  label,
}: {
  children: ReactNode;
  className?: string;
  hint?: string;
  label: string;
}) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function UploadField({
  accept,
  description,
  icon,
  label,
  multiple,
  onChange,
  selected,
}: {
  accept: string;
  description: string;
  icon: ReactNode;
  label: string;
  multiple: boolean;
  onChange: (files: File[]) => void;
  selected: string | null;
}) {
  return (
    <label className="block cursor-pointer rounded-xl border border-dashed border-border bg-background/40 p-5 transition-colors hover:border-primary/40 dark:border-white/12">
      <input
        accept={accept}
        className="sr-only"
        multiple={multiple}
        onChange={(event) => onChange(Array.from(event.target.files ?? []))}
        type="file"
      />
      <span className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <span>
          <span className="block text-sm font-semibold">{label}</span>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {description}
          </span>
          {selected && (
            <span className="mt-2 block text-xs font-semibold text-primary">
              {selected}
            </span>
          )}
        </span>
      </span>
    </label>
  );
}
