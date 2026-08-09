"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

import {
  type MarketplaceFilterState,
  MarketplaceFilters,
} from "@/components/explore/marketplace-filters";
import { PerkCard } from "@/components/marketplace/perk-card";
import { ProjectCard } from "@/components/marketplace/project-card";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { digitalPerks } from "@/data/landing";
import {
  type MarketplaceProject,
  type MarketplaceService,
  marketplaceProjects,
  marketplaceServices,
} from "@/data/marketplace";
import { cn } from "@/lib/utils";

export type MarketplaceType = "all" | "projects" | "services" | "perks";
type SortOption =
  | "recommended"
  | "popular"
  | "newest"
  | "price-asc"
  | "price-desc";

type SortableListing = {
  rating: number;
  popularity: number;
  createdAt: string;
};

const marketplaceTypes: { label: string; value: MarketplaceType }[] = [
  { label: "All", value: "all" },
  { label: "Ready-Made Projects", value: "projects" },
  { label: "Services", value: "services" },
  { label: "Digital Perks", value: "perks" },
];

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price low-high", value: "price-asc" },
  { label: "Price high-low", value: "price-desc" },
];

const initialFilters: MarketplaceFilterState = {
  category: "",
  department: "",
  difficulty: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  techStack: "",
};

type ExploreMarketplaceProps = {
  initialCategory?: string;
  initialQuery?: string;
  initialType?: MarketplaceType;
};

export function ExploreMarketplace({
  initialCategory = "",
  initialQuery = "",
  initialType = "all",
}: ExploreMarketplaceProps) {
  const [query, setQuery] = useState(initialQuery);
  const [marketplaceType, setMarketplaceType] =
    useState<MarketplaceType>(initialType);
  const [filters, setFilters] = useState<MarketplaceFilterState>({
    ...initialFilters,
    category: initialCategory,
  });
  const [sort, setSort] = useState<SortOption>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const hasListingFilters = Object.values(filters).some(Boolean);

  const projects = useMemo(() => {
    if (marketplaceType !== "all" && marketplaceType !== "projects") {
      return [];
    }

    const matches = marketplaceProjects.filter((project) => {
      return (
        matchesSearch(project, normalizedQuery) &&
        matchesSharedFilters(project, project.price, filters) &&
        (!filters.difficulty || project.difficulty === filters.difficulty)
      );
    });

    return sortListings(matches, sort, (project) => project.price);
  }, [filters, marketplaceType, normalizedQuery, sort]);

  const services = useMemo(() => {
    if (
      (marketplaceType !== "all" && marketplaceType !== "services") ||
      filters.difficulty
    ) {
      return [];
    }

    const matches = marketplaceServices.filter((service) =>
      matchesSearch(service, normalizedQuery) &&
      matchesSharedFilters(service, service.startingPrice, filters),
    );

    return sortListings(matches, sort, (service) => service.startingPrice);
  }, [filters, marketplaceType, normalizedQuery, sort]);

  const perks = useMemo(() => {
    if (
      (marketplaceType !== "all" && marketplaceType !== "perks") ||
      hasListingFilters
    ) {
      return [];
    }

    return digitalPerks.filter((perk) => {
      if (!normalizedQuery) return true;

      return `${perk.title} ${perk.description}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [hasListingFilters, marketplaceType, normalizedQuery]);

  const resultCount = projects.length + services.length + perks.length;

  function updateFilter(field: keyof MarketplaceFilterState, value: string) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  function selectMarketplaceType(type: MarketplaceType) {
    setMarketplaceType(type);

    if (type === "perks") {
      setFilters(initialFilters);
    } else if (type === "services" && filters.difficulty) {
      setFilters((current) => ({ ...current, difficulty: "" }));
    }
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-[8%] -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-72 right-[4%] -z-10 size-80 rounded-full bg-violet-500/8 blur-3xl" />

      <div className="border-b bg-card/60 backdrop-blur-xl dark:bg-background/55">
        <div className="mx-auto w-full max-w-[90rem] px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="shrink-0 xl:w-48">
              <h1 className="font-sans text-lg font-semibold tracking-[-0.025em] text-foreground dark:text-slate-100">
                Explore marketplace
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Projects, services, and perks
              </p>
            </div>

            <div className="relative min-w-0 flex-1 rounded-lg border border-border/80 bg-background/75 shadow-sm backdrop-blur-xl transition-colors focus-within:border-primary/45 dark:border-white/10 dark:bg-white/[0.035]">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search marketplace listings"
                className="h-9 border-0 bg-transparent pr-11 pl-9 text-sm shadow-none focus-visible:ring-0 sm:pr-24 dark:bg-transparent"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, services, or technology"
                ref={searchInputRef}
                type="search"
                value={query}
              />
              {query && (
                <button
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:right-14"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              )}
              <span className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center rounded border border-border/70 bg-card/70 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-muted-foreground sm:inline-flex dark:border-white/10 dark:bg-white/[0.06]">
                ⌘ K
              </span>
            </div>

            <div
              aria-label="Marketplace type"
              className="flex max-w-full gap-0.5 overflow-x-auto rounded-lg bg-muted/55 p-0.5 xl:shrink-0 dark:bg-white/[0.045]"
              role="group"
            >
              {marketplaceTypes.map((type) => (
                <button
                  aria-pressed={marketplaceType === type.value}
                  className={cn(
                    "h-8 shrink-0 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                    marketplaceType === type.value &&
                      "bg-card text-foreground shadow-sm dark:bg-white/10",
                  )}
                  key={type.value}
                  onClick={() => selectMarketplaceType(type.value)}
                  type="button"
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">
              {resultCount} demo {resultCount === 1 ? "result" : "results"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Local sample data for the CampusStall marketplace preview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="gap-2 lg:hidden"
              onClick={() => setFiltersOpen((current) => !current)}
              type="button"
              variant="outline"
            >
              <Filter aria-hidden="true" className="size-4" />
              Filters
            </Button>
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              <span className="sr-only sm:not-sr-only">Sort</span>
              <select
                aria-label="Sort listings"
                className="h-9 rounded-lg border border-input bg-card/70 px-2.5 text-sm text-foreground shadow-sm outline-none backdrop-blur-xl focus:border-ring focus:ring-3 focus:ring-ring/30 dark:border-white/10 dark:bg-white/[0.045]"
                onChange={(event) => setSort(event.target.value as SortOption)}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside
            className={cn(
              "lg:sticky lg:top-24 lg:block",
              filtersOpen ? "block" : "hidden",
            )}
          >
            <MarketplaceFilters
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          </aside>

          <div className="min-w-0 space-y-10">
            {projects.length > 0 && (
              <ListingSection
                description="Owned or distributable student projects with clear demo details."
                title="Ready-Made Projects"
              >
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </ListingSection>
            )}

            {services.length > 0 && (
              <ListingSection
                description="Focused technical, design, tutoring, and consultation support."
                title="Services"
              >
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </ListingSection>
            )}

            {perks.length > 0 && (
              <ListingSection
                description="Legitimate student offers and resource categories. Eligibility may vary."
                title="Digital Perks"
              >
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {perks.map((perk) => (
                    <PerkCard key={perk.title} perk={perk} />
                  ))}
                </div>
              </ListingSection>
            )}

            {resultCount === 0 && (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/65 px-6 text-center shadow-lg shadow-foreground/3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
                <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Search aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-4 font-heading text-lg font-semibold">
                  No demo listings match
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Try a broader search or reset the filters to see more of the
                  marketplace.
                </p>
                <Button className="mt-5" onClick={resetFilters} variant="outline">
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function matchesSearch(
  listing: MarketplaceProject | MarketplaceService,
  query: string,
) {
  if (!query) return true;

  return [
    listing.title,
    listing.seller.name,
    listing.category,
    listing.department,
    listing.summary,
    ...listing.technologies,
  ].some((value) => value.toLowerCase().includes(query));
}

function matchesSharedFilters(
  listing: MarketplaceProject | MarketplaceService,
  price: number,
  filters: MarketplaceFilterState,
) {
  const minimumPrice = filters.minPrice ? Number(filters.minPrice) : 0;
  const maximumPrice = filters.maxPrice
    ? Number(filters.maxPrice)
    : Number.POSITIVE_INFINITY;
  const minimumRating = filters.minRating ? Number(filters.minRating) : 0;

  return (
    (!filters.category || listing.category === filters.category) &&
    (!filters.department || listing.department === filters.department) &&
    (!filters.techStack || listing.technologies.includes(filters.techStack)) &&
    price >= minimumPrice &&
    price <= maximumPrice &&
    listing.rating >= minimumRating
  );
}

function sortListings<T extends SortableListing>(
  listings: T[],
  sort: SortOption,
  getPrice: (listing: T) => number,
) {
  const sorted = [...listings];

  switch (sort) {
    case "popular":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "newest":
      return sorted.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      );
    case "price-asc":
      return sorted.sort((a, b) => getPrice(a) - getPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getPrice(b) - getPrice(a));
    case "recommended":
    default:
      return sorted.sort(
        (a, b) =>
          b.rating * 20 + b.popularity - (a.rating * 20 + a.popularity),
      );
  }
}
