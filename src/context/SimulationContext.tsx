"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Step, ActivityCategory, Activity, Friend, AIResult, QuarterResult, GamePhase, AIActionChoice, ActionOutcome } from "@/types";
import { WORK_UPDATES } from "@/constants";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export type Phase = "work" | "freeTime" | "sleep";

interface SimulationContextType {
  quarter: number;
  setQuarter: React.Dispatch<React.SetStateAction<number>>;
  
  phase: Phase;
  setPhase: React.Dispatch<React.SetStateAction<Phase>>;
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
  workProgress: number;
  setWorkProgress: React.Dispatch<React.SetStateAction<number>>;
  workDone: boolean;
  setWorkDone: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Core AI Loop
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  aiActionChoices: AIActionChoice[];
  setAiActionChoices: React.Dispatch<React.SetStateAction<AIActionChoice[]>>;
  selectedAction: AIActionChoice | null;
  setSelectedAction: React.Dispatch<React.SetStateAction<AIActionChoice | null>>;
  actionOutcome: ActionOutcome | null;
  setActionOutcome: React.Dispatch<React.SetStateAction<ActionOutcome | null>>;
  
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
  knowledgeTags: string[]; setKnowledgeTags: React.Dispatch<React.SetStateAction<string[]>>;
  dreamPath: string; setDreamPath: React.Dispatch<React.SetStateAction<string>>;
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
  newFriendGender: "Male" | "Female"; setNewFriendGender: React.Dispatch<React.SetStateAction<"Male" | "Female">>;
  newFriendJob: string; setNewFriendJob: React.Dispatch<React.SetStateAction<string>>;
  newFriendDesc: string; setNewFriendDesc: React.Dispatch<React.SetStateAction<string>>;
  newSkillName: string; setNewSkillName: React.Dispatch<React.SetStateAction<string>>;

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
  handleAddSkillTag: () => void;
  startSimulation: () => void;
  proceedToNext: () => void;
  handleRestart: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// ... skipping ...

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [quarter, setQuarter] = useState<number>(1);
  const [phase, setPhase] = useState<Phase>("work");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [workProgress, setWorkProgress] = useState<number>(0);
  const [workDone, setWorkDone] = useState<boolean>(false);
  
  // Core AI Loop States
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [aiActionChoices, setAiActionChoices] = useState<AIActionChoice[]>([]);
  const [selectedAction, setSelectedAction] = useState<AIActionChoice | null>(null);
  const [actionOutcome, setActionOutcome] = useState<ActionOutcome | null>(null);
  
  // Profile
  const [name, setName] = useState("Alex");
  const [age, setAge] = useState("24");
  const [gender, setGender] = useState<"Male" | "Female" | "">("Male");
  const [occupationType, setOccupationType] = useState<"Student" | "Working" | "">("Working");
  const [occupationDetail, setOccupationDetail] = useState("Software Engineer");
  const [bio, setBio] = useState("");
  const [mbti, setMbti] = useState("");
  const [socialPref, setSocialPref] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [knowledgeTags, setKnowledgeTags] = useState<string[]>([]);
  const [dreamPath, setDreamPath] = useState<string>("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [workUpdate, setWorkUpdate] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [history, setHistory] = useState<QuarterResult[]>([]);
  const [unlockedOpportunity, setUnlockedOpportunity] = useState<Activity | null>(null);

  // Forms
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityCategory, setNewActivityCategory] = useState<ActivityCategory>("skill");

  // Friend Form
  const [showFriendPanel, setShowFriendPanel] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendGender, setNewFriendGender] = useState<"Male" | "Female">("Male");
  const [newFriendJob, setNewFriendJob] = useState("");
  const [newFriendDesc, setNewFriendDesc] = useState("");

  const [newSkillName, setNewSkillName] = useState("");

  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const isStudent = occupationType === "Student";

  useEffect(() => {
    if (pathname === "/game" && activities.length === 0) {
      // eslint-disable-next-line
      const wu = WORK_UPDATES[Math.floor(Math.random() * WORK_UPDATES.length)];
      setWorkUpdate(wu.message);
      
      const initialSuggestions: Activity[] = [];
      const coreSkill = skillTags.length > 0 ? skillTags[0] : "Productivity";
      
      initialSuggestions.push({ id: generateId(), name: `Master ${coreSkill}`, category: "skill", allocated: 0 });
      initialSuggestions.push({ id: generateId(), name: "exercise", category: "hobby", allocated: 0 });
      initialSuggestions.push({ id: generateId(), name: "watch drama", category: "hobby", allocated: 0 });
      initialSuggestions.push({ id: generateId(), name: "play game", category: "hobby", allocated: 0 });
      friends.forEach((f) => {
        initialSuggestions.push({ id: f.id, name: f.name, category: "social", allocated: 0 });
      });

      if (unlockedOpportunity) {
        initialSuggestions.unshift({ ...unlockedOpportunity, id: generateId(), allocated: 0, isOpportunity: true });
        setUnlockedOpportunity(null);
      }
      setActivities(initialSuggestions);
    }
  }, [pathname, quarter, skillTags, unlockedOpportunity, activities.length]);

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
  };

  const addCustomActivity = () => {
    if (!newActivityName.trim()) return;
    setActivities([
      ...activities,
      { id: generateId(), name: newActivityName, category: newActivityCategory, allocated: 0 },
    ]);
    setNewActivityName("");
    setNewActivityCategory("skill");
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
    if (friends.length >= 5) return; // Max 5 friends
    const newId = generateId();
    setFriends([...friends, { id: newId, name: newFriendName, gender: newFriendGender, job: newFriendJob, desc: newFriendDesc.trim() || undefined }]);
    setActivities((prev) => [...prev, { id: newId, name: newFriendName, category: "social", allocated: 0 }]);
    setNewFriendName("");
    setNewFriendGender("Male");
    setNewFriendJob("");
    setNewFriendDesc("");
    setShowFriendPanel(false);
  };

  const handleAddSkillTag = () => {
    if (!newSkillName.trim()) return;
    if (skillTags.includes(newSkillName.trim())) return;
    setSkillTags([...skillTags, newSkillName.trim()]);
    setNewSkillName("");
  };

  const totalAllocated = activities.reduce((sum, a) => sum + a.allocated, 0);
  const remainingUnits = 8 - totalAllocated;
  const hobbyUnits = activities.filter((a) => a.category === "hobby").reduce((sum, a) => sum + a.allocated, 0);
  const socialUnits = activities.filter((a) => a.category === "social").reduce((sum, a) => sum + a.allocated, 0);
  const canProceed = remainingUnits === 0 && hobbyUnits >= 1 && socialUnits >= 1;

  const handleSleep = () => {
    // Disabled old simulation flows
  };

  const startSimulation = () => {
    // Disabled
  };

  const proceedToNext = () => {
    // Disabled
  };

  const handleRestart = () => {
    setQuarter(1);
    setName(""); setAge(""); setGender(""); setOccupationType(""); setOccupationDetail("");
    setBio(""); setMbti(""); setSocialPref(""); setInterests([]); setCustomInterest("");
    setSkillTags([]); setKnowledgeTags([]); setDreamPath(""); setFriends([]); setHistory([]); setUnlockedOpportunity(null);
    setActivities([]);
  };

  const value = {
    quarter, setQuarter,
    phase, setPhase,
    isSimulating, setIsSimulating,
    workProgress, setWorkProgress,
    workDone, setWorkDone,

    gamePhase, setGamePhase,
    aiActionChoices, setAiActionChoices,
    selectedAction, setSelectedAction,
    actionOutcome, setActionOutcome,
    name, setName, age, setAge, gender, setGender,
    occupationType, setOccupationType, occupationDetail, setOccupationDetail,
    bio, setBio, mbti, setMbti, socialPref, setSocialPref,
    interests, setInterests, customInterest, setCustomInterest,
    skillTags, setSkillTags, knowledgeTags, setKnowledgeTags, dreamPath, setDreamPath, friends, setFriends, workUpdate, setWorkUpdate,
    activities, setActivities, history, setHistory, unlockedOpportunity, setUnlockedOpportunity,
    newActivityName, setNewActivityName, newActivityCategory, setNewActivityCategory,
    showFriendPanel, setShowFriendPanel, newFriendName, setNewFriendName, newFriendGender, setNewFriendGender, newFriendJob, setNewFriendJob, newFriendDesc, setNewFriendDesc,
    newSkillName, setNewSkillName,
    aiResult, setAiResult,
    isStudent, totalAllocated, remainingUnits, hobbyUnits, socialUnits, canProceed,
    toggleInterest, addCustomInterest, startQuarter1, addCustomActivity, updateAllocation,
    handleAddFriend, handleAddSkillTag, startSimulation, proceedToNext, handleRestart
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
