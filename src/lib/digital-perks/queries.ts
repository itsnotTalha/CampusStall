import "server-only";

import {
  inferPerkCategory,
  officialDigitalPerks,
  prohibitedPerkTerms,
  type DigitalPerkListing,
} from "@/data/digital-perks";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getDigitalPerks(): Promise<DigitalPerkListing[]> {
  if (!isSupabaseConfigured()) return officialDigitalPerks;

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("digital_perks")
    .select(
      "id, category_id, title, provider_name, description, destination_url, eligibility, terms",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (!rows || rows.length === 0) return officialDigitalPerks;

  const categoryIds = [
    ...new Set(
      rows
        .map((row) => row.category_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const { data: categories } = categoryIds.length
    ? await supabase
        .from("categories")
        .select("id, name")
        .in("id", categoryIds)
    : { data: [] };
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const databasePerks = rows
    .filter(isSafePerk)
    .map((row) => {
      const category = inferPerkCategory(
        `${categoryNames.get(row.category_id ?? "") ?? ""} ${row.title} ${row.description}`,
      );

      return {
        category,
        description: row.description,
        destinationUrl: row.destination_url,
        eligibility: row.eligibility ?? "Review eligibility on the provider's official page.",
        id: row.id,
        offerLabel: "Verified catalog link",
        providerName: row.provider_name,
        terms: row.terms ?? "Provider terms and regional availability apply.",
        title: row.title,
      } satisfies DigitalPerkListing;
    });
  const existingDestinations = new Set(
    databasePerks.map((perk) => perk.destinationUrl.toLowerCase()),
  );

  return [
    ...databasePerks,
    ...officialDigitalPerks.filter(
      (perk) => !existingDestinations.has(perk.destinationUrl.toLowerCase()),
    ),
  ];
}

function isSafePerk(row: {
  description: string;
  destination_url: string;
  eligibility: string | null;
  provider_name: string;
  terms: string | null;
  title: string;
}) {
  const searchable = [
    row.title,
    row.provider_name,
    row.description,
    row.eligibility,
    row.terms,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    row.destination_url.startsWith("https://") &&
    prohibitedPerkTerms.every((term) => !searchable.includes(term))
  );
}
