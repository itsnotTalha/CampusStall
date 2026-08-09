import type { Metadata } from "next";

import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";
import { DigitalPerksBrowser } from "@/components/perks/digital-perks-browser";
import { getDigitalPerks } from "@/lib/digital-perks/queries";

export const metadata: Metadata = {
  title: "Digital Perks",
  description:
    "Browse legitimate student education plans, licenses, discounts, and official resource links on CampusStall.",
};

export default async function DigitalPerksPage() {
  const perks = await getDigitalPerks();

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader variant="compact" />
      <main>
        <DigitalPerksBrowser perks={perks} />
      </main>
      <PublicFooter variant="compact" />
    </div>
  );
}
