import type { ReactNode } from "react";

import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { PageContainer } from "@/components/layout/page-container";
import { TopHeader } from "@/components/layout/top-header";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-svh bg-background">
      <DesktopSidebar />
      <div className="min-h-svh lg:pl-72">
        <TopHeader />
        <main>
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
