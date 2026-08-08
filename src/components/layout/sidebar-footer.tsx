import Link from "next/link";
import { CirclePlus, Settings } from "lucide-react";

import { UserProfile } from "@/components/layout/user-profile";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SidebarFooter() {
  return (
    <div className="space-y-2">
      <Link
        href="/sell"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-10 w-full justify-start gap-2.5 px-3 shadow-sm",
        )}
      >
        <CirclePlus aria-hidden="true" className="size-[1.125rem]" />
        Sell on CampusStall
      </Link>
      <Link
        href="/settings"
        className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        <Settings aria-hidden="true" className="size-[1.125rem]" />
        Settings
      </Link>
      <div className="my-3 border-t" />
      <UserProfile />
    </div>
  );
}
