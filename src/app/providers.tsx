"use client";

import { SimulationProvider } from "@/context/SimulationContext";
import { GameShell } from "@/components/layout/GameShell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SimulationProvider>
      <GameShell>
        <div className="flex-1 w-full h-full overflow-y-auto scroll-smooth flex flex-col">
          {children}
        </div>
      </GameShell>
    </SimulationProvider>
  );
}
