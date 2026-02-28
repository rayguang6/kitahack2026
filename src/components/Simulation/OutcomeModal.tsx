"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import { CheckCircle2, Loader2, Sparkles, TrendingUp } from "lucide-react";

export function OutcomeModal() {
  const { gamePhase, actionOutcome, setGamePhase, setPhase } = useSimulation();

  const isVisible = gamePhase === "evaluating" || gamePhase === "showing_outcome";

  const handleContinue = () => {
    setGamePhase("idle");
    setPhase("sleep"); // After evening action, it is time to sleep
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            {gamePhase === "evaluating" ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <h3 className="text-lg font-bold text-white">Simulating Action...</h3>
                <p className="text-sm text-slate-400">
                  The AI is evaluating how well you performed and what you learned.
                </p>
              </div>
            ) : actionOutcome ? (
              <>
                <div className="bg-indigo-600/10 p-6 flex flex-col items-center border-b border-indigo-500/20">
                  <div className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Action Complete</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="w-4 h-4 text-amber-400" />
                       <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Outcome</h4>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {actionOutcome.narrative}
                    </p>
                  </div>

                  {actionOutcome.skills_improved && actionOutcome.skills_improved.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3">
                        <TrendingUp className="w-4 h-4" />
                        SKILLS IMPROVED
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {actionOutcome.skills_improved.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleContinue}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-colors"
                  >
                    Start Next Day
                  </button>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
