"use client";

import { AnimatePresence } from "framer-motion";
import { SimulationProvider, useSimulation } from "@/context/SimulationContext";
import { GameShell } from "@/components/layout/GameShell";
import { OnboardingStep1 } from "@/components/Onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/Onboarding/OnboardingStep2";
import { QuarterPlanning } from "@/components/Quarter/QuarterPlanning";
import { SimulationPhase } from "@/components/Simulation/SimulationPhase";
import { SleepCycle } from "@/components/Sleep/SleepCycle";
import { EndSummary } from "@/components/End/EndSummary";

function SandboxAppContent() {
  const { step } = useSimulation();

  return (
    <GameShell>
      <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-y-auto scroll-smooth">
        <AnimatePresence mode="wait">
          {step === "onboarding-1" && <OnboardingStep1 />}
          {step === "onboarding-2" && <OnboardingStep2 />}
          {step === "quarter" && <QuarterPlanning />}
          {step === "simulation" && <SimulationPhase />}
          {step === "sleep" && <SleepCycle />}
          {step === "end" && <EndSummary />}
        </AnimatePresence>
      </div>
    </GameShell>
  );
}

export default function SandboxApp() {
  return (
    <SimulationProvider>
      <SandboxAppContent />
    </SimulationProvider>
  );
}
