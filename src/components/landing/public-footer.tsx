import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { PageContainer } from "@/components/layout/page-container";
import { footerGroups } from "@/data/landing";

export function PublicFooter({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <footer className="border-t bg-card/55 backdrop-blur-xl">
        <PageContainer className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark href="/" name="CampusStall" />
            <span className="hidden h-5 border-l sm:block" />
            <p className="text-xs text-muted-foreground">
              Built on campus. Made for students.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <Link className="transition-colors hover:text-foreground" href="/">
              Home
            </Link>
            <Link
              className="transition-colors hover:text-foreground"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <span>© {new Date().getFullYear()} CampusStall</span>
          </div>
        </PageContainer>
      </footer>
    );
  }

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
