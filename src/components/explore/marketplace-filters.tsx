import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  marketplaceCategories,
  marketplaceDepartments,
  marketplaceDifficulties,
  marketplaceTechStacks,
} from "@/data/marketplace";

export type MarketplaceFilterState = {
  category: string;
  department: string;
  difficulty: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  techStack: string;
};

type MarketplaceFiltersProps = {
  filters: MarketplaceFilterState;
  onChange: (field: keyof MarketplaceFilterState, value: string) => void;
  onReset: () => void;
};

const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-background/65 px-2.5 text-sm text-foreground outline-none backdrop-blur-md transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30 dark:border-white/10 dark:bg-white/[0.045]";

export function MarketplaceFilters({
  filters,
  onChange,
  onReset,
}: MarketplaceFiltersProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-lg shadow-foreground/3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/15">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold">Filters</h2>
        <Button
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
          onClick={onReset}
          size="sm"
          type="button"
          variant="ghost"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Reset
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        <FilterField label="Category">
          <select
            className={selectClassName}
            onChange={(event) => onChange("category", event.target.value)}
            value={filters.category}
          >
            <option value="">All categories</option>
            {marketplaceCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Department">
          <select
            className={selectClassName}
            onChange={(event) => onChange("department", event.target.value)}
            value={filters.department}
          >
            <option value="">All departments</option>
            {marketplaceDepartments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Difficulty">
          <select
            className={selectClassName}
            onChange={(event) => onChange("difficulty", event.target.value)}
            value={filters.difficulty}
          >
            <option value="">Any difficulty</option>
            {marketplaceDifficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Price range (BDT)">
          <div className="grid grid-cols-2 gap-2">
            <Input
              aria-label="Minimum price"
              inputMode="numeric"
              min="0"
              onChange={(event) => onChange("minPrice", event.target.value)}
              placeholder="Min"
              type="number"
              value={filters.minPrice}
            />
            <Input
              aria-label="Maximum price"
              inputMode="numeric"
              min="0"
              onChange={(event) => onChange("maxPrice", event.target.value)}
              placeholder="Max"
              type="number"
              value={filters.maxPrice}
            />
          </div>
        </FilterField>

        <FilterField label="Rating">
          <select
            className={selectClassName}
            onChange={(event) => onChange("minRating", event.target.value)}
            value={filters.minRating}
          >
            <option value="">Any rating</option>
            <option value="4.8">4.8 and above</option>
            <option value="4.5">4.5 and above</option>
            <option value="4">4.0 and above</option>
          </select>
        </FilterField>

        <FilterField label="Tech stack">
          <select
            className={selectClassName}
            onChange={(event) => onChange("techStack", event.target.value)}
            value={filters.techStack}
          >
            <option value="">Any technology</option>
            {marketplaceTechStacks.map((technology) => (
              <option key={technology} value={technology}>
                {technology}
              </option>
            ))}
          </select>
        </FilterField>
      </div>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
