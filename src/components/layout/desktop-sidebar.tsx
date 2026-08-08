import { BrandMark } from "@/components/brand/brand-mark";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { SidebarFooter } from "@/components/layout/sidebar-footer";

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-[4.5rem] items-center border-b border-sidebar-border px-5">
        <BrandMark />
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-3 py-5">
        <p className="mb-2 px-3 text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground/80 uppercase">
          Marketplace
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavigationLinks />
        </div>
        <div className="border-t border-sidebar-border pt-4">
          <SidebarFooter />
        </div>
      </div>
    </aside>
  );
}
