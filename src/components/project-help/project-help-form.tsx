"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  Code2,
  Send,
} from "lucide-react";

import {
  createProjectHelpRequestAction,
  type ProjectHelpFormState,
} from "@/app/project-help/actions";
import { FormMessage } from "@/components/auth/form-message";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  projectHelpCategories,
  technologySuggestions,
} from "@/data/project-help";
import { cn } from "@/lib/utils";

const initialState: ProjectHelpFormState = {};
const textareaClass =
  "w-full resize-y rounded-lg border border-input bg-background/65 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 dark:border-white/10 dark:bg-white/[0.045]";

export function ProjectHelpForm({
  isAuthenticated,
  minimumDeadline,
}: {
  isAuthenticated: boolean;
  minimumDeadline: string;
}) {
  const [state, formAction, pending] = useActionState(
    createProjectHelpRequestAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="help-description">
          What do you need help with?
        </label>
        <textarea
          className={`${textareaClass} min-h-36`}
          id="help-description"
          maxLength={10000}
          minLength={20}
          name="description"
          placeholder="Describe the problem, what you have tried, and the outcome you want."
          required
        />
        <p className="text-[10px] leading-4 text-muted-foreground">
          Ask for mentoring, debugging, consultation, teammates, or legitimate
          project support—not assessed work completed for you.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="help-category">
            Category
          </label>
          <select
            className="h-11 w-full rounded-lg border border-input bg-background/65 px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30 dark:border-white/10 dark:bg-white/[0.045]"
            defaultValue=""
            id="help-category"
            name="category"
            required
          >
            <option disabled value="">
              Choose a category
            </option>
            {projectHelpCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="help-technology">
            Technology
          </label>
          <div className="relative">
            <Code2
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-11 pl-10"
              id="help-technology"
              maxLength={300}
              name="technology"
              placeholder="React, Supabase, TypeScript"
              required
            />
          </div>
          <p className="text-[10px] leading-4 text-muted-foreground">
            Separate tags with commas. Examples: {technologySuggestions.slice(0, 5).join(", ")}.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="help-budget">
            Budget
          </label>
          <div className="relative">
            <CircleDollarSign
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-11 pl-10"
              id="help-budget"
              max={10000000}
              min={1}
              name="budgetBdt"
              placeholder="3000"
              required
              type="number"
            />
          </div>
          <p className="text-[10px] text-muted-foreground">Budget in BDT (৳).</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="help-deadline">
            Deadline
          </label>
          <div className="relative">
            <CalendarDays
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-11 pl-10"
              id="help-deadline"
              min={minimumDeadline}
              name="deadline"
              required
              type="date"
            />
          </div>
        </div>
      </div>

      <FormMessage state={state} />

      {isAuthenticated ? (
        <Button className="h-11 w-full" disabled={pending} size="lg" type="submit">
          <Send aria-hidden="true" />
          {pending ? "Finding matches…" : "Submit request & find matches"}
        </Button>
      ) : (
        <Link
          className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
          href="/sign-in?next=/project-help"
        >
          Sign in to submit
        </Link>
      )}
    </form>
  );
}
