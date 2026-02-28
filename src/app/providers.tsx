"use client";

import { SimulationProvider } from "@/context/SimulationContext";
import { GameShell } from "@/components/layout/GameShell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SimulationProvider>
      <GameShell>
        <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </GameShell>
    </SimulationProvider>
  );
}
