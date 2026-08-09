"use client";

import { useActionState } from "react";
import { CalendarDays, CircleDollarSign, WandSparkles } from "lucide-react";

import {
  createCustomizationRequestAction,
  type CustomizationRequestFormState,
} from "@/app/(dashboard)/customization-requests/actions";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: CustomizationRequestFormState = {};
const textareaClass =
  "w-full resize-y rounded-lg border border-input bg-background/65 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 dark:border-white/10 dark:bg-white/[0.045]";

export function CustomizationRequestForm({
  minimumDeadline,
  projectId,
}: {
  minimumDeadline: string;
  projectId: string;
}) {
  const [state, formAction, pending] = useActionState(
    createCustomizationRequestAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input name="projectId" type="hidden" value={projectId} />
      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="requested-changes">
          Requested changes
        </label>
        <textarea
          className={`${textareaClass} min-h-44`}
          id="requested-changes"
          maxLength={10000}
          minLength={20}
          name="requestedChanges"
          placeholder="Describe the features, design changes, integrations, or technical adjustments you need."
          required
        />
        <p className="text-xs text-muted-foreground">
          Be specific about scope and expected outcomes.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="budget-bdt">
            Budget
          </label>
          <div className="relative">
            <CircleDollarSign
              aria-hidden="true"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-11 pl-10"
              id="budget-bdt"
              max={10000000}
              min={1}
              name="budgetBdt"
              placeholder="5000"
              required
              type="number"
            />
          </div>
          <p className="text-xs text-muted-foreground">Proposed budget in BDT (৳).</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="deadline">
            Deadline
          </label>
          <div className="relative">
            <CalendarDays
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-11 pl-10"
              id="deadline"
              min={minimumDeadline}
              name="deadline"
              required
              type="date"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="request-note">
          Optional note
        </label>
        <textarea
          className={`${textareaClass} min-h-28`}
          id="request-note"
          maxLength={2000}
          name="note"
          placeholder="Add context about availability, preferred approach, or constraints."
        />
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-xs leading-5 text-muted-foreground">
        Customization requests must support legitimate learning, development, or
        design work. Do not request assessed work to be completed dishonestly.
      </div>

      <FormMessage state={state} />

      <Button className="h-11 w-full" disabled={pending} size="lg" type="submit">
        <WandSparkles aria-hidden="true" />
        {pending ? "Submitting request…" : "Submit customization request"}
      </Button>
    </form>
  );
}
