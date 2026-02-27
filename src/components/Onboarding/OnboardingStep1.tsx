"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, ArrowRight } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { DEFAULT_INTERESTS } from "@/constants";

export function OnboardingStep1() {
  const {
    name, setName, age, setAge, gender, setGender,
    occupationType, setOccupationType, occupationDetail, setOccupationDetail,
    interests, customInterest, setCustomInterest,
    isStudent, toggleInterest, addCustomInterest, setStep
  } = useSimulation();

  return (
    <motion.div 
      key="onboarding-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Character Creation</h1>
        <p className="text-slate-500 font-medium">Please enter your basic details</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" placeholder="24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 ml-1">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {["Male", "Female"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g as "Male" | "Female")}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    gender === g 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 ml-1">Current Status</label>
            <div className="grid grid-cols-2 gap-2">
              {["Working", "Student"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setOccupationType(type as "Working" | "Student");
                    setOccupationDetail("");
                  }}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    occupationType === type 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {occupationType !== "" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 pt-6 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500"/> 
                {isStudent ? "What are you studying?" : "What is your job?"}
              </label>
              <input 
                type="text" 
                value={occupationDetail} 
                onChange={(e) => setOccupationDetail(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" 
                placeholder={isStudent ? "e.g. Computer Science" : "e.g. Software Engineer"} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 pt-6 border-t border-slate-100">
          <label className="text-sm font-semibold text-slate-700 ml-1">Your Interests</label>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_INTERESTS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  interests.includes(tag)
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {tag}
              </button>
            ))}
            {interests.filter(i => !DEFAULT_INTERESTS.includes(i)).map(tag => (
              <button key={tag} onClick={() => toggleInterest(tag)} className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white flex items-center gap-2">
                {tag} <span className="opacity-70 text-xs">✕</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <input type="text" value={customInterest} onChange={(e) => setCustomInterest(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Add custom interest..." />
            <button onClick={addCustomInterest} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors">Add</button>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-center">
        <button
          onClick={() => setStep("onboarding-2")}
          disabled={!name || !age || !gender || !occupationType || !occupationDetail}
          className="w-full max-w-sm py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
