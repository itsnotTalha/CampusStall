import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getAuthContext } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage() {
  const auth = await getAuthContext();

  if (auth) {
    redirect("/dashboard");
  }

  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  );
}
