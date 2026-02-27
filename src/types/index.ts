export type Step = "onboarding-1" | "onboarding-2" | "quarter" | "simulation" | "sleep" | "end";
export type ActivityCategory = "skill" | "hobby" | "social";
export type Activity = { id: string; name: string; category: ActivityCategory; allocated: number; isOpportunity?: boolean };
export type Friend = { id: string; name: string; job: string; desc?: string };
export type AIResult = { narrative: string; insight: string; suggestion: string; unlockedOpportunity?: { name: string; category: ActivityCategory } };
export type QuarterResult = { quarter: number; workUpdate: string; activities: Activity[]; ai: AIResult; skillTags: string[] };
