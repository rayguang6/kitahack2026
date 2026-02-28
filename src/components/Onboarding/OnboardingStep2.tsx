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
      className="w-full max-w-2xl space-y-8"
    >
      <div className="text-center space-y-2 relative">
        <button 
          onClick={() => router.push("/onboarding")} 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-500 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Personality</h1>
        <p className="text-slate-500 font-medium">Tell us more about yourself <span className="text-slate-400 font-normal">(Optional)</span></p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 ml-1">Biography</label>
          <textarea 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            placeholder="Describe your goals or personality..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none h-32 resize-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
            MBTI Type
            {mbti && <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{mbti}</span>}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setMbti(mbti === type ? "" : type)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  mbti === type 
                    ? "bg-emerald-600 text-white shadow-md" 
                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
            Social Preference
            {socialPref && <span className="text-xs text-slate-600 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{socialPref}</span>}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SOCIAL_PREFS.map((pref) => (
              <button
                key={pref}
                onClick={() => setSocialPref(socialPref === pref ? "" : pref)}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  socialPref === pref 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-center border-t border-slate-100 mt-6">
          <button
            onClick={() => {
              startQuarter1();
              router.push("/game");
            }}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-700 transition-all"
          >
            <span>Start Game</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
