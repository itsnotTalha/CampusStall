"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
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
import { digitalPerks, projectCategories } from "@/data/landing";
import {
  type MarketplaceProject,
  type MarketplaceService,
  marketplaceProjects,
  marketplaceServices,
} from "@/data/marketplace";
import { cn } from "@/lib/utils";

type MarketplaceType = "all" | "projects" | "services" | "perks";
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
};

export function ExploreMarketplace({
  initialCategory = "",
}: ExploreMarketplaceProps) {
  const [query, setQuery] = useState("");
  const [marketplaceType, setMarketplaceType] =
    useState<MarketplaceType>("all");
  const [filters, setFilters] = useState<MarketplaceFilterState>({
    ...initialFilters,
    category: initialCategory,
  });
  const [sort, setSort] = useState<SortOption>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    <div>
      <div className="border-b bg-card">
        <div className="mx-auto w-full max-w-[90rem] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Marketplace</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Explore student-built work and talent
            </h1>
            <p className="mt-3 leading-7 text-muted-foreground">
              Search demo projects, student services, and legitimate digital
              resources from one place.
            </p>
          </div>

          <div className="relative mt-8 max-w-3xl">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search marketplace listings"
              className="h-12 bg-background pr-11 pl-12 text-base shadow-sm"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, services, skills, or technology"
              type="search"
              value={query}
            />
            {query && (
              <button
                aria-label="Clear search"
                className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setQuery("")}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>

          <div
            aria-label="Marketplace type"
            className="mt-6 flex gap-2 overflow-x-auto pb-1"
            role="group"
          >
            {marketplaceTypes.map((type) => (
              <button
                aria-pressed={marketplaceType === type.value}
                className={cn(
                  "h-9 shrink-0 rounded-lg border bg-background px-3.5 text-sm font-medium text-muted-foreground shadow-xs transition-colors hover:text-foreground",
                  marketplaceType === type.value &&
                    "border-primary/20 bg-primary text-primary-foreground",
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

      <div className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-[90rem] gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          <button
            className={categoryPillClass(!filters.category)}
            onClick={() => updateFilter("category", "")}
            type="button"
          >
            All categories
          </button>
          {projectCategories.map((category) => (
            <button
              className={categoryPillClass(filters.category === category.name)}
              key={category.slug}
              onClick={() => updateFilter("category", category.name)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
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
                className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
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
              <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 text-center">
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

function categoryPillClass(active: boolean) {
  return cn(
    "h-8 shrink-0 rounded-full border bg-card px-3 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:text-foreground",
    active && "border-primary/20 bg-primary/10 text-primary",
  );
}
