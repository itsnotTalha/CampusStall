import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  Bookmark,
  BriefcaseBusiness,
  Compass,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  NotebookPen,
  ReceiptText,
  ShoppingBag,
  WandSparkles,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "My Projects", href: "/sell/projects", icon: NotebookPen },
  {
    label: "Ready-Made Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  { label: "Hire Talent", href: "/talent", icon: BriefcaseBusiness },
  { label: "Project Help", href: "/project-help", icon: LifeBuoy },
  { label: "Digital Perks", href: "/perks", icon: BadgePercent },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Orders", href: "/orders", icon: ReceiptText },
  { label: "Purchases", href: "/purchases", icon: ShoppingBag },
  {
    label: "Customization",
    href: "/customization-requests",
    icon: WandSparkles,
  },
  { label: "Saved", href: "/saved", icon: Bookmark },
];
