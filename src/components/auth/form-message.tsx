import { CircleCheck, CircleX } from "lucide-react";

import type { FormActionState } from "@/lib/auth/action-state";

export function FormMessage({ state }: { state: FormActionState }) {
  if (!state.error && !state.success) {
    return null;
  }

  const isError = Boolean(state.error);
  const Icon = isError ? CircleX : CircleCheck;

  return (
    <div
      className={
        isError
          ? "flex gap-2 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive"
          : "flex gap-2 rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-foreground"
      }
      role={isError ? "alert" : "status"}
    >
      <Icon
        aria-hidden="true"
        className={isError ? "mt-0.5 size-4 shrink-0" : "mt-0.5 size-4 shrink-0 text-primary"}
      />
      <span>{state.error ?? state.success}</span>
    </div>
  );
}
