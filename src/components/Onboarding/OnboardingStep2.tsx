"use client";

import { motion } from "framer-motion";
import { Brain, ChevronLeft, ArrowRight, Zap } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { MBTI_TYPES, SOCIAL_PREFS } from "@/constants";
import { useRouter } from "next/navigation";

export function OnboardingStep2() {
  const router = useRouter();
  const {
    bio, setBio, mbti, setMbti, socialPref, setSocialPref,
    startQuarter1
  } = useSimulation();

  return (
    <motion.div 
      key="onboarding-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto space-y-4"
    >
      <div className="text-center space-y-1 relative">
        <button 
          onClick={() => router.push("/onboarding")} 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all text-slate-500 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Personality</h1>
        <p className="text-sm font-medium text-slate-500">Tell us about yourself <span className="text-slate-400 font-normal">(Optional)</span></p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Biography</label>
          <textarea 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            placeholder="Describe your goals or personality..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none h-20 resize-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            MBTI Type
            {mbti && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{mbti}</span>}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setMbti(mbti === type ? "" : type)}
                className={`py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  mbti === type 
                    ? "bg-emerald-600 text-white" 
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            Social Preference
            {socialPref && <span className="text-[10px] text-slate-600 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">{socialPref}</span>}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SOCIAL_PREFS.map((pref) => (
              <button
                key={pref}
                onClick={() => setSocialPref(socialPref === pref ? "" : pref)}
                className={`py-2 rounded-lg text-xs font-medium transition-all ${
                  socialPref === pref 
                    ? "bg-slate-900 text-white" 
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-center mt-2">
          <button
            onClick={() => {
              startQuarter1();
              router.push("/game");
            }}
            className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
          >
            <span>Start Game</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
