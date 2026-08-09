import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getAuthContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getAuthContext();

  if (!auth) {
    redirect("/sign-in?next=/dashboard");
  }

  return <DashboardShell auth={auth}>{children}</DashboardShell>;
}
