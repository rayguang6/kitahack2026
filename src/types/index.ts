export type Step = "landing" | "onboarding-1" | "onboarding-2" | "game_map";
export type ActivityCategory = "skill" | "hobby" | "social";
export type Activity = { id: string; name: string; category: ActivityCategory; allocated: number; isOpportunity?: boolean };
export type Friend = { id: string; name: string; gender: "Male" | "Female"; job: string; desc?: string };
export type AIResult = { narrative: string; insight: string; suggestion: string; unlockedOpportunity?: { name: string; category: ActivityCategory } };
export type QuarterResult = { quarter: number; workUpdate: string; activities: Activity[]; ai: AIResult; skillTags: string[] };

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
