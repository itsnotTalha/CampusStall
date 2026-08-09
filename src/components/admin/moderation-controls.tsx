"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check, LoaderCircle, X } from "lucide-react";

import {
  moderateProjectAction,
  type ModerationActionState,
} from "@/app/(dashboard)/admin/projects/actions";
import { Button } from "@/components/ui/button";

const initialState: ModerationActionState = { error: null };

function SubmitButton({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive";
}) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant={variant}>
      {pending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {children}
    </Button>
  );
}

export function ModerationControls({ projectId }: { projectId: string }) {
  const [approveState, approveAction] = useActionState(
    moderateProjectAction,
    initialState,
  );
  const [rejectState, rejectAction] = useActionState(
    moderateProjectAction,
    initialState,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        action={approveAction}
        className="rounded-xl border border-emerald-500/20 bg-emerald-500/6 p-4"
      >
        <input name="projectId" type="hidden" value={projectId} />
        <input name="intent" type="hidden" value="approve" />
        <h3 className="font-semibold">Approve listing</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Publish this project to the public marketplace.
        </p>
        {approveState.error && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {approveState.error}
          </p>
        )}
        <div className="mt-4">
          <SubmitButton>
            <Check aria-hidden="true" />
            Approve project
          </SubmitButton>
        </div>
      </form>

      <form
        action={rejectAction}
        className="rounded-xl border border-destructive/20 bg-destructive/6 p-4"
      >
        <input name="projectId" type="hidden" value={projectId} />
        <input name="intent" type="hidden" value="reject" />
        <label className="font-semibold" htmlFor="rejection-reason">
          Reject listing
        </label>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Give the seller a concise reason they can act on.
        </p>
        <textarea
          className="mt-3 min-h-24 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          id="rejection-reason"
          maxLength={500}
          minLength={5}
          name="rejectionReason"
          placeholder="Explain what needs to change…"
          required
        />
        {rejectState.error && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {rejectState.error}
          </p>
        )}
        <div className="mt-3">
          <SubmitButton variant="destructive">
            <X aria-hidden="true" />
            Reject project
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
