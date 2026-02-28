export type Step = "landing" | "onboarding-1" | "onboarding-2" | "game_map";
export type ActivityCategory = "skill" | "hobby" | "social";
export type Activity = { id: string; name: string; category: ActivityCategory; allocated: number; isOpportunity?: boolean };
export type Friend = { id: string; name: string; gender: "Male" | "Female"; job: string; desc?: string };
export type Opportunity = {
    title: string;
    description: string;
    reasoning: string;
    confidence: "high" | "medium" | "low";
    based_on: {
        skills: string[];
        knowledge: string[];
        friends: string[];
    };
};

export type SuggestedPath = {
    path: string;
    reasoning: string;
};

export type AIResult = {
    narrative: string;
    insight: string;
    suggestion: string;
    unlockedOpportunity?: { name: string; category: ActivityCategory };
    knowledge_gained?: string[];
    opportunities?: Opportunity[];
    suggested_paths?: SuggestedPath[];
    work_skills?: string[];
    work_knowledge?: string[];
};

export type QuarterResult = {
    quarter: number;
    workUpdate: string;
    activities: Activity[];
    ai: AIResult;
    skillTags: string[];
    knowledgeTags?: string[];
};

export type GamePhase = "idle" | "generating" | "selecting_action" | "simulating" | "evaluating" | "showing_outcome";

export type AIActionChoice = {
    title: string;
    description: string;
    type: "coding" | "learning" | "social" | "hobby";
    allocated?: number;
    categoryId?: string;
};

export type ActionOutcome = {
    narrative: string;
    skills_improved: string[];
};
