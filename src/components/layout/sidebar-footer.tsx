import Link from "next/link";
import { CirclePlus, LogOut, Settings } from "lucide-react";

import { UserProfile } from "@/components/layout/user-profile";
import { buttonVariants } from "@/components/ui/button";
import type { AuthContext } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export function SidebarFooter({ auth }: { auth: AuthContext }) {
  return (
    <div className="space-y-2">
      <Link
        href="/sell/project"
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
      <form action="/auth/sign-out" method="post">
        <button
          className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          type="submit"
        >
          <LogOut aria-hidden="true" className="size-[1.125rem]" />
          Sign out
        </button>
      </form>
      <div className="my-3 border-t" />
      <UserProfile auth={auth} />
    </div>
  );
}
