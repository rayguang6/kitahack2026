"use client";

import { motion } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import { Zap, HeartPulse, Users, Map as MapIcon, PersonStanding } from "lucide-react";

export function WorldMap() {
  const { activities, name } = useSimulation();
  
  // Create a grid 10x10
  const grid = Array.from({ length: 100 }, (_, i) => i);
  
  // Assign activities to some random grid positions if they have allocation
  const allocatedActivities = activities.filter(a => a.allocated > 0);
  
  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto bg-slate-100 rounded-[32px] border-4 border-slate-200 overflow-hidden shadow-inner">
      {/* Grid Background */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {grid.map(i => (
          <div key={i} className="border-[0.5px] border-slate-200/50" />
        ))}
      </div>

      {/* Decorative World Elements */}
      <div className="absolute top-[20%] left-[15%] w-12 h-12 bg-emerald-100 rounded-xl border border-emerald-200 flex items-center justify-center opacity-40">
        <MapIcon className="w-6 h-6 text-emerald-500" />
      </div>

      {/* Activities nodes */}
      {allocatedActivities.map((act, i) => {
        const x = (i * 2 + 1) * 10;
        const y = (i * 3 + 2) * 10;
        
        return (
          <motion.div
            key={act.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute flex flex-col items-center gap-2"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
               act.category === 'skill' ? 'bg-indigo-500 border-indigo-400' :
               act.category === 'hobby' ? 'bg-emerald-500 border-emerald-400' :
               'bg-amber-500 border-amber-400'
            }`}>
               {act.category === 'skill' && <Zap className="w-6 h-6 text-white" />}
               {act.category === 'hobby' && <HeartPulse className="w-6 h-6 text-white" />}
               {act.category === 'social' && <Users className="w-6 h-6 text-white" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm text-slate-900 whitespace-nowrap">
              {act.name}
            </span>
          </motion.div>
        );
      })}

      {/* The Player (Avatar) */}
      <motion.div
        className="absolute w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl z-20"
        animate={{ 
          x: allocatedActivities.map((_, i) => `${(i * 2 + 1) * 10}%`),
          y: allocatedActivities.map((_, i) => `${(i * 3 + 2) * 10}%`),
        }}
        transition={{ 
          duration: 3.5, 
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <PersonStanding className="w-8 h-8 text-white animate-bounce" />
        <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
          {name || "Player"}
        </div>
      </motion.div>

      {/* Floating Status */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
         <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Executing Strategy...</span>
         </div>
      </div>
    </div>
  );
}
