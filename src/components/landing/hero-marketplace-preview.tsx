import { Search } from "lucide-react";

import { featuredProjects, marketplaceAreas } from "@/data/landing";
import { formatBdt } from "@/lib/format";

export function HeroMarketplacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mr-0">
      <div className="absolute -inset-3 rounded-[1.4rem] border border-primary/10 bg-primary/4" />
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-[0_24px_70px_-34px_oklch(0.25_0.04_165_/_0.34)]">
        <div className="flex items-center gap-2 border-b bg-muted/35 px-4 py-3">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <div className="ml-2 flex h-8 flex-1 items-center gap-2 rounded-lg border bg-card px-3 text-xs text-muted-foreground shadow-xs">
            <Search aria-hidden="true" className="size-3.5" />
            Search CampusStall
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">
                Student marketplace
              </p>
              <p className="mt-1 text-sm font-semibold">Find what moves you forward</p>
            </div>
            <span className="rounded-md border bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground">
              Demo preview
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {marketplaceAreas.map((area) => {
              const Icon = area.icon;

              return (
                <div
                  className="rounded-lg border bg-background p-3 shadow-xs"
                  key={area.label}
                >
                  <Icon aria-hidden="true" className="size-4 text-primary" />
                  <p className="mt-3 text-[11px] leading-4 font-medium">
                    {area.label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2.5">
            {featuredProjects.slice(0, 2).map((project) => {
              const Icon = project.icon;

              return (
                <div
                  className="flex items-center gap-3 rounded-xl border bg-background p-3 shadow-xs"
                  key={project.id}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold sm:text-sm">
                      {project.title}
                    </span>
                    <span className="mt-1 block truncate text-[10px] text-muted-foreground sm:text-xs">
                      {project.technologies.join(" · ")}
                    </span>
                  </span>
                  <span className="text-xs font-semibold sm:text-sm">
                    {formatBdt(project.price)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute -right-2 -bottom-5 hidden items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-xs font-medium shadow-lg sm:flex">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          ✓
        </span>
        Built for responsible student work
      </div>
    </div>
  );
}
