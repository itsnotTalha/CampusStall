import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockKeyhole, UserRound } from "lucide-react";

import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { ProfileForm } from "@/components/auth/profile-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthContext } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Profile settings",
};

export default async function SettingsPage() {
  const auth = await getAuthContext();

  if (!auth) {
    redirect("/sign-in?next=/settings");
  }

  if (!auth.profile) {
    return (
      <p className="text-sm text-muted-foreground">
        Your profile is still being prepared. Refresh this page in a moment.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Account</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Profile settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Keep your student profile accurate for future marketplace activity.
        </p>
      </div>

      {/* Public Profile */}
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

      {/* Security */}
      <Card className="shadow-xs">
        <CardHeader className="flex-row items-center gap-3 border-b pb-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LockKeyhole aria-hidden="true" className="size-5" />
          </span>

          <div>
            <CardTitle>Security</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Change your CampusStall account password.
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}