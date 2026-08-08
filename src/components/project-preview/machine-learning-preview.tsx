"use client";

import { useState } from "react";
import { BrainCircuit, CheckCircle2, Leaf, ScanSearch } from "lucide-react";

import { cn } from "@/lib/utils";

const samples = [
  {
    id: "healthy",
    label: "Healthy leaf",
    prediction: "Healthy",
    confidence: 97.2,
    leafClass: "text-emerald-600",
    backgroundClass: "bg-emerald-50",
  },
  {
    id: "early-blight",
    label: "Sample A",
    prediction: "Early blight",
    confidence: 92.6,
    leafClass: "text-amber-700",
    backgroundClass: "bg-amber-50",
  },
  {
    id: "leaf-spot",
    label: "Sample B",
    prediction: "Leaf spot",
    confidence: 89.4,
    leafClass: "text-orange-700",
    backgroundClass: "bg-orange-50",
  },
] as const;

export function MachineLearningPreview() {
  const [selectedId, setSelectedId] = useState<(typeof samples)[number]["id"]>(
    "healthy",
  );
  const selected = samples.find((sample) => sample.id === selectedId) ?? samples[0];

  return (
    <div className="min-h-[30rem] bg-[#f6f8f7] p-3 text-slate-900 sm:p-5">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-emerald-600 text-white">
              <BrainCircuit className="size-3.5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold sm:text-xs">LeafLens AI</p>
              <p className="text-[8px] text-slate-400">Plant condition classifier</p>
            </div>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[8px] font-semibold text-amber-800">
            Simulated prediction
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] font-semibold">1. Select a sample image</p>
            <p className="mt-1 text-[9px] leading-4 text-slate-500">
              Samples are bundled visual placeholders. No code or uploads are
              executed.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-1">
              {samples.map((sample) => (
                <button
                  aria-pressed={sample.id === selected.id}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-2 text-left transition-colors md:flex-row md:p-2.5",
                    sample.id === selected.id &&
                      "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500/20",
                  )}
                  key={sample.id}
                  onClick={() => setSelectedId(sample.id)}
                  type="button"
                >
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-md",
                      sample.backgroundClass,
                      sample.leafClass,
                    )}
                  >
                    <Leaf className="size-6" />
                  </span>
                  <span className="text-center text-[8px] font-medium md:text-left md:text-[10px]">
                    {sample.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanSearch className="size-4 text-emerald-600" />
                <p className="text-[10px] font-semibold">Prediction result</p>
              </div>
              <span className="flex items-center gap-1 text-[8px] font-medium text-emerald-700">
                <CheckCircle2 className="size-3" /> Ready
              </span>
            </div>

            <div className="mt-4 flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white">
              <div className="text-center">
                <Leaf className={cn("mx-auto size-16", selected.leafClass)} strokeWidth={1.4} />
                <p className="mt-2 text-[9px] text-slate-400">Selected sample image</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[8px] font-medium text-slate-400 uppercase">
                    Predicted class
                  </p>
                  <p className="mt-1 text-sm font-semibold">{selected.prediction}</p>
                </div>
                <p className="text-xl font-semibold text-emerald-700">
                  {selected.confidence}%
                </p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
                  style={{ width: `${selected.confidence}%` }}
                />
              </div>
              <p className="mt-2 text-[8px] leading-4 text-slate-400">
                Confidence is simulated for interface demonstration only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
