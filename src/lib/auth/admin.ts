import "server-only";

import { redirect } from "next/navigation";

import { isAdminRole } from "@/lib/auth/admin-role";
import { getAuthContext, type AuthContext } from "@/lib/auth/session";

export async function getAdminAuth(): Promise<AuthContext | null> {
  const auth = await getAuthContext();

  return auth && isAdminRole(auth.profile?.role) ? auth : null;
}

export async function requireAdmin(nextPath = "/admin") {
  const auth = await getAuthContext();

  if (!auth) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  if (!isAdminRole(auth.profile?.role)) {
    redirect("/dashboard");
  }

  return auth;
}
