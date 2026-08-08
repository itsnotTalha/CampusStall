import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { placeholderUser } from "@/data/placeholder-user";

export function UserProfile() {
  return (
    <button
      aria-label="Open profile menu"
      className="flex w-full items-center gap-3 rounded-lg p-2 text-left outline-none transition-colors hover:bg-sidebar-accent/70 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      type="button"
    >
      <Avatar className="bg-primary/8" size="lg">
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {placeholderUser.initials}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">
          {placeholderUser.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {placeholderUser.role}
        </span>
      </span>
      <ChevronsUpDown
        aria-hidden="true"
        className="size-4 text-muted-foreground"
      />
    </button>
  );
}
