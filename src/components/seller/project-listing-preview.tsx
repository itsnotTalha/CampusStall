import { CheckCircle2, Code2, PackageCheck, ShieldCheck } from "lucide-react";

import {
  includedAssetOptions,
  licenseOptions,
  packageOptions,
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
    (option) => option.value === values.licenseType,
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_19rem]">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
        <div
          className="relative aspect-video overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(99,102,241,0.2),transparent_38%),linear-gradient(145deg,#0f172a,#08111f)] bg-cover bg-center"
          style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
        >
          <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[9px] font-semibold tracking-wide text-slate-100 uppercase backdrop-blur-md">
            Pending review
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold text-primary">
            {category?.name ?? "Project category"}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">
            {values.title || "Your project title"}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {values.description || "Your project description will appear here."}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {values.technologyTags.filter(Boolean).map((tag) => (
              <span
                className="rounded-md border bg-background/50 px-2 py-1 text-[11px] text-muted-foreground"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <aside className="rounded-xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
        <p className="text-xs text-muted-foreground">Base price</p>
        <p className="mt-1 text-2xl font-semibold">{formatBdt(values.basePriceBdt)}</p>
        <div className="mt-5 space-y-3 border-t pt-4 text-xs">
          <PreviewLine icon={PackageCheck}>
            {values.packageOptions
              .map(
                (value) => packageOptions.find((option) => option.value === value)?.label,
              )
              .filter(Boolean)
              .join(", ")}
          </PreviewLine>
          <PreviewLine icon={ShieldCheck}>{selectedLicense?.label}</PreviewLine>
          <PreviewLine icon={Code2}>
            {values.includedAssets
              .map(
                (value) =>
                  includedAssetOptions.find((option) => option.value === value)?.label,
              )
              .filter(Boolean)
              .join(", ")}
          </PreviewLine>
          <PreviewLine icon={CheckCircle2}>
            {values.supportDurationDays} days support
          </PreviewLine>
        </div>
      </aside>
    </div>
  );
}

function PreviewLine({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: typeof CheckCircle2;
}) {
  return (
    <div className="flex items-start gap-2 text-muted-foreground">
      <Icon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span className="leading-5">{children || "Not selected"}</span>
    </div>
  );
}
