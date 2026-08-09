import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AuthContext } from "@/lib/auth/session";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function UserProfile({ auth }: { auth: AuthContext }) {
  const name = auth.profile?.display_name ?? auth.email ?? "CampusStall student";
  const subtitle = auth.profile?.is_seller
    ? "Student seller"
    : auth.profile?.department ?? "Student account";

  return (
    <Link
      aria-label="Open profile settings"
      className="flex w-full items-center gap-3 rounded-lg p-2 text-left outline-none transition-colors hover:bg-sidebar-accent/70 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      href="/settings"
    >
      <Avatar className="bg-primary/8" size="lg">
        {auth.profile?.avatar_url && (
          <AvatarImage alt="" src={auth.profile.avatar_url} />
        )}
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">
          {name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {subtitle}
        </span>
      </span>
    </Link>
  );
}
