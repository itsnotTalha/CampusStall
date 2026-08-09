"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavigationItem, navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

type NavigationLinksProps = {
  onNavigate?: () => void;
  showAdmin?: boolean;
};

export function NavigationLinks({
  onNavigate,
  showAdmin = false,
}: NavigationLinksProps) {
  const pathname = usePathname();
  const items = showAdmin
    ? [adminNavigationItem, ...navigationItems]
    : navigationItems;

  return (
    <nav aria-label="Primary navigation" className="space-y-1">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive &&
                "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--sidebar-border),transparent_25%)]",
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                "size-[1.125rem] shrink-0 transition-colors",
                isActive
                  ? "text-sidebar-primary"
                  : "text-muted-foreground/80 group-hover:text-sidebar-accent-foreground",
              )}
              strokeWidth={isActive ? 2.2 : 1.8}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
