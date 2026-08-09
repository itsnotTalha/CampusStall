import type { ReactNode } from "react";

import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { PageContainer } from "@/components/layout/page-container";
import { TopHeader } from "@/components/layout/top-header";
import type { AuthContext } from "@/lib/auth/session";

type DashboardShellProps = {
  auth: AuthContext;
  children: ReactNode;
};

export function DashboardShell({ auth, children }: DashboardShellProps) {
  return (
    <div className="min-h-svh bg-background">
      <DesktopSidebar auth={auth} />
      <div className="min-h-svh lg:pl-72">
        <TopHeader auth={auth} />
        <main>
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
