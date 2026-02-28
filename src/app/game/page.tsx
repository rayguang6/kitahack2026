"use client";

import { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { ActivityCategory } from "@/types";
import { 
  Briefcase, Moon, Sun, Plus, Minus, UserPlus, 
  Sparkles, Coffee, Users, GraduationCap, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "work" | "freeTime" | "sleep";

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>("work");
  const [activeSidePanel, setActiveSidePanel] = useState<'social' | 'skills' | null>(null);
  
  const { 
    quarter, setQuarter, 
    workUpdate, activities, updateAllocation, remainingUnits, canProceed, 
    hobbyUnits, socialUnits,
    newActivityName, setNewActivityName, newActivityCategory, setNewActivityCategory, addCustomActivity,
    newFriendName, setNewFriendName, newFriendJob, setNewFriendJob, handleAddFriend,
    aiResult, setAiResult, setUnlockedOpportunity
  } = useSimulation();

  const handleNextPhase = () => {
    if (phase === "work") {
      setPhase("freeTime");
    } else if (phase === "freeTime") {
      // Mocking AI Result for MVP
      setAiResult({
        narrative: "Your consistent effort this quarter helped you build a steady routine and learn new things.",
        insight: "You've balanced your life quite well, though leaning slightly toward skill development.",
        suggestion: "Consider mixing in more social activities next time to broaden your network.",
        unlockedOpportunity: { name: "Weekend Workshop", category: "skill" }
      });
      setPhase("sleep");
    } else {
      // Sleep finishing -> Next Quarter
      if (aiResult?.unlockedOpportunity) {
        setUnlockedOpportunity({ 
          id: Math.random().toString(), 
          name: aiResult.unlockedOpportunity.name, 
          category: aiResult.unlockedOpportunity.category, 
          allocated: 0, 
          isOpportunity: true 
        });
      }
      setQuarter((q) => q + 1);
      setAiResult(null);
      setPhase("work");
    }
  };

  const getCategoryIcon = (cat: ActivityCategory) => {
    switch (cat) {
      case "skill": return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case "hobby": return <Coffee className="w-5 h-5 text-orange-500" />;
      case "social": return <Users className="w-5 h-5 text-pink-500" />;
    }
  };

  return (
    <>
      {/* TOP LEFT HUD */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-4 pointer-events-none">
        
        {/* HUD Box */}
        <div className="pointer-events-auto glass-morphism p-4 rounded-3xl border border-white/40 shadow-xl bg-white/70 backdrop-blur-xl min-w-[240px]">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center border border-indigo-100 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Year 1</span>
              <span className="font-black text-indigo-600 leading-none">Q{quarter}</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {phase === "work" && "Work Shift"}
                {phase === "freeTime" && "Free Time"}
                {phase === "sleep" && "Rest & Reflect"}
              </h2>
              <p className="text-xs text-slate-500 font-bold capitalize">
                {phase === "work" ? "Fixed 9-5" : phase === "freeTime" ? "Plan Schedule" : "AI Review"}
              </p>
            </div>
          </div>
          
          {/* Progress dots inside HUD */}
          <div className="flex gap-2 w-full mt-2">
            {["work", "freeTime", "sleep"].map((p) => (
              <div 
                key={p} 
                className={`h-1.5 rounded-full transition-all duration-300 shadow-inner ${
                  p === phase ? "flex-1 bg-indigo-500" : "flex-1 bg-slate-200"
                }`}
              />
            ))}
          </div>

          {phase === "freeTime" && (
            <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Energy Levels</span>
              <span className={`text-sm font-black ${remainingUnits === 0 ? 'text-emerald-500' : 'text-indigo-600'}`}>
                {remainingUnits} Units
              </span>
            </div>
          )}
        </div>

        {/* HUD Side Buttons */}
        <div className="pointer-events-auto flex flex-col gap-3">
          <button 
            onClick={() => setActiveSidePanel(p => p === 'social' ? null : 'social')}
            className={`glass-morphism p-3 rounded-2xl flex items-center gap-4 transition-all border shadow-sm ${activeSidePanel === 'social' ? 'bg-pink-50 border-pink-200 w-[240px]' : 'bg-white/70 border-white/40 hover:bg-white w-min md:w-[240px]'}`}
          >
            <div className={`p-2.5 rounded-xl shadow-inner ${activeSidePanel === 'social' ? 'bg-pink-100 text-pink-600' : 'bg-white text-slate-600 border border-slate-100'}`}>
              <Users className="w-5 h-5" />
            </div>
            <div className={`flex flex-col items-start leading-tight ${activeSidePanel === 'social' ? 'flex' : 'hidden md:flex'}`}>
              <span className="font-black text-slate-800 text-sm">Social & Network</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Add Connection</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveSidePanel(p => p === 'skills' ? null : 'skills')}
            className={`glass-morphism p-3 rounded-2xl flex items-center gap-4 transition-all border shadow-sm ${activeSidePanel === 'skills' ? 'bg-indigo-50 border-indigo-200 w-[240px]' : 'bg-white/70 border-white/40 hover:bg-white w-min md:w-[240px]'}`}
          >
            <div className={`p-2.5 rounded-xl shadow-inner ${activeSidePanel === 'skills' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-600 border border-slate-100'}`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className={`flex flex-col items-start leading-tight ${activeSidePanel === 'skills' ? 'flex' : 'hidden md:flex'}`}>
              <span className="font-black text-slate-800 text-sm">Skills & Hobbies</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Create Activity</span>
            </div>
          </button>
        </div>

        {/* Side Panels Content */}
        <AnimatePresence>
          {activeSidePanel === 'social' && (
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="pointer-events-auto glass-morphism p-6 rounded-3xl border border-white/60 shadow-2xl bg-white/90 backdrop-blur-2xl w-[320px] mt-2"
            >
              <h3 className="font-black text-slate-900 mb-5 flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-xl text-pink-600 shadow-inner">
                  <UserPlus className="w-5 h-5" />
                </div>
                New Connection
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Alex"
                    value={newFriendName}
                    onChange={e => setNewFriendName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-sm transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Industry / Job</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Designer"
                    value={newFriendJob}
                    onChange={e => setNewFriendJob(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-sm transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => {
                    handleAddFriend();
                    setActiveSidePanel(null);
                  }}
                  disabled={!newFriendName.trim() || !newFriendJob.trim()}
                  className="w-full py-3.5 bg-slate-900 hover:bg-pink-600 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-slate-900 text-sm shadow-xl shadow-slate-900/20"
                >
                  Add to Network
                </button>
              </div>
            </motion.div>
          )}

          {activeSidePanel === 'skills' && (
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="pointer-events-auto glass-morphism p-6 rounded-3xl border border-white/60 shadow-2xl bg-white/90 backdrop-blur-2xl w-[320px] mt-2"
            >
              <h3 className="font-black text-slate-900 mb-5 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 shadow-inner">
                  <Plus className="w-5 h-5" />
                </div>
                Custom Activity
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Activity Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Learn React"
                    value={newActivityName}
                    onChange={e => setNewActivityName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Category</label>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                    {(["skill", "hobby", "social"] as ActivityCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewActivityCategory(cat)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
                          newActivityCategory === cat 
                            ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    addCustomActivity();
                    setActiveSidePanel(null);
                  }}
                  disabled={!newActivityName.trim()}
                  className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-slate-900 text-sm shadow-xl shadow-slate-900/20"
                >
                  Create Activity
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CORE GAME LOOP MODAL (AT BOTTOM) */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 w-[95%] sm:w-full sm:max-w-[calc(100%-360px)] md:max-w-3xl ml-auto mr-auto md:mr-8 z-40 flex flex-col pointer-events-none pb-8 md:pb-10">
        <div className="pointer-events-auto max-h-[75vh] flex flex-col items-center">
          
          {/* Main Phase Container */}
          <div className="w-full overflow-y-auto custom-scrollbar rounded-[2rem]" style={{ overscrollBehavior: 'contain' }}>
            <AnimatePresence mode="wait">
              
              {/* PHASE 1: WORK */}
              {phase === "work" && (
                <motion.div 
                  key="work"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full glass-morphism rounded-[2rem] p-8 border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div className="bg-indigo-100 p-4 rounded-2xl shadow-inner border border-indigo-50">
                      <Briefcase className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Work Routine</h3>
                      <p className="text-slate-500 font-medium">Stability and baseline income</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400" />
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-500" /> Quarter Update
                    </h4>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      {workUpdate || "You had a standard quarter at work. You fulfilled your responsibilities and maintained steady progress."}
                    </p>
                  </div>

                  <button
                    onClick={handleNextPhase}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl shadow-slate-900/20 text-lg"
                  >
                    Proceed to Free Time <ChevronRight className="w-6 h-6" />
                  </button>
                </motion.div>
              )}

              {/* PHASE 2: FREE TIME */}
              {phase === "freeTime" && (
                <motion.div 
                  key="freeTime"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full glass-morphism rounded-[2rem] p-6 md:p-8 border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl flex flex-col gap-6"
                >
                  {/* Header info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-100 p-3 rounded-xl shadow-inner border border-orange-50">
                        <Sun className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">Free Time Allocation</h3>
                        <p className="text-sm font-bold text-slate-500">Plan your evenings and weekends</p>
                      </div>
                    </div>
                    {/* Requirements validation */}
                    <div className="flex gap-5 text-sm font-black bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className={`flex items-center gap-1.5 ${hobbyUnits > 0 ? "text-emerald-500" : "text-amber-500"}`}>
                        {hobbyUnits > 0 ? "✓ 1+ Hobby" : "⚠ Needs Hobby"}
                      </span>
                      <div className="w-px h-5 bg-slate-200" />
                      <span className={`flex items-center gap-1.5 ${socialUnits > 0 ? "text-emerald-500" : "text-amber-500"}`}>
                        {socialUnits > 0 ? "✓ 1+ Social" : "⚠ Needs Social"}
                      </span>
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="bg-white/50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="grid grid-cols-1 gap-3 max-h-[35vh] overflow-y-auto custom-scrollbar p-1">
                      {activities.map(act => (
                        <div key={act.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-4 w-full pr-4">
                            <div className={`p-3 rounded-xl shadow-inner ${act.category === 'skill' ? 'bg-indigo-50 border border-indigo-100/50' : act.category === 'hobby' ? 'bg-orange-50 border border-orange-100/50' : 'bg-pink-50 border border-pink-100/50'}`}>
                              {getCategoryIcon(act.category)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-base line-clamp-1">{act.name}</p>
                              <p className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${act.category === 'skill' ? 'text-indigo-400' : act.category === 'hobby' ? 'text-orange-400' : 'text-pink-400'}`}>
                                {act.category} {act.isOpportunity && "• Opportunity"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-200 shrink-0 shadow-inner gap-2">
                            <button 
                              onClick={() => updateAllocation(act.id, -1)}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 rounded-lg transition-colors text-slate-600 shadow-sm border border-slate-200 disabled:opacity-30 disabled:hover:bg-white"
                              disabled={act.allocated === 0}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-black text-slate-800 text-lg">{act.allocated}</span>
                            <button 
                              onClick={() => updateAllocation(act.id, 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 rounded-lg transition-colors text-slate-600 shadow-sm border border-slate-200 disabled:opacity-30 disabled:hover:bg-white"
                              disabled={remainingUnits === 0}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleNextPhase}
                    disabled={!canProceed}
                    className={`mt-2 w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-lg ${
                      canProceed 
                        ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl shadow-slate-900/20" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Finish Quarter & Go to Sleep <Moon className="w-6 h-6" />
                  </button>
                </motion.div>
              )}

              {/* PHASE 3: SLEEP / AI INSIGHT */}
              {phase === "sleep" && (
                <motion.div 
                  key="sleep"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full glass-morphism rounded-[2rem] p-8 border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div className="bg-indigo-900 p-4 rounded-2xl shadow-inner border border-indigo-800">
                      <Moon className="w-8 h-8 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Quarter Reflection</h3>
                      <p className="text-slate-500 font-bold">AI-driven insights from your actions</p>
                    </div>
                  </div>

                  {aiResult && (
                    <div className="space-y-6 mb-8">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-400" />
                        <h4 className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-3">Narrative</h4>
                        <p className="text-slate-800 italic leading-relaxed text-lg font-medium">"{aiResult.narrative}"</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Insight</h4>
                          <p className="text-slate-700 font-bold">{aiResult.insight}</p>
                        </div>
                        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-inner">
                          <h4 className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-2">Suggestion</h4>
                          <p className="text-slate-800 font-bold">{aiResult.suggestion}</p>
                        </div>
                      </div>

                      {aiResult.unlockedOpportunity && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-start gap-4 shadow-sm"
                        >
                          <Sparkles className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Opportunity Unlocked</h4>
                            <p className="text-slate-800 font-bold text-sm">You've unlocked <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded ml-1">{aiResult.unlockedOpportunity.name}</span> for the next quarter!</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleNextPhase}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl shadow-indigo-600/30 text-lg"
                  >
                    Wake Up (Start Quarter {quarter + 1}) <Sun className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

