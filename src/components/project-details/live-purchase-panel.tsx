"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

import { SaveButton } from "@/components/marketplace/save-button";
import { buttonVariants } from "@/components/ui/button";
import {
  humanizeAsset,
  licenseLabels,
  type PublicProjectPackage,
} from "@/data/orders";
import { formatBdt } from "@/lib/format";
import { cn } from "@/lib/utils";

export function LivePurchasePanel({
  packages,
  projectId,
  projectTitle,
}: {
  packages: PublicProjectPackage[];
  projectId: string;
  projectTitle: string;
}) {
  const [selectedId, setSelectedId] = useState(packages[0]?.id ?? "");
  const selected =
    packages.find((item) => item.id === selectedId) ?? packages[0];

  if (!selected) return null;

  return (
    <aside className="rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Selected price</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">
            {formatBdt(selected.priceBdt)}
          </p>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
          Demo payment
        </span>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold">Choose a package</legend>
        <div className="mt-2 space-y-2">
          {packages.map((item) => (
            <label
              className={cn(
                "block cursor-pointer rounded-lg border p-3 transition-colors",
                selected.id === item.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/10"
                  : "hover:border-primary/25",
              )}
              key={item.id}
            >
              <input
                checked={selected.id === item.id}
                className="sr-only"
                name="package"
                onChange={() => setSelectedId(item.id)}
                type="radio"
                value={item.id}
              />
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="text-xs font-semibold">
                  {formatBdt(item.priceBdt)}
                </span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {item.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 rounded-lg border bg-muted/25 p-3">
        <p className="text-xs font-semibold">{licenseLabels[selected.licenseType]}</p>
        <div className="mt-2 space-y-1">
          {selected.includedAssets.slice(0, 5).map((asset) => (
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground" key={asset}>
              <Check aria-hidden="true" className="size-3 text-primary" />
              {humanizeAsset(asset)}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Link
          className={cn(buttonVariants(), "h-11 w-full")}
          href={`/checkout/project/${selected.id}`}
        >
          Buy Project
        </Link>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full gap-2")}
          href={`/project-help?project=${projectId}`}
        >
          <Sparkles aria-hidden="true" />
          Request Customization
        </Link>
        <SaveButton className="bg-background" listingTitle={projectTitle} showLabel />
      </div>

      <div className="mt-4 flex items-start gap-2 border-t pt-4 text-[10px] leading-4 text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Demo checkout only. No real payment gateway is connected.
      </div>
    </aside>
  );
}
