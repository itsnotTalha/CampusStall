import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import { ProfileForm } from "@/components/auth/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profile settings" };

export default async function SettingsPage() {
  const auth = await getAuthContext();

  if (!auth) {
    redirect("/sign-in?next=/settings");
  }

  if (!auth.profile) {
    return (
      <Card className="mx-auto max-w-3xl shadow-xs">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Your profile is still being prepared. Refresh this page in a moment.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="mb-1 text-sm font-medium text-primary">Account</p>
        <h1 className="font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          Profile settings
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Keep your student profile accurate for future marketplace activity.
        </p>
      </div>

      <Card className="shadow-xs">
        <CardHeader className="flex-row items-center gap-3 border-b pb-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
          <CardTitle>Public profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ProfileForm profile={auth.profile} />
        </CardContent>
      </Card>
    </div>
  );
}
