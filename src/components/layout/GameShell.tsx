"use client";

import { motion } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import { User, ShieldCheck, Zap, LogOut } from "lucide-react";

export function GameShell({ children }: { children: React.ReactNode }) {
  const { name, occupationType, quarter, handleRestart } = useSimulation();

  return (
    <div className="game-viewport h-screen overflow-hidden bg-slate-50 flex flex-col relative font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header HUD */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 glass-morphism border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
             <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Freedom Path</h1>
            <p className="text-[10px] font-semibold text-slate-500 mt-1">Life Simulation</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 leading-none">PROGRESS</span>
             <div className="flex items-center gap-2 mt-1.5">
               <div className="flex gap-1">
                 {[1, 2, 3, 4].map(q => (
                    <div key={q} className={`w-3 h-1 rounded-full ${q <= quarter ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                 ))}
               </div>
               <span className="text-xs font-bold text-slate-800">Q{quarter}</span>
             </div>
           </div>

           <div className="h-8 w-[1px] bg-slate-200" />

           {name && (
             <div className="flex items-center gap-3 bg-slate-100/50 px-3 py-1.5 rounded-xl border border-slate-200">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">{name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{occupationType || "User"}</p>
                </div>
             </div>
           )}
        </div>

        <button 
          onClick={handleRestart}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-all"
          title="Restart"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-50 px-6 py-3 border-t border-slate-200 glass-morphism text-[10px] font-semibold text-slate-400 flex justify-between items-center">
         <div>
           Freedom Path v1.0
         </div>
         <div className="flex items-center gap-4">
           Life Simulation
         </div>
      </footer>
    </div>
  );
}
