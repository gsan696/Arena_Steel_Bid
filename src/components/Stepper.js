"use client";

import { Check } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useProjectStore } from "@/store/useProjectStore";

export default function Stepper() {
  const currentStep = useProjectStore((s) => s.currentStep);
  const maxStepReached = useProjectStore((s) => s.maxStepReached);
  const setStep = useProjectStore((s) => s.setStep);

  return (
    <nav aria-label="Bid workflow" className="mx-auto max-w-7xl">
      <ol className="flex w-full min-w-[720px] items-start">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentStep;
          const isComplete = index < currentStep;
          const isReached = index <= maxStepReached;
          const canClick = isReached && !isCurrent;
          const lineDone = index < currentStep;
          const nextLineDone = index < currentStep;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-px flex-1",
                    index === 0
                      ? "bg-transparent"
                      : lineDone
                        ? "bg-amber-500"
                        : "bg-white/10"
                  )}
                />
                <button
                  type="button"
                  disabled={!canClick && !isCurrent}
                  onClick={() => canClick && setStep(index)}
                  title={
                    canClick
                      ? `Go back to ${step.label}`
                      : isCurrent
                        ? `Current step: ${step.label}`
                        : `${step.label} is not available yet`
                  }
                  className={cn(
                    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition",
                    isCurrent &&
                      "bg-amber-500 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.45)]",
                    isComplete &&
                      "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40 hover:bg-amber-500 hover:text-zinc-950",
                    !isCurrent &&
                      !isComplete &&
                      isReached &&
                      "bg-steel-700 text-zinc-300 ring-1 ring-white/10 hover:ring-amber-500/40",
                    !isReached &&
                      "bg-steel-800 text-zinc-600 ring-1 ring-white/8 cursor-not-allowed"
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </button>
                <div
                  className={cn(
                    "h-px flex-1",
                    index === STEPS.length - 1
                      ? "bg-transparent"
                      : nextLineDone
                        ? "bg-amber-500"
                        : "bg-white/10"
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-2 max-w-[92px] text-center text-[9px] font-semibold leading-tight tracking-[0.12em] sm:text-[10px]",
                  isCurrent ? "text-amber-400" : "text-zinc-500"
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
