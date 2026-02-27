"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Step, ActivityCategory, Activity, Friend, AIResult, QuarterResult } from "@/types";
import { WORK_UPDATES } from "@/constants";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

interface SimulationContextType {
  step: Step;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  quarter: number;
  setQuarter: React.Dispatch<React.SetStateAction<number>>;
  
  // Player Profile
  name: string; setName: React.Dispatch<React.SetStateAction<string>>;
  age: string; setAge: React.Dispatch<React.SetStateAction<string>>;
  gender: "Male" | "Female" | ""; setGender: React.Dispatch<React.SetStateAction<"Male" | "Female" | "">>;
  occupationType: "Student" | "Working" | ""; setOccupationType: React.Dispatch<React.SetStateAction<"Student" | "Working" | "">>;
  occupationDetail: string; setOccupationDetail: React.Dispatch<React.SetStateAction<string>>;
  bio: string; setBio: React.Dispatch<React.SetStateAction<string>>;
  mbti: string; setMbti: React.Dispatch<React.SetStateAction<string>>;
  socialPref: string; setSocialPref: React.Dispatch<React.SetStateAction<string>>;
  interests: string[]; setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  customInterest: string; setCustomInterest: React.Dispatch<React.SetStateAction<string>>;

  skillTags: string[]; setSkillTags: React.Dispatch<React.SetStateAction<string[]>>;
  friends: Friend[]; setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  workUpdate: string; setWorkUpdate: React.Dispatch<React.SetStateAction<string>>;
  activities: Activity[]; setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  history: QuarterResult[]; setHistory: React.Dispatch<React.SetStateAction<QuarterResult[]>>;
  unlockedOpportunity: Activity | null; setUnlockedOpportunity: React.Dispatch<React.SetStateAction<Activity | null>>;

  // Internal forms/panels for quarter phase
  newActivityName: string; setNewActivityName: React.Dispatch<React.SetStateAction<string>>;
  newActivityCategory: ActivityCategory; setNewActivityCategory: React.Dispatch<React.SetStateAction<ActivityCategory>>;
  showFriendPanel: boolean; setShowFriendPanel: React.Dispatch<React.SetStateAction<boolean>>;
  newFriendName: string; setNewFriendName: React.Dispatch<React.SetStateAction<string>>;
  newFriendJob: string; setNewFriendJob: React.Dispatch<React.SetStateAction<string>>;

  aiResult: AIResult | null; setAiResult: React.Dispatch<React.SetStateAction<AIResult | null>>;

  isStudent: boolean;
  totalAllocated: number;
  remainingUnits: number;
  hobbyUnits: number;
  socialUnits: number;
  canProceed: boolean;

  toggleInterest: (interest: string) => void;
  addCustomInterest: () => void;
  startQuarter1: () => void;
  addCustomActivity: () => void;
  updateAllocation: (id: string, delta: number) => void;
  handleAddFriend: () => void;
  startSimulation: () => void;
  proceedToNext: () => void;
  handleRestart: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("onboarding-1");
  const [quarter, setQuarter] = useState<number>(1);
  
  // Profile
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [occupationType, setOccupationType] = useState<"Student" | "Working" | "">("");
  const [occupationDetail, setOccupationDetail] = useState("");
  const [bio, setBio] = useState("");
  const [mbti, setMbti] = useState("");
  const [socialPref, setSocialPref] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [workUpdate, setWorkUpdate] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [history, setHistory] = useState<QuarterResult[]>([]);
  const [unlockedOpportunity, setUnlockedOpportunity] = useState<Activity | null>(null);

  // Forms
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityCategory, setNewActivityCategory] = useState<ActivityCategory>("hobby");

  // Friend Form
  const [showFriendPanel, setShowFriendPanel] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendJob, setNewFriendJob] = useState("");

  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const isStudent = occupationType === "Student";

  useEffect(() => {
    if (step === "quarter") {
      // eslint-disable-next-line
      setWorkUpdate(WORK_UPDATES[Math.floor(Math.random() * WORK_UPDATES.length)]);
      
      const initialSuggestions: Activity[] = [];
      const coreSkill = skillTags.length > 0 ? skillTags[0] : "Productivity";
      
      initialSuggestions.push({ id: generateId(), name: `Deep dive into ${coreSkill}`, category: "skill", allocated: 0 });
      initialSuggestions.push({ id: generateId(), name: "Local networking event", category: "social", allocated: 0 });
      initialSuggestions.push({ id: generateId(), name: "Exercise or casual hobby", category: "hobby", allocated: 0 });

      if (unlockedOpportunity) {
        initialSuggestions.unshift({ ...unlockedOpportunity, id: generateId(), allocated: 0, isOpportunity: true });
        setUnlockedOpportunity(null);
      }
      setActivities(initialSuggestions);
    }
  }, [step, quarter, skillTags, unlockedOpportunity]);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const startQuarter1 = () => {
    const initialTags = [...interests];
    if (occupationDetail) initialTags.push(occupationDetail);
    setSkillTags(initialTags);
    setQuarter(1);
    setStep("quarter");
  };

  const addCustomActivity = () => {
    if (!newActivityName.trim()) return;
    setActivities([
      ...activities,
      { id: generateId(), name: newActivityName, category: newActivityCategory, allocated: 0 },
    ]);
    setNewActivityName("");
  };

  const updateAllocation = (id: string, delta: number) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const newAlloc = Math.max(0, act.allocated + delta);
          const totalOther = prev.filter((a) => a.id !== id).reduce((sum, a) => sum + a.allocated, 0);
          if (totalOther + newAlloc <= 8) {
            return { ...act, allocated: newAlloc };
          }
        }
        return act;
      })
    );
  };

  const handleAddFriend = () => {
    if (!newFriendName.trim() || !newFriendJob.trim()) return;
    setFriends([...friends, { id: generateId(), name: newFriendName, job: newFriendJob }]);
    setNewFriendName("");
    setNewFriendJob("");
    setShowFriendPanel(false);
  };

  const totalAllocated = activities.reduce((sum, a) => sum + a.allocated, 0);
  const remainingUnits = 8 - totalAllocated;
  const hobbyUnits = activities.filter((a) => a.category === "hobby").reduce((sum, a) => sum + a.allocated, 0);
  const socialUnits = activities.filter((a) => a.category === "social").reduce((sum, a) => sum + a.allocated, 0);
  const canProceed = remainingUnits === 0 && hobbyUnits >= 1 && socialUnits >= 1;

  const handleSleep = () => {
    setStep("sleep");
    
    // Simulate AI Outcome generation
    setTimeout(() => {
      const topSkillActivity = activities
        .filter((a) => a.category === "skill")
        .sort((a, b) => b.allocated - a.allocated)[0];

      let newOpp = undefined;
      let insightText = "You maintained a stable baseline, laying groundwork without burning out.";
      
      if (topSkillActivity && topSkillActivity.allocated >= 3) {
        newOpp = { name: `Freelance request related to: ${topSkillActivity.name.substring(0, 15)}...`, category: "skill" as ActivityCategory };
        insightText = `Your dedicated focus on ${topSkillActivity.name} built noticeable momentum. People are starting to recognize your capability.`;
      } else if (socialUnits >= 3) {
        newOpp = { name: `Exclusive gathering invite`, category: "social" as ActivityCategory };
        insightText = `A vibrant social presence this quarter has expanded your circle naturally.`;
      }

      const dominant = totalAllocated === 0 ? "idle" : 
                      topSkillActivity?.allocated >= 4 ? "skill-heavy" : "balanced";

      const generatedResult: AIResult = {
        narrative: `Quarter ${quarter} passed steadily. Outside of the daily grind, you committed to intentional time blocks. By focusing your energy, you started carving out tangible growth paths.`,
        insight: insightText,
        suggestion: dominant === "skill-heavy" ? "Consider sharing your recent learnings with others to build network value." : "You might want to establish a deeper skill specialization next quarter.",
        unlockedOpportunity: newOpp,
      };

      setAiResult(generatedResult);

      const currentSnapshotActivities = activities.filter(a => a.allocated > 0);
      setHistory((prev) => [
        ...prev,
        {
          quarter,
          workUpdate,
          activities: currentSnapshotActivities,
          ai: generatedResult,
          skillTags: [...skillTags],
        },
      ]);

      if (newOpp) {
         setUnlockedOpportunity({ id: generateId(), name: newOpp.name, category: newOpp.category, allocated: 0 });
      }
    }, 2500);
  };

  const startSimulation = () => {
    setStep("simulation");
    
    // Simulate action phase for 3.5 seconds
    setTimeout(() => {
      handleSleep();
    }, 3500);
  };

  const proceedToNext = () => {
    if (quarter < 3) {
      setQuarter((q) => q + 1);
      setAiResult(null);
      setStep("quarter");
    } else {
      setAiResult(null);
      setStep("end");
    }
  };

  const handleRestart = () => {
    setStep("onboarding-1");
    setQuarter(1);
    setName(""); setAge(""); setGender(""); setOccupationType(""); setOccupationDetail("");
    setBio(""); setMbti(""); setSocialPref(""); setInterests([]); setCustomInterest("");
    setSkillTags([]); setFriends([]); setHistory([]); setUnlockedOpportunity(null);
  };

  const value = {
    step, setStep, quarter, setQuarter,
    name, setName, age, setAge, gender, setGender,
    occupationType, setOccupationType, occupationDetail, setOccupationDetail,
    bio, setBio, mbti, setMbti, socialPref, setSocialPref,
    interests, setInterests, customInterest, setCustomInterest,
    skillTags, setSkillTags, friends, setFriends, workUpdate, setWorkUpdate,
    activities, setActivities, history, setHistory, unlockedOpportunity, setUnlockedOpportunity,
    newActivityName, setNewActivityName, newActivityCategory, setNewActivityCategory,
    showFriendPanel, setShowFriendPanel, newFriendName, setNewFriendName, newFriendJob, setNewFriendJob,
    aiResult, setAiResult,
    isStudent, totalAllocated, remainingUnits, hobbyUnits, socialUnits, canProceed,
    toggleInterest, addCustomInterest, startQuarter1, addCustomActivity, updateAllocation,
    handleAddFriend, startSimulation, proceedToNext, handleRestart
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
