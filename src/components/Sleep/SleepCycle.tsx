"use client";

import { motion } from "framer-motion";
import { Brain, Check, Star, Sparkles, ArrowRight, Zap } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

export function SleepCycle() {
  const { quarter, aiResult, proceedToNext } = useSimulation();

  return (
    <motion.div
      key="sleep"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl flex flex-col items-center justify-center min-h-[60vh] py-10"
    >
      {!aiResult ? (
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-xl">
              <Brain className="w-8 h-8 text-indigo-500 animate-pulse" />
            </div>
            <div className="absolute -inset-3 w-26 h-26 rounded-3xl border-t-2 border-indigo-500/50 animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Analyzing...</h2>
            <p className="text-sm font-medium text-slate-500 animate-pulse">Processing your life events...</p>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">Quarterly Summary</h1>
            <p className="text-sm font-medium text-slate-500">Quarter {quarter} Reflection</p>
          </header>

          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <p className="text-2xl sm:text-3xl text-slate-900 leading-tight font-bold italic">&quot;{aiResult.narrative}&quot;</p>
              </div>

              <div className="h-[1px] w-full bg-slate-100" />

              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-5 h-5 text-indigo-500"/>
                    <h4 className="text-sm font-bold text-slate-800">Core Insight</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{aiResult.insight}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500"/>
                    <h4 className="text-sm font-bold text-slate-800">Next Steps</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{aiResult.suggestion}</p>
                </div>
              </div>

              {aiResult.unlockedOpportunity && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">New Opportunity Unlocked</span>
                      </div>
                      <p className="text-xl text-white font-bold">{aiResult.unlockedOpportunity.name}</p>
                    </div>
                    <Zap className="w-8 h-8 text-white/10" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={proceedToNext}
              className="w-full max-w-sm py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-all"
            >
              <span>{quarter < 4 ? `Start Quarter ${quarter + 1}` : "View Results"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
