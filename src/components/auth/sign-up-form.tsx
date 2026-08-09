"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpAction } from "@/app/auth/actions";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, {});

  return (
    <div className="w-full rounded-2xl border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
      <p className="text-sm font-semibold text-primary">Join the marketplace</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.04em]">
        Create your student profile
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Start as a buyer, seller, or both. You can update these details later.
      </p>

      <form action={formAction} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <Input className="h-11" id="name" maxLength={80} name="name" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="signup-email">
              Email
            </label>
            <Input
              autoComplete="email"
              className="h-11"
              id="signup-email"
              name="email"
              placeholder="you@university.edu"
              required
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="signup-password">
              Password
            </label>
            <Input
              autoComplete="new-password"
              className="h-11"
              id="signup-password"
              minLength={8}
              name="password"
              required
              type="password"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirm-password">
              Confirm password
            </label>
            <Input
              autoComplete="new-password"
              className="h-11"
              id="confirm-password"
              minLength={8}
              name="confirmPassword"
              required
              type="password"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="university">
              University <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input className="h-11" id="university" maxLength={120} name="university" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="department">
              Department <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input className="h-11" id="department" maxLength={80} name="department" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="avatar-url">
              Avatar URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              className="h-11"
              id="avatar-url"
              name="avatarUrl"
              placeholder="https://…"
              type="url"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="bio">
              Short bio <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              className="min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              id="bio"
              maxLength={500}
              name="bio"
              placeholder="What do you build or study?"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/35 p-4">
          <input className="mt-1 size-4 accent-primary" name="isSeller" type="checkbox" />
          <span>
            <span className="block text-sm font-semibold">I want to sell on CampusStall</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Enables seller status on your profile. Listing tools will be added later.
            </span>
          </span>
        </label>

        <FormMessage state={state} />

        <Button className="h-11 w-full" disabled={pending} size="lg" type="submit">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
