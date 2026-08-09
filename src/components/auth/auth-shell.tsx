import type { ReactNode } from "react";
import { GraduationCap, ShieldCheck, Store } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const highlights = [
  { icon: Store, label: "Student-built marketplace" },
  { icon: GraduationCap, label: "Learning-first community" },
  { icon: ShieldCheck, label: "Responsible academic use" },
] as const;

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_30%),radial-gradient(circle_at_85%_80%,color-mix(in_oklch,var(--chart-3)_10%,transparent),transparent_28%)]" />
      <div className="relative mx-auto grid min-h-svh max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden border-r bg-card/55 p-12 lg:flex lg:flex-col lg:justify-between">
          <BrandMark href="/" name="CampusStall" />
          <div className="max-w-md">
            <p className="text-sm font-semibold text-primary">
              Built on campus. Made for students.
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.05em] text-balance">
              Build, learn, and collaborate with your campus community.
            </h1>
            <div className="mt-8 space-y-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    className="flex items-center gap-3 rounded-xl border bg-background/70 p-3 text-sm font-medium shadow-xs"
                    key={item.label}
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="max-w-md text-xs leading-5 text-muted-foreground">
            CampusStall supports legitimate reuse, tutoring, mentoring, and
            student-owned work—not plagiarism or dishonest submissions.
          </p>
        </section>

        <section className="flex min-h-svh flex-col px-4 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between lg:justify-end">
            <BrandMark className="lg:hidden" href="/" name="CampusStall" />
            <ThemeToggle />
          </div>
          <div className="mx-auto flex w-full max-w-lg flex-1 items-center py-10">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
