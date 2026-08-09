"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck, X } from "lucide-react";

import { PerkCard } from "@/components/marketplace/perk-card";
import { Input } from "@/components/ui/input";
import {
  perkCategories,
  perkCategoryIcons,
  type DigitalPerkListing,
  type PerkCategory,
} from "@/data/digital-perks";
import { cn } from "@/lib/utils";

type CategoryFilter = "All" | PerkCategory;

export function DigitalPerksBrowser({
  perks,
}: {
  perks: DigitalPerkListing[];
}) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPerks = useMemo(
    () =>
      perks.filter((perk) => {
        const matchesCategory = category === "All" || perk.category === category;
        const matchesQuery =
          !normalizedQuery ||
          `${perk.title} ${perk.providerName} ${perk.description} ${perk.category}`
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      }),
    [category, normalizedQuery, perks],
  );

  return (
    <div>
      <div className="border-b bg-card/60 backdrop-blur-xl dark:bg-background/55">
        <div className="mx-auto w-full max-w-[90rem] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Student resources
              </p>
              <h1 className="mt-1 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Digital Perks
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Official education plans, discounts, licenses, and learning links.
                Eligibility and regional terms may vary.
              </p>
            </div>
            <div className="relative w-full max-w-md rounded-xl border border-border/70 bg-background/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search digital perks"
                className="h-10 border-0 bg-transparent pr-10 pl-9 shadow-none focus-visible:ring-0 dark:bg-transparent"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search providers or resources"
                type="search"
                value={query}
              />
              {query && (
                <button
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div
            aria-label="Digital perk categories"
            className="mt-5 flex gap-1 overflow-x-auto pb-1"
            role="group"
          >
            {(["All", ...perkCategories] as const).map((item) => (
              <button
                aria-pressed={category === item}
                className={cn(
                  "h-8 shrink-0 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  category === item &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                )}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/[0.045] p-4 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center">
          <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-primary" />
          <p>
            CampusStall links only to official provider pages. Never purchase or
            exchange shared accounts, usernames, passwords, or account credentials.
          </p>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">
            {filteredPerks.length} {filteredPerks.length === 1 ? "resource" : "resources"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Always confirm current provider terms
          </p>
        </div>

        {filteredPerks.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPerks.map((perk) => (
              <PerkCard
                key={perk.id}
                perk={{ ...perk, icon: perkCategoryIcons[perk.category] }}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card/55 px-6 text-center">
            <Search aria-hidden="true" className="size-5 text-muted-foreground" />
            <h2 className="mt-4 text-base font-semibold">No matching resources</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different category or broader search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
