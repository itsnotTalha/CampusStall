"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subscribe = () => () => undefined;

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <Button
      aria-label={`Switch to ${nextTheme} mode`}
      className={cn(
        "relative overflow-hidden text-muted-foreground hover:text-foreground",
        className,
      )}
      disabled={!mounted}
      onClick={() => setTheme(nextTheme)}
      size="icon"
      title={`Switch to ${nextTheme} mode`}
      type="button"
      variant="ghost"
    >
      <Sun
        aria-hidden="true"
        className={cn(
          "absolute transition-all duration-300",
          isDark ? "scale-100 rotate-0 text-amber-300" : "scale-0 -rotate-90",
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "absolute transition-all duration-300",
          isDark ? "scale-0 rotate-90" : "scale-100 rotate-0 text-indigo-600",
        )}
      />
      <span className="sr-only">Switch to {nextTheme} mode</span>
    </Button>
  );
}
