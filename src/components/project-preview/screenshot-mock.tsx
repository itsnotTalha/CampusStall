import type { ScreenshotLayout } from "@/data/project-details";
import { cn } from "@/lib/utils";

type ScreenshotMockProps = {
  layout: ScreenshotLayout;
  compact?: boolean;
};

export function ScreenshotMock({ layout, compact = false }: ScreenshotMockProps) {
  return (
    <div
      className={cn(
        "h-full min-h-64 overflow-hidden rounded-lg border bg-white p-3 text-slate-900 shadow-sm",
        compact && "min-h-24 p-2",
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <span className="size-1.5 rounded-full bg-slate-200" />
        <span className="size-1.5 rounded-full bg-slate-200" />
        <span className="size-1.5 rounded-full bg-slate-200" />
        <span className="ml-2 h-1.5 w-1/3 rounded-full bg-slate-100" />
      </div>
      {layout === "overview" && <OverviewLayout compact={compact} />}
      {layout === "analytics" && <AnalyticsLayout compact={compact} />}
      {layout === "workspace" && <WorkspaceLayout compact={compact} />}
    </div>
  );
}

function OverviewLayout({ compact }: { compact: boolean }) {
  return (
    <div className="mt-3">
      <div className="grid grid-cols-3 gap-2">
        {[70, 52, 82].map((width) => (
          <div className={cn("rounded border border-slate-100 p-2", compact && "p-1")} key={width}>
            <span className="block h-1 w-1/2 rounded bg-emerald-100" />
            <span className="mt-2 block h-2 rounded bg-slate-800" style={{ width: `${width}%` }} />
          </div>
        ))}
      </div>
      <div className={cn("mt-3 h-32 rounded border border-slate-100 p-3", compact && "mt-2 h-10 p-1")}>
        <div className="flex h-full items-end gap-2">
          {[35, 52, 44, 72, 63, 88, 76].map((height, index) => (
            <span
              className="flex-1 rounded-t-sm bg-emerald-400"
              key={index}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsLayout({ compact }: { compact: boolean }) {
  return (
    <div className={cn("mt-3 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]", compact && "mt-2 grid-cols-1 gap-1")}>
      <div className={cn("flex h-44 items-end gap-2 rounded border border-slate-100 p-3", compact && "h-14 p-1")}>
        {[64, 44, 78, 55, 90, 74].map((height, index) => (
          <span
            className="flex-1 rounded-t-sm bg-sky-400"
            key={index}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className={cn("space-y-2", compact && "hidden")}>
        {["w-3/4", "w-1/2", "w-2/3", "w-4/5"].map((width) => (
          <div className="rounded border border-slate-100 p-2" key={width}>
            <span className={cn("block h-2 rounded bg-slate-100", width)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkspaceLayout({ compact }: { compact: boolean }) {
  return (
    <div className="mt-3 overflow-hidden rounded border border-slate-100">
      <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr] gap-2 bg-slate-50 p-2">
        {["Item", "Status", "Result"].map((label) => (
          <span className="text-[7px] font-semibold text-slate-400" key={label}>
            {compact ? "" : label}
          </span>
        ))}
      </div>
      {Array.from({ length: compact ? 2 : 6 }).map((_, index) => (
        <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr] gap-2 border-t border-slate-100 p-2" key={index}>
          <span className="h-1.5 rounded bg-slate-200" />
          <span className="h-1.5 w-2/3 rounded bg-emerald-100" />
          <span className="h-1.5 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
