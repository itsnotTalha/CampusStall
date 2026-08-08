"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

import { SaveButton } from "@/components/marketplace/save-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  type LicenseOption,
  licenseOptions,
  type PackageOption,
  packageOptions,
} from "@/data/project-details";
import { formatBdt } from "@/lib/format";
import { cn } from "@/lib/utils";

type PurchasePanelProps = {
  basePrice: number;
  commercialLicenseAvailable: boolean;
  projectId: string;
  projectTitle: string;
};

export function PurchasePanel({
  basePrice,
  commercialLicenseAvailable,
  projectId,
  projectTitle,
}: PurchasePanelProps) {
  const [selectedPackageId, setSelectedPackageId] =
    useState<PackageOption["id"]>("complete");
  const [selectedLicenseId, setSelectedLicenseId] =
    useState<LicenseOption["id"]>("personal");
  const selectedPackage =
    packageOptions.find((option) => option.id === selectedPackageId) ??
    packageOptions[1];
  const availableLicenses = commercialLicenseAvailable
    ? licenseOptions
    : licenseOptions.filter((license) => license.id !== "commercial");
  const selectedLicense =
    availableLicenses.find((license) => license.id === selectedLicenseId) ??
    availableLicenses[0];
  const displayedPrice = Math.round(
    basePrice * selectedPackage.multiplier * selectedLicense.multiplier,
  );

  return (
    <aside className="rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Selected price</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">
            {formatBdt(displayedPrice)}
          </p>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
          Demo pricing
        </span>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold">Choose a package</legend>
        <div className="mt-2 space-y-2">
          {packageOptions.map((option) => (
            <label
              className={cn(
                "block cursor-pointer rounded-lg border p-3 transition-colors",
                selectedPackageId === option.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/10"
                  : "hover:border-primary/25",
              )}
              key={option.id}
            >
              <input
                checked={selectedPackageId === option.id}
                className="sr-only"
                name="package"
                onChange={() => setSelectedPackageId(option.id)}
                type="radio"
                value={option.id}
              />
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{option.name}</span>
                <span className="text-xs font-semibold">
                  {formatBdt(Math.round(basePrice * option.multiplier))}
                </span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {option.description}
              </span>
              <span className="mt-2 block space-y-1">
                {option.highlights.map((highlight) => (
                  <span
                    className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
                    key={highlight}
                  >
                    <Check aria-hidden="true" className="size-3 text-primary" />
                    {highlight}
                  </span>
                ))}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold">License</legend>
        <div className="mt-2 space-y-2">
          {availableLicenses.map((license) => (
            <label
              className={cn(
                "flex cursor-pointer gap-2.5 rounded-lg border p-3 transition-colors",
                selectedLicense.id === license.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/25",
              )}
              key={license.id}
            >
              <input
                checked={selectedLicense.id === license.id}
                className="mt-0.5 accent-primary"
                name="license"
                onChange={() => setSelectedLicenseId(license.id)}
                type="radio"
                value={license.id}
              />
              <span>
                <span className="block text-xs font-semibold">{license.name}</span>
                <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">
                  {license.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 space-y-2">
        <Button aria-describedby="purchase-demo-note" className="h-11 w-full" type="button">
          Buy Project
        </Button>
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full gap-2",
          )}
          href={`/project-help?project=${projectId}`}
        >
          <Sparkles aria-hidden="true" className="size-4" />
          Request Customization
        </Link>
        <SaveButton
          className="bg-background"
          listingTitle={projectTitle}
          showLabel
        />
      </div>

      <p
        className="mt-3 text-center text-[10px] leading-4 text-muted-foreground"
        id="purchase-demo-note"
      >
        Purchasing is not connected in this preview.
      </p>
      <div className="mt-4 flex items-start gap-2 border-t pt-4 text-[10px] leading-4 text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Review package contents and license terms before a future purchase.
      </div>
    </aside>
  );
}
