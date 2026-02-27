"use client";

import { motion } from "framer-motion";
import { Palette, Share2, RefreshCw } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

export function EndSummary() {
  const { history, handleRestart } = useSimulation();

  return (
    <motion.div
      key="end"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-6xl space-y-12 py-10"
    >
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-slate-900">Your Journey</h1>
        <p className="text-sm font-medium text-slate-500">A summary of your life simulation results</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((qResult, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={`h-q-${qResult.quarter}`} 
            className="bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col h-full overflow-hidden"
          >
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Quarter {qResult.quarter}</h3>
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div className="p-6 space-y-6 flex-1 flex flex-col">
              <div className="flex flex-wrap gap-2">
                {qResult.activities.map(act => (
                  <div key={act.id} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      act.category === 'skill' ? 'bg-indigo-500' : 
                      act.category === 'hobby' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    {act.name} <span className="opacity-50">x{act.allocated}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto pt-6 border-t border-slate-100 italic">
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  "{qResult.ai.narrative}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-3xl shadow-xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center text-center lg:text-left">
            <div className="w-24 h-24 shrink-0 bg-white shadow-xl rounded-2xl flex items-center justify-center">
              <Palette className="w-10 h-10 text-indigo-500" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-indigo-400 text-xs uppercase tracking-wider">Lifestyle Profile</h3>
              {(() => {
                const flatActivities = history.flatMap(h => h.activities);
                const skillTotal = flatActivities.filter(a => a.category === 'skill').reduce((s, a) => s + a.allocated, 0);
                const hobbyTotal = flatActivities.filter(a => a.category === 'hobby').reduce((s, a) => s + a.allocated, 0);
                const socialTotal = flatActivities.filter(a => a.category === 'social').reduce((s, a) => s + a.allocated, 0);
                
                let dominant = "Balanced Person";
                if (skillTotal > hobbyTotal && skillTotal > socialTotal) dominant = "The Achiever";
                if (hobbyTotal > skillTotal && hobbyTotal > socialTotal) dominant = "The Free Spirit";
                if (socialTotal > skillTotal && socialTotal > hobbyTotal) dominant = "The Social Butterfly";
 
                return (
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{dominant}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
                      Your choices show that you value {
                        dominant === "The Achiever" ? "improving your skills and reaching your goals." :
                        dominant === "The Free Spirit" ? "relaxing and enjoying your hobbies." :
                        dominant === "The Social Butterfly" ? "connecting with others and building relationships." : "a balanced approach to work and life."
                      }
                    </p>
                  </div>
                )
              })()}
            </div>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleRestart}
          className="flex-1 bg-white border border-slate-900 text-slate-900 rounded-2xl py-4 text-sm font-bold hover:bg-slate-900 hover:text-white transition-all shadow-md flex items-center justify-center gap-2 group"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"/>
          Play Again
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(history, null, 2));
            alert("Results copied to clipboard.");
          }}
          className="flex-1 bg-indigo-600 text-white rounded-2xl py-4 text-sm font-bold transition-all shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2 group"
        >
          <Share2 className="w-5 h-5"/>
          Share Results
        </button>
      </div>
    </motion.div>
  );
}

function Quote({ narrative }: { narrative: string }) {
  return (
    <div className="relative">
      <span className="absolute -left-2 -top-2 text-4xl text-slate-200 font-serif leading-none">"</span>
      <p className="text-sm text-slate-500 font-medium leading-relaxed relative z-10 pl-2 pt-1"><i>{narrative}</i></p>
    </div>
  )
}
