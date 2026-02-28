"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const router = useRouter();

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center w-full max-w-lg m-auto bg-slate-900/40 backdrop-blur-md text-slate-50 p-10 rounded-3xl shadow-2xl relative overflow-hidden border border-white/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">
            Freedom Path
          </h1>
          <p className="text-lg text-slate-300">
            Simulate an economy, make life choices, and shape your ultimate destiny in this immersive sandbox experience.
          </p>
        </div>

        {/* Temporary placeholder image / avatar */}
        <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <span className="text-6xl">🌍</span>
        </div>

        <button
          onClick={() => router.push("/onboarding")}
          className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/50 flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative">Start Game</span>
          <Play className="w-5 h-5 relative" />
        </button>
      </div>
    </motion.div>
  );
}
