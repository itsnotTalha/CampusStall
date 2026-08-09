"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteProjectAction } from "@/app/(dashboard)/sell/project/actions";
import { Button } from "@/components/ui/button";

export function DeleteProjectButton({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function removeProject() {
    if (!window.confirm(`Delete “${projectTitle}” and all of its uploaded files?`)) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await deleteProjectAction(projectId);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <Button
        aria-label={`Delete ${projectTitle}`}
        disabled={pending}
        onClick={removeProject}
        size="icon"
        type="button"
        variant="ghost"
      >
        {pending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" className="text-destructive" />
        )}
      </Button>
      {error && <p className="mt-1 max-w-44 text-xs text-destructive">{error}</p>}
    </div>
  );
}
