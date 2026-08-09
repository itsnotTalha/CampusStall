import type { Metadata } from "next";

import {
  ExploreMarketplace,
  type MarketplaceType,
} from "@/components/explore/explore-marketplace";
import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";

export const metadata: Metadata = {
  title: "Explore marketplace",
  description:
    "Explore demo student projects, technical and design services, and legitimate digital perks on CampusStall.",
};

type ExplorePageProps = {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
    type?: string | string[];
  }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { category, q, type } = await searchParams;
  const initialCategory = Array.isArray(category) ? category[0] : category;
  const initialQuery = Array.isArray(q) ? q[0] : q;
  const requestedType = Array.isArray(type) ? type[0] : type;
  const validTypes: MarketplaceType[] = [
    "all",
    "projects",
    "services",
    "perks",
  ];
  const initialType = validTypes.includes(requestedType as MarketplaceType)
    ? (requestedType as MarketplaceType)
    : "all";

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader variant="compact" />
      <main>
        <ExploreMarketplace
          initialCategory={initialCategory}
          initialQuery={initialQuery}
          initialType={initialType}
        />
      </main>
      <PublicFooter variant="compact" />
    </div>
  );
}
