import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Database,
  FileCode2,
  FileText,
  HandHelping,
  NotebookTabs,
  PlaySquare,
  Presentation,
  TableProperties,
} from "lucide-react";

import type { DeliverableName } from "@/data/project-details";

const deliverableIcons: Record<DeliverableName, LucideIcon> = {
  "Source Code": FileCode2,
  Database,
  Dataset: TableProperties,
  "Trained Model": BrainCircuit,
  Documentation: FileText,
  Presentation,
  "Installation Guide": NotebookTabs,
  Demo: PlaySquare,
  "Seller Support": HandHelping,
};

type DeliverablesGridProps = {
  deliverables: readonly DeliverableName[];
};

export function DeliverablesGrid({ deliverables }: DeliverablesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {deliverables.map((deliverable) => {
        const Icon = deliverableIcons[deliverable];

        return (
          <div
            className="flex min-h-24 flex-col justify-between rounded-lg border bg-background p-4"
            key={deliverable}
          >
            <Icon aria-hidden="true" className="size-5 text-primary" />
            <p className="mt-4 text-xs font-semibold sm:text-sm">{deliverable}</p>
          </div>
        );
      })}
    </div>
  );
}
