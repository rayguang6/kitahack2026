"use client";

import { useState, useEffect } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { ActivityCategory, Activity, Opportunity, SuggestedPath } from "@/types";
import { 
  Briefcase, Moon, Sun, Plus, Minus, UserPlus, Sparkles, Coffee, 
  Users, GraduationCap, ChevronRight, Zap as LucideZap, ChevronDown, Trophy, RotateCcw,
  BookOpen, Rocket, Compass, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionMentor } from "@/components/Simulation/ActionMentor";
import { SIMULATION_DURATION_MS, WORK_UPDATES, DREAM_AWARE_WORK_TIPS } from "@/constants";



export default function GamePage() {
  const [activeSidePanel, setActiveSidePanel] = useState<'social' | 'skills' | 'path' | null>(null);
  const [isSocialExpanded, setIsSocialExpanded] = useState(true);
  const [simulationQueue, setSimulationQueue] = useState<Activity[]>([]);
  const [currentSimulationIndex, setCurrentSimulationIndex] = useState(0);
  const [quarterHistory, setQuarterHistory] = useState<Array<{ quarter: number; activities: Activity[]; aiResult: { narrative: string; insight: string; suggestion: string; knowledge_gained?: string[]; opportunities?: Opportunity[] } | null }>>([]);
  const [showEndGame, setShowEndGame] = useState(false);
  const [customDreamPath, setCustomDreamPath] = useState("");
  const [workSkillsGained, setWorkSkillsGained] = useState<string[]>([]);
  const [workKnowledgeGained, setWorkKnowledgeGained] = useState<string[]>([]);
  const [workDreamTip, setWorkDreamTip] = useState<string>("");
  
  const { 
    phase, setPhase,
    isSimulating, setIsSimulating,
    workProgress, setWorkProgress,
    workDone, setWorkDone,
    quarter, setQuarter, 
    workUpdate, activities, updateAllocation, remainingUnits, totalAllocated,
    hobbyUnits, socialUnits,
    newActivityName, setNewActivityName, newActivityCategory, setNewActivityCategory, addCustomActivity,
    newFriendName, setNewFriendName, newFriendGender, setNewFriendGender, newFriendJob, setNewFriendJob, newFriendDesc, setNewFriendDesc, handleAddFriend,
    friends, 
    skillTags, setSkillTags, knowledgeTags, setKnowledgeTags, dreamPath, setDreamPath,
    newSkillName, setNewSkillName, handleAddSkillTag,
    aiResult, setAiResult, setUnlockedOpportunity,
    gamePhase, setGamePhase, setAiActionChoices,
    selectedAction, setSelectedAction,
    name, occupationType, occupationDetail, interests,
    handleRestart
  } = useSimulation();

  const hasFriends = friends.length > 0;
  const effectiveCanProceed = remainingUnits === 0 && hobbyUnits >= 1 && (!hasFriends || socialUnits >= 1);

  // Apply work skills/knowledge when work is completed (rare — most updates give nothing)
  useEffect(() => {
    if (workDone && phase === "work") {
      const wu = WORK_UPDATES[Math.floor(Math.random() * WORK_UPDATES.length)];
      // Only set if the update actually has a skill or knowledge (most don't)
      const gainedSkills = wu.skill ? [wu.skill] : [];
      const gainedKnowledge = wu.knowledge ? [wu.knowledge] : [];
      setWorkSkillsGained(gainedSkills);
      setWorkKnowledgeGained(gainedKnowledge);
      if (wu.skill) {
        setSkillTags((prev: string[]) => Array.from(new Set([...prev, wu.skill!])));
      }
      if (wu.knowledge) {
        setKnowledgeTags((prev: string[]) => Array.from(new Set([...prev, wu.knowledge!])));
      }

      // Dream-path-aware tip
      if (dreamPath && DREAM_AWARE_WORK_TIPS[dreamPath]) {
        const tips = DREAM_AWARE_WORK_TIPS[dreamPath];
        setWorkDreamTip(tips[Math.floor(Math.random() * tips.length)]);
      } else {
        setWorkDreamTip("");
      }
    }
  }, [workDone, phase]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (phase === "work" && isSimulating) {
      // Delay simulating progress to allow character to walk to the office first
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          setWorkProgress(prev => {
            if (prev >= 100) {
              setIsSimulating(false);
              clearInterval(interval);
              return 100;
            }
            return prev + 1;
          });
        }, 20); // 2 seconds for the simulation (20ms * 100)
      }, 1000); // 1s delay for walking
    } else if (phase === "freeTime" && gamePhase === "simulating" && isSimulating && selectedAction) {
      const totalMs = SIMULATION_DURATION_MS; // Consistent 2 seconds (or whatever is set) per action
      const updateInterval = 50;
      const stepsCount = totalMs / updateInterval;
      const stepValue = 100 / stepsCount;

      timeout = setTimeout(() => {
        interval = setInterval(() => {
          setWorkProgress(prev => {
            if (prev + stepValue >= 100) {
              setIsSimulating(false);
              clearInterval(interval);
              return 100;
            }
            return prev + stepValue;
          });
        }, updateInterval);
      }, 1500); // 1.5s delay for walking
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [phase, isSimulating, setIsSimulating, setWorkProgress, gamePhase, selectedAction]);

  // Effect to handle freeTime simulation finish
  useEffect(() => {
    if (phase === "freeTime" && gamePhase === "simulating" && !isSimulating && workProgress >= 100) {
      if (currentSimulationIndex < simulationQueue.length - 1) {
        // Move to the next simulation
        const nextIndex = currentSimulationIndex + 1;
        setCurrentSimulationIndex(nextIndex);
        const nextActivity = simulationQueue[nextIndex];
        const actionType = nextActivity.category === 'skill' ? 'learning' : nextActivity.category === 'social' ? 'social' : 'hobby';

        setSelectedAction({
            title: nextActivity.name,
            type: actionType,
            description: `Allocated ${nextActivity.allocated} units of time to ${nextActivity.name}`,
            allocated: nextActivity.allocated,
            categoryId: nextActivity.id
        });
        setWorkProgress(0);
        setIsSimulating(true);
      } else {
        // Proceed to sleep and evaluate
        setPhase("sleep");
        setGamePhase("idle");
        
        setAiResult(null);
        fetch("/api/evaluate-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name,
            occupationType,
            occupationDetail,
            skillTags,
            knowledgeTags,
            friends,
            quarter,
            dreamPath,
            activities: simulationQueue,
          })
        })
        .then(res => res.json())
        .then(data => {
          const newResult = {
            narrative: data.narrative,
            insight: data.insight || (data.skills_improved?.length > 0 ? `Skills improved: ${data.skills_improved.join(', ')}` : 'You made steady progress this quarter.'),
            suggestion: data.suggestion || 'Keep building momentum next quarter.',
            knowledge_gained: data.knowledge_gained || [],
            opportunities: data.opportunities || []
          };
          setAiResult({
            ...newResult,
            knowledge_gained: data.knowledge_gained,
            suggested_paths: data.suggested_paths || [],
            opportunities: data.opportunities?.map((opp: { title: string; description: string; reasoning: string; confidence: string; based_on?: { skills: string[]; knowledge: string[]; friends: string[] }; based_on_skills?: string[]; based_on_knowledge?: string[]; based_on_friends?: string[] }) => ({
              ...opp,
              based_on: opp.based_on || {
                skills: opp.based_on_skills || [],
                knowledge: opp.based_on_knowledge || [],
                friends: opp.based_on_friends || []
              }
            }))
          });
          setQuarterHistory(prev => [...prev, { quarter, activities: simulationQueue, aiResult: newResult }]);
          if (data.skills_improved) {
             setSkillTags((prev: string[]) => Array.from(new Set([...prev, ...data.skills_improved])));
          }
          if (data.knowledge_gained) {
             setKnowledgeTags((prev: string[]) => Array.from(new Set([...prev, ...data.knowledge_gained])));
          }
        })
        .catch(err => {
          console.error(err);
          const fallback = {
            narrative: `You spent Quarter ${quarter} working hard and making progress. Every action you took brought you closer to your goals.`,
            insight: "You showed consistent focus this quarter.",
            suggestion: "Keep the momentum going into next quarter."
          };
          setAiResult(fallback);
          setQuarterHistory(prev => [...prev, { quarter, activities: simulationQueue, aiResult: fallback }]);
        });
      }
    }
  }, [phase, gamePhase, isSimulating, workProgress, selectedAction, setAiResult, setPhase, setGamePhase, setSkillTags, currentSimulationIndex, simulationQueue, setSelectedAction, setWorkProgress, setIsSimulating]);

  const getCategoryIcon = (cat: ActivityCategory) => {
    switch (cat) {
      case "skill": return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case "hobby": return <Coffee className="w-5 h-5 text-orange-500" />;
      case "social": return <Users className="w-5 h-5 text-pink-500" />;
    }
  };

  const handleConsultAI = async () => {
    // Don't overwrite gamePhase if simulation is already running
    if (gamePhase === "simulating") return;
    setGamePhase("generating");
    try {
      const res = await fetch("/api/generate-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name,
          occupationType,
          occupationDetail,
          skills: skillTags,
          knowledgeTags,
          friends,
          quarter,
          interests,
          dreamPath
        })
      });
      const data = await res.json();
      // Only update gamePhase if we're not already simulating
      // (the user may have started the simulation while the AI was generating)
      if (data.actions) {
        setAiActionChoices(data.actions);
        setGamePhase(prev => prev === "simulating" ? prev : "selecting_action");
      } else {
        setGamePhase(prev => prev === "simulating" ? prev : "idle");
      }
    } catch (e) {
      console.error(e);
      setGamePhase(prev => prev === "simulating" ? prev : "idle");
    }
  };

  const handleNextPhase = () => {
    if (phase === "work") {
      setWorkDone(false);
      setPhase("freeTime");
      // Auto trigger AI action suggestions when entering free time
      handleConsultAI();
    } else if (phase === "freeTime") {
        const activitiesToSimulate = [...activities].filter(a => a.allocated > 0).sort((a,b) => b.allocated - a.allocated);
        
        if (activitiesToSimulate.length > 0) {
          setSimulationQueue(activitiesToSimulate);
          setCurrentSimulationIndex(0);
          
          const nextActivity = activitiesToSimulate[0];
          const actionType = nextActivity.category === 'skill' ? 'learning' : nextActivity.category === 'social' ? 'social' : 'hobby';
          
          setSelectedAction({
             title: nextActivity.name,
             type: actionType,
             description: `Allocated ${nextActivity.allocated} units of time to ${nextActivity.name}`,
             allocated: nextActivity.allocated,
             categoryId: nextActivity.id
          });
          
          setGamePhase("simulating");
          setWorkProgress(0);
          setIsSimulating(true);
        } else {
          setPhase("sleep");
        }
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
      setWorkDone(false);
      setWorkProgress(0);
      setIsSimulating(true);
      setGamePhase("idle");
      setPhase("work");
    }
  };

  // Player voluntarily chooses to end their journey
  const handleEndGame = () => {
    setShowEndGame(true);
  };

  const handleFullRestart = () => {
    setShowEndGame(false);
    setQuarterHistory([]);
    handleRestart();
  };

  return (
    <>
      <ActionMentor />
      {/* OutcomeModal is now disabled since we show conclusion in sleep phase */}
      {/* <OutcomeModal /> */}
      
      {/* TOP LEFT HUD */}
      <div className="absolute top-3 md:top-4 left-3 md:left-4 z-50 flex flex-col gap-3 md:gap-4 pointer-events-none max-h-[calc(100vh-120px)] overflow-hidden">
        
        {/* HUD Box */}
        <div className="pointer-events-auto glass-morphism p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/40 shadow-xl bg-white/70 backdrop-blur-xl min-w-[200px] md:min-w-[240px]">
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex flex-col items-center justify-center border border-indigo-100 shadow-sm shrink-0">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase leading-none">Year 1</span>
              <span className="font-black text-indigo-600 leading-none text-sm md:text-base">Q{quarter}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-base md:text-lg font-black text-slate-900 leading-tight truncate">
                {phase === "work" && "Work"}
                {phase === "freeTime" && "Building Dreams"}
                {phase === "sleep" && "Sleep"}
              </h2>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold capitalize">
                {phase === "work" ? "8 AM - 4 PM" : phase === "freeTime" ? "4 PM - 12 AM" : "12 AM - 8 AM"}
              </p>
            </div>
          </div>
          
          {/* Progress dots inside HUD */}
          <div className="flex gap-2 w-full mt-1 md:mt-2">
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
            <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-slate-200/50 flex flex-col gap-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
               <span className="text-sm font-black text-indigo-600">
                 {gamePhase === "idle" ? "Ready" : gamePhase === "generating" ? "Consulting AI..." : gamePhase === "selecting_action" ? "Choosing..." : "Simulating..."}
               </span>
            </div>
          )}
        </div>

        {/* HUD Side Buttons */}
        <div className="pointer-events-auto flex flex-col gap-3 md:gap-4 w-[200px] md:w-[240px]">
          
          {/* SOCIAL SECTION */}
          <div className="glass-morphism p-3 rounded-2xl border border-white/40 shadow-sm bg-white/70 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsSocialExpanded(!isSocialExpanded)}
                className="flex items-center gap-2 hover:opacity-75 transition-opacity outline-none"
              >
                <div className="p-1.5 rounded-lg shadow-inner bg-pink-100 text-pink-600">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-800 text-xs md:text-sm">Social</span>
                {friends.length > 0 && (
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSocialExpanded ? "rotate-180" : ""}`} />
                )}
              </button>
              
              <button 
                onClick={() => setActiveSidePanel(p => p === 'social' ? null : 'social')}
                className={`p-1.5 rounded-lg transition-all border shadow-sm ${activeSidePanel === 'social' ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600' : 'bg-white text-slate-500 hover:bg-pink-50 hover:text-pink-600 border-white/60'}`}
                title="Add Connection"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded Friends List */}
            <AnimatePresence>
              {isSocialExpanded && friends.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5 overflow-hidden"
                >
                  {friends.map((f, i) => (
                    <div key={f.id} className="flex items-center gap-2.5 bg-white/60 p-1.5 rounded-xl border border-slate-200/50 shadow-sm">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-inner">
                        <img 
                          src={`/images/avatars/${f.gender.toLowerCase()}${i + 1}.png`}
                          alt={f.name}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: '0px 0px', imageRendering: 'pixelated' }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{f.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold truncate leading-none">{f.gender === 'Male' ? '♂' : '♀'} {f.job}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SKILLS SECTION */}
          <div className="glass-morphism p-3 rounded-2xl border border-white/40 shadow-sm bg-white/70 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg shadow-inner bg-indigo-100 text-indigo-600">
                  <LucideZap className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-800 text-xs md:text-sm">Skills</span>
              </div>
              
              <button 
                onClick={() => setActiveSidePanel(p => p === 'skills' ? null : 'skills')}
                className={`p-1.5 rounded-lg transition-all border shadow-sm ${activeSidePanel === 'skills' ? 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600' : 'bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border-white/60'}`}
                title="Add Expertise"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Skills List (No Toggle needed as requested) */}
            {skillTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skillTags.map((skill, idx) => (
                  <div 
                    key={idx}
                    className="px-2 py-1 bg-white/60 border border-indigo-100/50 text-indigo-700 text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KNOWLEDGE SECTION */}
          <div className="glass-morphism p-3 rounded-2xl border border-white/40 shadow-sm bg-white/70 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg shadow-inner bg-amber-100 text-amber-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-black text-slate-800 text-xs md:text-sm">Knowledge</span>
            </div>
            {knowledgeTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {knowledgeTags.map((knowledge, idx) => (
                  <div 
                    key={idx}
                    className="px-2 py-1 bg-white/60 border border-amber-100/50 text-amber-700 text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-amber-400 rounded-full" />
                    {knowledge}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[9px] text-slate-400 font-bold italic">Gained from friends & activities</p>
            )}
          </div>

          {/* DREAM PATH SECTION */}
          <div className="glass-morphism p-3 rounded-2xl border border-white/40 shadow-sm bg-white/70 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg shadow-inner bg-purple-100 text-purple-600">
                  <Target className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-800 text-xs md:text-sm">Dream Path</span>
              </div>
              
              <button 
                onClick={() => {
                  if (activeSidePanel !== 'path') setCustomDreamPath(dreamPath || "");
                  setActiveSidePanel(p => p === 'path' ? null : 'path')
                }}
                className={`p-1.5 rounded-lg transition-all border shadow-sm ${activeSidePanel === 'path' ? 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600' : 'bg-white text-slate-500 hover:bg-purple-50 hover:text-purple-600 border-white/60'}`}
                title="Edit Dream Path"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {dreamPath ? (
              <div className="px-2 py-1.5 bg-white/60 border border-purple-100/50 text-purple-700 text-xs font-bold rounded-lg shadow-sm truncate">
                {dreamPath}
              </div>
            ) : (
              <p className="text-[9px] text-slate-400 font-bold italic">No specific path set.</p>
            )}
          </div>
        </div>

        {/* Side Panels Content */}
        <AnimatePresence>
          {activeSidePanel === 'social' && (
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="pointer-events-auto glass-morphism p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/60 shadow-2xl bg-white/90 backdrop-blur-2xl w-[280px] md:w-[320px] mt-1 md:mt-2 max-h-[50vh] overflow-y-auto custom-scrollbar"
            >
              <h3 className="font-black text-slate-900 mb-1 flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-xl text-pink-600 shadow-inner shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                New Connection
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mb-4 md:mb-5 ml-12">{friends.length}/5 Friends</p>

              {friends.length >= 5 ? (
                <div className="text-center py-4">
                  <p className="text-sm font-bold text-slate-500">Maximum friends reached!</p>
                  <p className="text-xs text-slate-400 mt-1">You can have up to 5 friends.</p>
                </div>
              ) : (
                <div className="space-y-2.5 md:space-y-3">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Name</label>
                    <input 
                      type="text" 
                      placeholder="E.g. Alex"
                      value={newFriendName}
                      onChange={e => setNewFriendName(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-sm transition-all shadow-sm"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Gender</label>
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl md:rounded-2xl border border-slate-200 shadow-inner">
                      {(["Male", "Female"] as const).map(g => (
                        <button
                          key={g}
                          onClick={() => setNewFriendGender(g)}
                          className={`flex-1 py-1.5 md:py-2 text-xs font-bold rounded-lg md:rounded-xl capitalize transition-all ${
                            newFriendGender === g
                              ? "bg-white text-pink-600 shadow-sm border border-slate-200/50"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {g === "Male" ? "♂ Male" : "♀ Female"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Occupation</label>
                    <input 
                      type="text" 
                      placeholder="E.g. Designer"
                      value={newFriendJob}
                      onChange={e => setNewFriendJob(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-sm transition-all shadow-sm"
                    />
                  </div>

                  {/* Description (optional) */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Description <span className="text-slate-300">(optional)</span></label>
                    <textarea
                      placeholder="E.g. Met at a coffee shop..."
                      value={newFriendDesc}
                      onChange={e => setNewFriendDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-sm transition-all shadow-sm resize-none"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      handleAddFriend();
                      setActiveSidePanel(null);
                    }}
                    disabled={!newFriendName.trim() || !newFriendJob.trim()}
                    className="w-full py-2.5 md:py-3 bg-slate-900 hover:bg-pink-600 text-white font-bold rounded-xl md:rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-slate-900 text-sm shadow-xl shadow-slate-900/20"
                  >
                    Add to Social
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeSidePanel === 'skills' && (
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="pointer-events-auto glass-morphism p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/60 shadow-2xl bg-white/90 backdrop-blur-2xl w-[280px] md:w-[320px] mt-1 md:mt-2 max-h-[50vh] overflow-y-auto custom-scrollbar"
            >
              <h3 className="font-black text-slate-900 mb-4 md:mb-5 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 shadow-inner shrink-0">
                  <LucideZap className="w-5 h-5" />
                </div>
                Skills & Tags
              </h3>

              <div className="space-y-4 md:space-y-5">
                {/* Add New Skill */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Add New Tag</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="E.g. Creative Writing"
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      onKeyDown={e => {
                        if(e.key === 'Enter') {
                          handleAddSkillTag();
                          setActiveSidePanel(null);
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all shadow-sm group-hover:border-slate-300"
                    />
                    <button 
                      onClick={() => {
                        handleAddSkillTag();
                        setActiveSidePanel(null);
                      }}
                      disabled={!newSkillName.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-2 ml-1 italic">Press enter or click + to add</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSidePanel === 'path' && (
            <motion.div 
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="pointer-events-auto glass-morphism p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/60 shadow-2xl bg-white/90 backdrop-blur-2xl w-[280px] md:w-[320px] mt-1 md:mt-2 max-h-[50vh] overflow-y-auto custom-scrollbar"
            >
              <h3 className="font-black text-slate-900 mb-4 md:mb-5 flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-xl text-purple-600 shadow-inner shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                Dream Path
              </h3>

              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Set Your Goal</label>
                  <p className="text-[10px] text-slate-500 mb-2 ml-1">Type whatever you want to achieve!</p>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="E.g. Become a YouTuber"
                      value={customDreamPath}
                      onChange={e => setCustomDreamPath(e.target.value)}
                      onKeyDown={e => {
                        if(e.key === 'Enter' && customDreamPath.trim()) {
                          setDreamPath(customDreamPath.trim());
                          setActiveSidePanel(null);
                        }
                      }}
                      className="w-full px-4 py-3 pr-10 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm transition-all shadow-sm group-hover:border-slate-300"
                    />
                    <button 
                      onClick={() => {
                        setDreamPath(customDreamPath.trim());
                        setActiveSidePanel(null);
                      }}
                      disabled={!customDreamPath.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {dreamPath && (
                    <button 
                      onClick={() => { setDreamPath(""); setCustomDreamPath(""); setActiveSidePanel(null); }}
                      className="mt-3 text-[10px] font-bold text-red-500 hover:text-red-700 ml-1 underline"
                    >
                      Clear Goal / Back to Exploring
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CORE GAME LOOP BOTTOM PANEL - Full width, centered */}
      <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none p-3 md:p-6 pb-4 md:pb-8">
        <div className="pointer-events-auto max-h-[60vh] flex flex-col items-center w-[95vw] md:w-full max-w-6xl">
          
          {/* Main Phase Container */}
          <div className="w-full overflow-y-auto custom-scrollbar rounded-2xl md:rounded-[2rem]" style={{ overscrollBehavior: 'contain' }}>
            <AnimatePresence mode="wait">
              
              {/* PHASE 1: WORK - PRE START (Tutorial - Only shows for Quarter 1) */}
              {phase === "work" && !isSimulating && !workDone && quarter === 1 && !showEndGame && (
                <motion.div 
                  key="work-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="w-full glass-morphism rounded-2xl md:rounded-[2rem] p-4 md:p-8 border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className="bg-indigo-100 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-inner border border-indigo-200">
                     <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Welcome to Your Freedom Path!</h3>
                    <div className="max-w-md mx-auto space-y-2 text-sm md:text-base text-slate-600 text-left font-medium bg-white/60 p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p>✨ <strong>Step 1:</strong> You work a 9-to-5 job to sustain yourself.</p>
                      <p>✨ <strong>Step 2:</strong> Use your 8 hours of free time wisely to build skills and connections.</p>
                      <p>✨ <strong>Step 3:</strong> Keep progressing quarter by quarter until you reach financial freedom!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setWorkProgress(0);
                      setIsSimulating(true);
                    }}
                    className="w-full mt-4 font-bold py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-base md:text-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    Start Game <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </motion.div>
              )}

              {/* PHASE 1: WORK - only show after work is done (character returned home) */}
              {phase === "work" && workDone && !showEndGame && (
                <motion.div 
                  key="work"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="w-full glass-morphism rounded-2xl md:rounded-[2rem] p-4 md:p-8 border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 md:p-5 bg-emerald-50 border border-emerald-100 rounded-xl md:rounded-2xl w-full flex items-center gap-3 md:gap-4 shadow-inner mb-4 md:mb-6"
                  >
                    <div className="bg-emerald-100 p-2.5 md:p-3 rounded-lg md:rounded-xl shrink-0">
                      <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-emerald-800 font-bold text-base md:text-lg mb-0.5 md:mb-1">Workday Complete!</p>
                      <p className="text-emerald-700 font-medium text-xs md:text-sm">
                        {workUpdate || "You picked up some basic organizational skills."}
                      </p>
                    </div>
                  </motion.div>

                  {/* Work Gains & Dream Tips */}
                  {(workSkillsGained.length > 0 || workKnowledgeGained.length > 0) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-wrap gap-2 mb-4 md:mb-6"
                    >
                      {workSkillsGained.map((s, i) => (
                         <div key={`ws-${i}`} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 animate-pulse">
                           <LucideZap className="w-3.5 h-3.5" /> + {s}
                         </div>
                      ))}
                      {workKnowledgeGained.map((k, i) => (
                         <div key={`wk-${i}`} className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 animate-pulse">
                           <BookOpen className="w-3.5 h-3.5" /> + {k}
                         </div>
                      ))}
                    </motion.div>
                  )}

                  {workDreamTip && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 md:p-4 bg-purple-50 border border-purple-100 rounded-xl w-full flex items-center gap-3 shadow-sm mb-4 md:mb-6 text-purple-800 text-xs md:text-sm font-medium"
                    >
                      {workDreamTip}
                    </motion.div>
                  )}

                  <button
                    onClick={handleNextPhase}
                    className="w-full font-bold py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-base md:text-lg bg-slate-900 hover:bg-slate-800 hover:shadow-2xl shadow-slate-900/20 text-white"
                  >
                    Proceed to Building Dreams <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </motion.div>
              )}

              {/* PHASE 2: FREE TIME (AI & MANUAL ALLOCATION) */}
              {phase === "freeTime" && gamePhase !== "simulating" && !showEndGame && (
                <motion.div 
                  key="freeTime"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full glass-morphism rounded-2xl md:rounded-[2rem] p-4 md:p-8 border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl flex flex-col gap-4 md:gap-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 w-full md:w-auto flex-1">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-orange-100 p-2.5 md:p-3 rounded-lg md:rounded-xl shadow-inner border border-orange-50 shrink-0">
                          <Sun className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-slate-900">Building Dreams</h3>
                          <p className="text-[10px] md:text-sm font-bold text-slate-500">How will you spend your 8 hours of free time this quarter?</p>
                        </div>
                      </div>

                      {/* Time Unit Progress Box */}
                      <div className="flex sm:ml-auto items-center gap-3 bg-indigo-50 border border-indigo-100/60 p-2.5 md:p-3 rounded-xl shadow-inner min-w-[140px] md:min-w-[180px]">
                        <div className="flex-1">
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-indigo-500">Time Units</span>
                            <span className={`text-xs md:text-sm font-black ${remainingUnits === 0 ? 'text-emerald-600' : 'text-indigo-700'}`}>
                              {remainingUnits} / 8
                            </span>
                          </div>
                          <div className="h-1.5 md:h-2 bg-indigo-200/50 rounded-full overflow-hidden w-full">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${remainingUnits === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                              style={{ width: `${(remainingUnits / 8) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Requirements validation (always visible in free-time phase) */}
                    <div className="flex gap-2.5 md:gap-4 text-[10px] md:text-xs font-black bg-slate-50 p-2 md:p-3 rounded-xl border border-slate-100 justify-center min-w-max">
                      <span className={`flex items-center gap-1 md:gap-1.5 ${hobbyUnits > 0 ? "text-emerald-500" : "text-amber-500"}`}>
                        {hobbyUnits > 0 ? "✓ 1+ Hobby" : "⚠ Needs 1 Hobby"}
                      </span>
                      <div className="w-px h-3 md:h-4 bg-slate-200 self-center" />
                      <span className={`flex items-center gap-1 md:gap-1.5 ${socialUnits > 0 ? "text-emerald-500" : (hasFriends ? "text-amber-500" : "text-slate-400")}`}>
                        {hasFriends ? (socialUnits > 0 ? "✓ 1+ Social" : "⚠ Needs 1 Social") : "○ Social (optional)"}
                      </span>
                    </div>
                  </div>

                  <>
                    {/* Activity List */}
                      <div className="bg-white/50 p-2 md:p-3 rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-h-[30vh] max-h-[40vh] overflow-y-auto custom-scrollbar p-1">
                          {(["skill", "hobby", "social"] as ActivityCategory[]).map(category => {
                            const catActivities = activities.filter(a => a.category === category);
                            return (
                              <div key={category} className="space-y-3 flex flex-col">
                                <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-wider text-slate-500 px-1 pl-2 border-b border-slate-200 pb-2">
                                  <div className={`shrink-0 p-1 md:p-1.5 rounded-md shadow-inner ${category === 'skill' ? 'bg-indigo-50 border border-indigo-100/50' : category === 'hobby' ? 'bg-orange-50 border border-orange-100/50' : 'bg-pink-50 border border-pink-100/50'}`}>
                                    {getCategoryIcon(category)}
                                  </div>
                                  <span>{category === "skill" ? "Skills & Hustling" : category === "hobby" ? "Hobbies & Leisure" : "Social & Networking"}</span>
                                </h4>
                                {catActivities.length === 0 ? (
                                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-3 gap-2">
                                    {category === 'social' ? (
                                      <>
                                        <p className="text-xs font-bold text-slate-400 text-center">You have no friends yet.</p>
                                        <button 
                                          onClick={() => setActiveSidePanel('social')}
                                          className="text-[10px] font-bold bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                        >
                                          Add New Friend
                                        </button>
                                      </>
                                    ) : (
                                      <p className="text-xs font-bold text-slate-400 text-center">No active focuses here.</p>
                                    )}
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {catActivities.map(act => (
                                      <div key={act.id} className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-slate-300 transition-colors gap-2">
                                        <div className="min-w-0 flex-1 group relative cursor-help">
                                          <p className="font-bold text-slate-800 text-sm md:text-base truncate">{act.name}</p>
                                          {act.isOpportunity && (
                                            <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider mt-0.5 ${act.category === 'skill' ? 'text-indigo-400' : act.category === 'hobby' ? 'text-orange-400' : 'text-pink-400'}`}>
                                              Opportunity
                                            </p>
                                          )}
                                          
                                          {/* Custom Tooltip */}
                                          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-0 mb-2 w-max max-w-xs p-2 md:p-2.5 bg-slate-900 text-white text-[10px] md:text-xs font-medium rounded-lg md:rounded-xl shadow-xl break-words whitespace-normal transition-all z-50 pointer-events-none">
                                            {act.name}
                                            {/* little arrow */}
                                            <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center bg-slate-50 rounded-lg md:rounded-xl p-1 md:p-1.5 border border-slate-200 shrink-0 shadow-inner gap-1.5 md:gap-2 min-w-[90px] md:min-w-[100px] justify-between">
                                          <button 
                                            onClick={() => updateAllocation(act.id, -1)}
                                            className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-white hover:bg-slate-100 rounded-md md:rounded-lg transition-colors text-slate-600 shadow-sm border border-slate-200 disabled:opacity-30 disabled:hover:bg-white"
                                            disabled={act.allocated === 0}
                                          >
                                            <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                          </button>
                                          <span className="w-5 md:w-6 shrink-0 text-center font-black text-slate-800 text-base md:text-lg">{act.allocated}</span>
                                          <button 
                                            onClick={() => updateAllocation(act.id, 1)}
                                            className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-white hover:bg-slate-100 rounded-md md:rounded-lg transition-colors text-slate-600 shadow-sm border border-slate-200 disabled:opacity-30 disabled:hover:bg-white"
                                            disabled={remainingUnits === 0}
                                            title={remainingUnits === 0 ? "All 8 units allocated" : "Add 1 unit"}
                                          >
                                            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Activity Input */}
                      <div className="bg-white p-2.5 md:p-3 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2 items-center">
                        <input 
                          type="text" 
                          placeholder="Type your own action..."
                          value={newActivityName}
                          onChange={e => setNewActivityName(e.target.value)}
                          onKeyDown={e => {
                            if(e.key === 'Enter') addCustomActivity();
                          }}
                          className="flex-1 px-3 md:px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs md:text-sm w-full"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                          <select 
                            value={newActivityCategory}
                            onChange={e => {
                               setNewActivityCategory(e.target.value as ActivityCategory);
                            }}
                            className="px-2 md:px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-slate-600 outline-none focus:border-indigo-500 flex-1 sm:flex-none"
                          >
                            <option value="skill">Skill</option>
                            <option value="hobby">Hobby</option>
                          </select>
                          <button 
                            onClick={addCustomActivity}
                            disabled={!newActivityName.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg md:rounded-xl transition-colors disabled:opacity-50 shadow-md shrink-0"
                          >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Dream Path Selector (Only if not set) */}
                      {!dreamPath && (
                        <div className="bg-purple-50/50 p-4 rounded-xl md:rounded-2xl border border-purple-100 shadow-sm mt-2">
                          <label className="text-xs font-black text-purple-600 uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Focus Your Journey (Optional)
                          </label>
                          <p className="text-xs text-purple-800 mb-3 font-medium">
                            Set a goal to get better, tailored advice. It's okay to stay &quot;undecided&quot; and explore!
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input
                              type="text"
                              placeholder="Type your dream (e.g. Open a Cafe...)"
                              value={customDreamPath}
                              onChange={e => setCustomDreamPath(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && customDreamPath.trim()) setDreamPath(customDreamPath.trim());
                              }}
                              className="px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs md:text-sm font-bold text-slate-700 outline-none focus:border-purple-500 flex-1 w-full"
                            />
                            <button
                              onClick={() => {
                                if (customDreamPath.trim()) setDreamPath(customDreamPath.trim());
                              }}
                              disabled={!customDreamPath.trim()}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50 text-xs font-bold shrink-0"
                            >
                              Set Path
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Soft hint if player has friends but no social allocation */}
                      {!effectiveCanProceed && hasFriends && socialUnits === 0 && remainingUnits === 0 && (
                        <p className="text-center text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl py-2 px-3">
                          ⚠ Hang out with at least one friend this quarter!
                        </p>
                      )}
                      <button
                        onClick={handleNextPhase}
                        disabled={!effectiveCanProceed}
                        className={`mt-1 md:mt-2 w-full py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all font-bold text-base md:text-lg ${
                          effectiveCanProceed 
                            ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl shadow-slate-900/20" 
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Start Building Future Freedom!
                      </button>
                  </>
                </motion.div>
              )}

              {/* PHASE 3: SLEEP / AI INSIGHT */}
              {phase === "sleep" && !showEndGame && (
                <motion.div 
                  key="sleep"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full glass-morphism rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 md:gap-5 mb-5 md:mb-8">
                    <div className="bg-indigo-900 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-inner border border-indigo-800 shrink-0">
                      <Moon className="w-6 h-6 md:w-8 md:h-8 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900">Sleep & Reflect</h3>
                      <p className="text-slate-500 font-bold text-xs md:text-base">12:00 AM - 8:00 AM (AI-driven insights)</p>
                    </div>
                  </div>

                  {!aiResult && (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                      <p className="text-sm font-bold text-slate-500">Evaluating your quarter progress...</p>
                    </div>
                  )}

                  {aiResult && (
                    <div className="space-y-4 md:space-y-6 mb-5 md:mb-8">
                      <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-400" />
                        <h4 className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-2 md:mb-3">Quarter Conclusion</h4>
                        <p className="text-slate-800 italic leading-relaxed text-base md:text-lg font-medium">&quot;{aiResult.narrative}&quot;</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-slate-50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 shadow-inner">
                          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 md:mb-2">Outcome</h4>
                          <p className="text-slate-700 font-bold text-sm md:text-base">{aiResult.insight}</p>
                        </div>
                        <div className="bg-indigo-50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-indigo-100 shadow-inner">
                          <h4 className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-1.5 md:mb-2">Suggestion</h4>
                          <p className="text-slate-800 font-bold text-sm md:text-base">{aiResult.suggestion}</p>
                        </div>
                      </div>

                      {/* NEW: Knowledge Gained */}
                      {aiResult.knowledge_gained && aiResult.knowledge_gained.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-start gap-3 md:gap-4 shadow-sm">
                          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">Knowledge Acquired</h4>
                            <p className="text-slate-800 font-bold text-xs md:text-sm">
                              You gained domain knowledge in: 
                              {aiResult.knowledge_gained.map((k: string, i: number) => (
                                <span key={i} className="text-amber-700 bg-amber-100 flex-wrap px-2 py-0.5 rounded ml-1 mb-1 inline-block">{k}</span>
                              ))}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* NEW: Opportunities */}
                      {aiResult.opportunities && aiResult.opportunities.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-pink-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Rocket className="w-4 h-4" /> Recommended Opportunity
                          </h4>
                          {aiResult.opportunities.map((opp: any, idx: number) => (
                            <div key={idx} className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-pink-200 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-black text-slate-800 text-lg">{opp.title}</h5>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${opp.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' : opp.confidence === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                                  {opp.confidence} match
                                </span>
                              </div>
                              <p className="text-slate-700 font-medium text-sm mb-3">{opp.description}</p>
                              <div className="bg-white/60 p-3 rounded-xl border border-pink-100 text-xs text-slate-600 mb-3 italic">
                                &quot;{opp.reasoning}&quot;
                              </div>
                              
                              {/* Why it matches */}
                              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                                {opp.based_on?.skills?.map((s: string, i: number) => (
                                  <span key={`s-${i}`} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md flex items-center gap-1"><LucideZap className="w-3 h-3"/> {s}</span>
                                ))}
                                {opp.based_on?.knowledge?.map((k: string, i: number) => (
                                  <span key={`k-${i}`} className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md flex items-center gap-1"><BookOpen className="w-3 h-3"/> {k}</span>
                                ))}
                                {opp.based_on?.friends?.map((f: string, i: number) => (
                                  <span key={`f-${i}`} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-md flex items-center gap-1"><Users className="w-3 h-3"/> {f}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* NEW: Suggested Paths (if no dream path) */}
                      {!dreamPath && aiResult.suggested_paths && aiResult.suggested_paths.length > 0 && (
                        <div className="bg-purple-50 p-4 rounded-xl md:rounded-2xl border border-purple-200 shadow-sm">
                           <h4 className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <Compass className="w-4 h-4" /> AI Suggested Paths
                           </h4>
                           <div className="space-y-3">
                             {aiResult.suggested_paths.map((p: any, i: number) => (
                               <div key={i} className="bg-white p-3 rounded-xl border border-purple-100 flex flex-col gap-2">
                                 <div className="flex justify-between items-center">
                                   <span className="font-bold text-slate-800">{p.path}</span>
                                   <button 
                                     onClick={() => setDreamPath(p.path)}
                                     className="text-[10px] font-black uppercase bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                                   >
                                     Adopt Path
                                   </button>
                                 </div>
                                 <p className="text-xs text-slate-600">{p.reasoning}</p>
                               </div>
                             ))}
                           </div>
                        </div>
                      )}

                      {aiResult.unlockedOpportunity && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-emerald-50 border border-emerald-200 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-start gap-3 md:gap-4 shadow-sm"
                        >
                          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Opportunity Unlocked</h4>
                            <p className="text-slate-800 font-bold text-xs md:text-sm">You&apos;ve unlocked <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded ml-1">{aiResult.unlockedOpportunity.name}</span> for the next quarter!</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {/* Primary: keep going infinitely */}
                    <button
                      onClick={handleNextPhase}
                      disabled={!aiResult}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all shadow-xl hover:shadow-2xl shadow-indigo-600/30 text-base md:text-lg"
                    >
                      Continue to Q{quarter + 1} <Sun className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Secondary: voluntary end */}
                    <button
                      onClick={handleEndGame}
                      disabled={!aiResult}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-700 font-bold py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all text-sm md:text-base"
                    >
                      <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                      I&apos;ve Found My Path — End Journey
                    </button>
                  </div>
                </motion.div>
              )}

              {/* END-GAME SUMMARY SCREEN */}
              {showEndGame && (
                <motion.div
                  key="endgame"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full glass-morphism rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-white/60 shadow-2xl bg-white/90 backdrop-blur-xl"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg shrink-0">
                      <Trophy className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900">Your Freedom Path</h2>
                      <p className="text-slate-500 font-bold text-sm">{name ? `${name}'s` : 'Your'} Journey Summary · Q{quarterHistory.length} Completed</p>
                    </div>
                  </div>

                  {/* Skills Gained */}
                  <div className="mb-5 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <h3 className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-2">⚡ Skills You Built</h3>
                    {skillTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skillTags.map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">No skills tracked — add them from the Skills panel next time!</p>
                    )}
                  </div>

                  {/* Knowledge Gained */}
                  {knowledgeTags.length > 0 && (
                    <div className="mb-5 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                      <h3 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-2">📚 Domain Knowledge</h3>
                        <div className="flex flex-wrap gap-2">
                          {knowledgeTags.map((knowledge, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 text-xs font-bold rounded-lg shadow-sm">
                              {knowledge}
                            </span>
                          ))}
                        </div>
                    </div>
                  )}

                  {/* Best Opportunity Found */}
                  {quarterHistory.some(qh => qh.aiResult?.opportunities && qh.aiResult.opportunities.length > 0) && (
                    <div className="mb-5 p-4 bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-200 rounded-2xl shadow-sm">
                      <h3 className="text-xs font-black text-pink-500 uppercase tracking-wider mb-3">🚀 Top Opportunity Discovered</h3>
                      {(() => {
                        const topOpps = quarterHistory
                          .flatMap(qh => qh.aiResult?.opportunities || [])
                          .sort((a, b) => a.confidence === 'high' ? -1 : 1);
                        const bestOpp = topOpps[0];
                        if (!bestOpp) return null;
                        
                        return (
                          <div className="bg-white/60 p-4 rounded-xl border border-pink-100 shadow-sm">
                             <h4 className="font-black text-slate-800 text-lg mb-1">{bestOpp.title}</h4>
                             <p className="text-sm font-medium text-slate-700">{bestOpp.description}</p>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Quarter-by-Quarter Recap */}
                  <div className="mb-5 space-y-3">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">📅 Quarter Recaps</h3>
                    {quarterHistory.map((qh, i) => (
                      <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xs font-black text-white bg-indigo-500 px-2 py-0.5 rounded-full shrink-0 mt-0.5">Q{qh.quarter}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {qh.activities.filter(a => a.allocated > 0).slice(0, 5).map((a, j) => (
                              <span key={j} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                a.category === 'skill' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                a.category === 'hobby' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                'bg-pink-50 text-pink-600 border border-pink-100'
                              }`}>
                                {a.name} ({a.allocated}h)
                              </span>
                            ))}
                          </div>
                        </div>
                        {qh.aiResult && (
                          <p className="text-slate-500 text-xs font-medium italic leading-relaxed pl-9">&quot;{qh.aiResult.narrative}&quot;</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Final AI Trajectory */}
                  {quarterHistory.length > 0 && quarterHistory[quarterHistory.length - 1]?.aiResult && (
                    <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <h3 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">🔭 Your Trajectory</h3>
                      <p className="text-slate-800 font-bold text-sm mb-2">
                        {quarterHistory[quarterHistory.length - 1].aiResult?.suggestion}
                      </p>
                      <p className="text-slate-500 text-xs font-medium">
                        {quarterHistory[quarterHistory.length - 1].aiResult?.insight}
                      </p>
                    </div>
                  )}

                  {/* Network */}
                  {friends.length > 0 && (
                    <div className="mb-6 p-4 bg-pink-50 border border-pink-100 rounded-2xl">
                      <h3 className="text-xs font-black text-pink-500 uppercase tracking-wider mb-2">🤝 Your Network</h3>
                      <div className="flex flex-wrap gap-2">
                        {friends.map((f, i) => (
                          <span key={i} className="text-xs font-bold px-3 py-1.5 bg-white border border-pink-200 text-pink-700 rounded-lg shadow-sm">
                            {f.name} · {f.job}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Restart */}
                  <button
                    onClick={handleFullRestart}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl text-base"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Play Again — Try a Different Path
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

