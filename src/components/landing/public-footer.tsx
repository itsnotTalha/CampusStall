import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { PageContainer } from "@/components/layout/page-container";
import { footerGroups } from "@/data/landing";

export function PublicFooter() {
  return (
    <footer className="border-t bg-card">
      <PageContainer className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <BrandMark href="/" name="CampusStall" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Projects, skills, support, and legitimate student resources in one
              thoughtfully designed marketplace.
            </p>
            <p className="mt-5 text-xs font-medium text-primary">
              Built on campus. Made for students.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CampusStall. Student marketplace
            preview.
          </p>
          <p>No account, credential, or password sharing.</p>
        </div>
      </PageContainer>
    </footer>
  );
}
