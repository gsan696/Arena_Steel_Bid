"use client";

import { useSyncExternalStore } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import Header from "./Header";
import Stepper from "./Stepper";
import WizardNav from "./WizardNav";
import UploadStep from "./steps/UploadStep";
import AnalyzeStep from "./steps/AnalyzeStep";
import ReviewStep from "./steps/ReviewStep";
import GenerateMtoStep from "./steps/GenerateMtoStep";
import ReviewMtoStep from "./steps/ReviewMtoStep";
import ConnectionsStep from "./steps/ConnectionsStep";
import HoursStep from "./steps/HoursStep";
import PricingStep from "./steps/PricingStep";
import BidDocumentsStep from "./steps/BidDocumentsStep";

const STEP_COMPONENTS = [
  UploadStep,
  AnalyzeStep,
  ReviewStep,
  GenerateMtoStep,
  ReviewMtoStep,
  ConnectionsStep,
  HoursStep,
  PricingStep,
  BidDocumentsStep,
];

function Splash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-pulse rounded-lg bg-amber-500" />
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        Loading project…
      </p>
    </div>
  );
}

function subscribeHydration(onStoreChange) {
  return useProjectStore.persist.onFinishHydration(onStoreChange);
}

function getHydrationSnapshot() {
  return useProjectStore.persist.hasHydrated();
}

function getServerHydrationSnapshot() {
  return false;
}

export default function Wizard() {
  const currentStep = useProjectStore((s) => s.currentStep);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot
  );

  if (!hydrated) return <Splash />;

  const Step = STEP_COMPONENTS[currentStep] ?? UploadStep;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="border-b border-white/8 bg-[#0c0e14]/80 px-4 py-4 backdrop-blur-md lg:px-8">
        <div className="overflow-x-auto pb-1">
          <Stepper />
        </div>
      </div>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 lg:px-8">
        <div key={currentStep} className="step-enter flex-1">
          <Step />
        </div>
      </main>
      <WizardNav />
    </div>
  );
}
