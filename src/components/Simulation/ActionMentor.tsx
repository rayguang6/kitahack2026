"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import { Sparkles, Code, BookOpen, Users, Plus, Loader2 } from "lucide-react";
import { AIActionChoice } from "@/types";

export function ActionMentor() {
  const { gamePhase, aiActionChoices, setGamePhase, activities, setActivities } = useSimulation();

  const isVisible = gamePhase === "generating" || gamePhase === "selecting_action";

  const handleSelect = (action: AIActionChoice) => {
    // Basic ID generator that does not trigger react strict mode impurity
    const actionId = `ai-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setActivities([
      ...activities,
      {
        id: actionId,
        name: action.title,
        category: action.type === 'social' ? 'social' : action.type === 'learning' || action.type === 'coding' ? 'skill' : 'hobby',
        allocated: 0
      }
    ]);
    setGamePhase("idle");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "coding": return <Code className="w-5 h-5 text-indigo-400" />;
      case "learning": return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case "social": return <Users className="w-5 h-5 text-pink-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="absolute right-4 top-24 bottom-24 w-80 lg:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl flex flex-col pointer-events-auto overflow-hidden z-40"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">AI Mentor</h2>
              <p className="text-xs text-slate-400 mt-1">Quarter Milestones</p>
            </div>
          </div>

          <div className="p-5 flex-1 overflow-y-auto w-full">
            {gamePhase === "generating" ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm font-medium text-slate-300">
                  Analyzing your goals and skills...<br/>
                  <span className="text-slate-500 text-xs">Formulating the perfect plan for this quarter.</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <p className="text-sm text-slate-300 mb-2">Here are 3 suggested focus areas for this quarter. Click to add to your action list:</p>
                {aiActionChoices.map((action, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSelect(action)}
                    className="w-full text-left group p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                         {getIcon(action.type)}
                         <span className="text-sm font-bold text-slate-200">{action.title}</span>
                      </div>
                      <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {action.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
