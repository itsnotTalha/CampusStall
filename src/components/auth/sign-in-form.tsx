"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction } from "@/app/auth/actions";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SignInFormProps = {
  externalError?: string;
  nextPath: string;
};

export function SignInForm({ externalError, nextPath }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, {});

  return (
    <div className="w-full rounded-2xl border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
      <p className="text-sm font-semibold text-primary">Welcome back</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.04em]">
        Sign in to CampusStall
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Access your dashboard, messages, purchases, and saved projects.
      </p>

      <form action={formAction} className="mt-7 space-y-5">
        <input name="next" type="hidden" value={nextPath} />
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input
            autoComplete="email"
            className="h-11"
            id="email"
            name="email"
            placeholder="you@university.edu"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input
            autoComplete="current-password"
            className="h-11"
            id="password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </div>

        <FormMessage state={state.error || state.success ? state : { error: externalError }} />

        <Button className="h-11 w-full" disabled={pending} size="lg" type="submit">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to CampusStall?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/sign-up">
          Create an account
        </Link>
      </p>
    </div>
  );
}
