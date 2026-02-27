"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Briefcase, Clock, HeartPulse, Sparkles, Zap, Users, ArrowRight } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { ActivityCategory } from "@/types";

export function QuarterPlanning() {
  const {
    quarter, skillTags, workUpdate, remainingUnits, totalAllocated,
    canProceed, activities, updateAllocation, newActivityName, setNewActivityName,
    newActivityCategory, setNewActivityCategory, addCustomActivity,
    friends, showFriendPanel, setShowFriendPanel, newFriendName, setNewFriendName,
    newFriendJob, setNewFriendJob, handleAddFriend, startSimulation
  } = useSimulation();

  const catColors: Record<ActivityCategory, string> = {
    skill: "bg-indigo-50 text-indigo-700 border-indigo-200",
    hobby: "bg-emerald-50 text-emerald-700 border-emerald-200",
    social: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <motion.div
      key="quarter"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl space-y-8"
    >
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quarter {quarter}</h1>
          <p className="text-slate-500 font-medium">Plan your activities for this quarter</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          {skillTags.slice(0, 4).map((tag, i) => (
            <span key={`${tag}-${i}`} className="bg-white text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context & Mandatory */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
             <div className="flex items-center gap-3">
               <Briefcase className="w-5 h-5 text-slate-400" />
               <h3 className="font-bold text-slate-800 text-sm">Work Update</h3>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
               <p className="text-slate-600 text-sm leading-relaxed">{workUpdate}</p>
             </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm">Social Network</h3>
              </div>
              <button 
                onClick={() => setShowFriendPanel(!showFriendPanel)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {showFriendPanel ? "Cancel" : "Add Friend"}
              </button>
            </div>

            <AnimatePresence>
              {showFriendPanel && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                   <input type="text" placeholder="Name" value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 outline-none" />
                   <input type="text" placeholder="Job" value={newFriendJob} onChange={(e) => setNewFriendJob(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 outline-none" />
                   <button onClick={handleAddFriend} className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-bold hover:bg-indigo-700 transition-all">Add</button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-2">
              {friends.map(f => (
                <div key={f.id} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex flex-col min-w-[100px]">
                  <span className="text-xs font-bold text-slate-800">{f.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{f.job}</span>
                </div>
              ))}
              {friends.length === 0 && <p className="text-xs text-slate-400 italic">No friends yet.</p>}
            </div>
          </section>
        </div>

        {/* Right Column: Allocation */}
        <div className="lg:col-span-8">
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-indigo-500" />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Time Available</h3>
                  <p className="text-xs text-slate-500 font-medium">Units to spend</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className={`text-3xl font-bold ${remainingUnits === 0 ? "text-emerald-600" : "text-indigo-600"}`}>
                    {remainingUnits}
                  </span>
                  <span className="text-slate-400 font-bold ml-1 text-xs">Units</span>
                </div>
                <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalAllocated / 8) * 100}%` }}
                    className={`h-full ${remainingUnits === 0 ? "bg-emerald-500" : "bg-indigo-500"}`} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {activities.map((act) => (
                  <motion.div 
                    key={act.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      act.allocated > 0 
                        ? (act.category === 'skill' ? 'bg-indigo-50 border-indigo-200' : 
                           act.category === 'hobby' ? 'bg-emerald-50 border-emerald-200' : 
                           'bg-amber-50 border-amber-200')
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                         act.allocated > 0 ? 'bg-white shadow-sm' : 'bg-slate-50'
                      }`}>
                         {act.category === 'skill' && <Zap className={`w-4 h-4 ${act.allocated > 0 ? 'text-indigo-500' : 'text-slate-300'}`} />}
                         {act.category === 'hobby' && <HeartPulse className={`w-4 h-4 ${act.allocated > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />}
                         {act.category === 'social' && <Users className={`w-4 h-4 ${act.allocated > 0 ? 'text-amber-500' : 'text-slate-300'}`} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <span className={`font-bold text-base ${act.allocated > 0 ? "text-slate-900" : "text-slate-400"}`}>
                             {act.name}
                           </span>
                           {act.isOpportunity && <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/40 rounded-xl p-1.5 border border-slate-200/60 transition-all">
                      <button onClick={() => updateAllocation(act.id, -1)} disabled={act.allocated === 0} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 disabled:opacity-30 border border-slate-200 font-bold">
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-slate-900">{act.allocated}</span>
                      <button onClick={() => updateAllocation(act.id, 1)} disabled={remainingUnits === 0} className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30 font-bold">
                        +
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-300">
               <input type="text" value={newActivityName} onChange={(e) => setNewActivityName(e.target.value)} placeholder="Add custom activity..." className="flex-1 bg-transparent border-none px-4 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400" onKeyDown={(e) => e.key === 'Enter' && addCustomActivity()} />
               <select value={newActivityCategory} onChange={(e) => setNewActivityCategory(e.target.value as ActivityCategory)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none">
                 <option value="skill">Skill</option>
                 <option value="hobby">Hobby</option>
                 <option value="social">Social</option>
               </select>
               <button onClick={addCustomActivity} disabled={!newActivityName.trim()} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all">
                 Add
               </button>
            </div>

            {/* Validation & Action */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
               <AnimatePresence>
                {remainingUnits === 0 && (!canProceed) && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-red-600 text-xs font-semibold bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                    <HeartPulse className="w-4 h-4 text-red-500" />
                    <span>You need at least 1 unit in Hobby and 1 unit in Social to stay healthy.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={startSimulation}
                disabled={!canProceed}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <span>Submit</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
