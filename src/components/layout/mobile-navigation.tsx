"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { SidebarFooter } from "@/components/layout/sidebar-footer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button
            aria-label="Open navigation"
            className="lg:hidden"
            size="icon"
            variant="ghost"
          />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        className="w-[18rem] gap-0 bg-sidebar p-0 text-sidebar-foreground sm:max-w-[18rem]"
        side="left"
      >
        <SheetHeader className="border-b border-sidebar-border px-5 py-[1.15rem]">
          <SheetTitle className="sr-only">CampusStall navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate CampusStall marketplace areas.
          </SheetDescription>
          <BrandMark />
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col px-3 py-5">
          <p className="mb-2 px-3 text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground/80 uppercase">
            Marketplace
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <NavigationLinks onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-sidebar-border pt-4">
            <SidebarFooter />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
