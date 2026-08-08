import { Boxes, CheckCircle2, FileCode2, Play } from "lucide-react";

type GenericProjectPreviewProps = {
  projectTitle: string;
};

export function GenericProjectPreview({
  projectTitle,
}: GenericProjectPreviewProps) {
  return (
    <div className="flex min-h-[30rem] items-center justify-center bg-muted/35 p-4 sm:p-8">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="ml-2 truncate text-[10px] text-muted-foreground">
            {projectTitle} · simulated workspace
          </span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-[0.75fr_1.25fr] sm:p-7">
          <div className="space-y-2">
            {[FileCode2, Boxes, CheckCircle2].map((Icon, index) => (
              <div
                className="flex items-center gap-3 rounded-lg border bg-background p-3"
                key={index}
              >
                <Icon className="size-4 text-primary" />
                <span className="h-2 rounded-full bg-muted" style={{ width: `${62 + index * 9}%` }} />
              </div>
            ))}
          </div>
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed bg-muted/30">
            <div className="text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl border bg-card text-primary shadow-xs">
                <Play className="size-5 fill-current" />
              </span>
              <p className="mt-4 text-sm font-semibold">Interactive project mock</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Safe interface preview—no uploaded code runs here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
