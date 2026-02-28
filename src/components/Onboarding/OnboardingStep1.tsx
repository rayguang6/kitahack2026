"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ArrowRight, GraduationCap } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { DEFAULT_INTERESTS } from "@/constants";
import { useRouter } from "next/navigation";

const MaleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="14" r="5" />
    <line x1="13.54" y1="10.46" x2="21" y2="3" />
    <line x1="16" y1="3" x2="21" y2="3" />
    <line x1="21" y1="8" x2="21" y2="3" />
  </svg>
);

const FemaleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="10" r="5" />
    <line x1="12" y1="15" x2="12" y2="22" />
    <line x1="9" y1="19" x2="15" y2="19" />
  </svg>
);

export function OnboardingStep1() {
  const router = useRouter();
  const {
    name, setName, age, setAge, gender, setGender,
    occupationType, setOccupationType, occupationDetail, setOccupationDetail,
    interests, customInterest, setCustomInterest,
    isStudent, toggleInterest, addCustomInterest
  } = useSimulation();

  return (
    <motion.div 
      key="onboarding-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto space-y-4"
    >
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Character Creation</h1>
        <p className="text-sm text-slate-500">Please enter your basic details</p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" placeholder="Your Name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" placeholder="24" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                key="Male"
                onClick={() => setGender("Male")}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-all ${
                  gender === "Male" 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <MaleIcon className="w-4 h-4" />
                Male
              </button>
              <button
                key="Female"
                onClick={() => setGender("Female")}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-all ${
                  gender === "Female" 
                    ? "bg-pink-500 text-white" 
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-pink-300 hover:bg-pink-50"
                }`}
              >
                <FemaleIcon className="w-4 h-4" />
                Female
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Current Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                key="Working"
                onClick={() => {
                  setOccupationType("Working");
                  setOccupationDetail("");
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-all ${
                  occupationType === "Working" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Work
              </button>
              <button
                key="Student"
                onClick={() => {
                  setOccupationType("Student");
                  setOccupationDetail("");
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-all ${
                  occupationType === "Student" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Study
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {occupationType !== "" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500"/> 
                {isStudent ? "What are you studying?" : "What is your job?"}
              </label>
              <input 
                type="text" 
                value={occupationDetail} 
                onChange={(e) => setOccupationDetail(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" 
                placeholder={isStudent ? "e.g. Computer Science" : "e.g. Software Engineer"} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-700">Interests</label>
          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_INTERESTS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  interests.includes(tag)
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {tag}
              </button>
            ))}
            {interests.filter(i => !DEFAULT_INTERESTS.includes(i)).map(tag => (
              <button key={tag} onClick={() => toggleInterest(tag)} className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white flex items-center gap-1.5">
                {tag} <span className="opacity-70 text-[10px]">✕</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <input type="text" value={customInterest} onChange={(e) => setCustomInterest(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Custom interest..." />
            <button onClick={addCustomInterest} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">Add</button>
          </div>
        </div>

        <div className="pt-2 flex justify-center mt-2">
          <button
            onClick={() => router.push("/onboarding/step-2")}
            disabled={!name || !age || !gender || !occupationType || !occupationDetail}
            className="w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
