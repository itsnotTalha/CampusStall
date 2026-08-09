import type { Metadata } from "next";

import { ExploreMarketplace } from "@/components/explore/explore-marketplace";
import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";

export const metadata: Metadata = {
  title: "Explore marketplace",
  description:
    "Explore demo student projects, technical and design services, and legitimate digital perks on CampusStall.",
};

type ExplorePageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { category } = await searchParams;
  const initialCategory = Array.isArray(category) ? category[0] : category;

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader variant="compact" />
      <main>
        <ExploreMarketplace initialCategory={initialCategory} />
      </main>
      <PublicFooter variant="compact" />
    </div>
  );
}
