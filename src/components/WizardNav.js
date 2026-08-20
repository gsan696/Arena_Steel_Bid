"use client";

import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { useProjectStore } from "@/store/useProjectStore";
import { Button } from "./ui";

export default function WizardNav() {
  const currentStep = useProjectStore((s) => s.currentStep);
  const nextStep = useProjectStore((s) => s.nextStep);
  const prevStep = useProjectStore((s) => s.prevStep);
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <footer className="sticky bottom-0 z-30 border-t border-white/8 bg-[#090b10]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isFirst}
          className="min-w-[108px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="hidden text-center sm:block">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Step {currentStep + 1} of {STEPS.length}
          </div>
          <div className="text-xs text-zinc-400">{STEPS[currentStep].title}</div>
        </div>

        {isLast ? (
          <Button
            className="min-w-[108px]"
            onClick={() =>
              window.alert(
                "Bid package is ready. Use Export PDF or Export Excel on this step to download deliverables."
              )
            }
          >
            <Flag className="h-4 w-4" />
            Finish
          </Button>
        ) : (
          <Button onClick={nextStep} className="min-w-[108px]">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </footer>
  );
}
