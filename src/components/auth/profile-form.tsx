"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/app/auth/actions";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SessionProfile } from "@/lib/auth/session";

export function ProfileForm({ profile }: { profile: SessionProfile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {});

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium" htmlFor="profile-name">
            Name
          </label>
          <Input
            className="h-11"
            defaultValue={profile.display_name}
            id="profile-name"
            maxLength={80}
            name="name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="profile-university">
            University
          </label>
          <Input
            className="h-11"
            defaultValue={profile.university ?? ""}
            id="profile-university"
            maxLength={120}
            name="university"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="profile-department">
            Department
          </label>
          <Input
            className="h-11"
            defaultValue={profile.department ?? ""}
            id="profile-department"
            maxLength={80}
            name="department"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium" htmlFor="profile-avatar">
            Avatar URL
          </label>
          <Input
            className="h-11"
            defaultValue={profile.avatar_url ?? ""}
            id="profile-avatar"
            name="avatarUrl"
            placeholder="https://…"
            type="url"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium" htmlFor="profile-bio">
            Short bio
          </label>
          <textarea
            className="min-h-28 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            defaultValue={profile.bio ?? ""}
            id="profile-bio"
            maxLength={500}
            name="bio"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/35 p-4">
        <input
          className="mt-1 size-4 accent-primary"
          defaultChecked={profile.is_seller}
          name="isSeller"
          type="checkbox"
        />
        <span>
          <span className="block text-sm font-semibold">Seller profile</span>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            Mark this account as interested in selling student-owned work or services.
          </span>
        </span>
      </label>

      <FormMessage state={state} />

      <div className="flex justify-end">
        <Button className="h-10 px-5" disabled={pending} type="submit">
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
