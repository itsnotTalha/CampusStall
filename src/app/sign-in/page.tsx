import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSafeNextPath } from "@/lib/auth/redirect";
import { getAuthContext } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };

type SignInPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    next?: string | string[];
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = getSafeNextPath(nextValue ?? null);
  const auth = await getAuthContext();

  if (auth) {
    redirect(nextPath);
  }

  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <AuthShell>
      <SignInForm externalError={error} nextPath={nextPath} />
    </AuthShell>
  );
}
