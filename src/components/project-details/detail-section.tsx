import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DetailSectionProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function DetailSection({
  id,
  title,
  description,
  children,
  className,
}: DetailSectionProps) {
  return (
    <section
      className={cn("scroll-mt-28 rounded-xl border bg-card p-5 shadow-xs sm:p-7", className)}
      id={id}
    >
      <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}
