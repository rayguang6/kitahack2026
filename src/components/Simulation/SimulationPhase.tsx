"use client";

import { motion } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import { WorldMap } from "./WorldMap";

export function SimulationPhase() {
  const { quarter } = useSimulation();

  return (
    <motion.div
      key="simulation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full min-h-[70vh] space-y-10 py-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Simulating...</h2>
        <p className="text-sm font-medium text-slate-500">Quarter {quarter} simulation in progress</p>
      </div>
      
      <div className="w-full max-w-4xl px-4">
        <WorldMap />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white px-8 py-4 rounded-xl border border-slate-200 shadow-lg flex items-center gap-4"
      >
        <div className="flex gap-1.5">
          {[1,2,3].map(i => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
              className="w-2.5 h-2.5 bg-indigo-500 rounded-full"
            />
          ))}
        </div>
        <p className="text-sm text-slate-600 font-semibold italic">
          Calculating outcomes and life events...
        </p>
      </motion.div>
    </motion.div>
  );
}
