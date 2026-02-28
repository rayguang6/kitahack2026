export const DEFAULT_INTERESTS = [
    "exercise", "watch drama", "play game"
];

export const MBTI_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
];

export const SOCIAL_PREFS = [
    "More Introverted", "Balanced", "More Extroverted"
];

export type WorkUpdate = {
    message: string;
    skill?: string;      // at most 1 skill, optional
    knowledge?: string;   // at most 1 knowledge, optional
};

// Work updates — most give nothing, some give 1 skill OR 1 knowledge (never both)
export const WORK_UPDATES: WorkUpdate[] = [
    // No gains — just flavor text (majority of entries)
    { message: "You settled into a steady rhythm at work." },
    { message: "A quiet quarter at the main job provided stability." },
    { message: "Routine meetings and emails filled the days." },
    { message: "Work was uneventful — pay came in on time though." },
    { message: "You kept your head down and got through the quarter." },
    // Rare: gives 1 skill
    { message: "You handled a small project solo and learned to manage your time better.", skill: "Time Management" },
    { message: "A tricky client situation taught you some negotiation basics.", skill: "Negotiation" },
    { message: "A presentation pushed you to get better at explaining ideas.", skill: "Communication" },
    // Rare: gives 1 knowledge
    { message: "Cross-functional meetings gave you a peek into how the business runs.", knowledge: "Business Operations" },
    { message: "You helped with onboarding and noticed the HR side of things.", knowledge: "People Management" },
];

// Dream-path-aware work tips (shown when player has a dream path set)
export const DREAM_AWARE_WORK_TIPS: Record<string, string[]> = {
    "Open a Restaurant": [
        "💡 While at work, you noticed how the office kitchen is managed — food supply chains are everywhere.",
        "💡 A colleague mentioned they used to run a food truck. You exchanged numbers.",
        "💡 You overheard the finance team talking about margins — useful for restaurant pricing."
    ],
    "Run E-commerce Biz": [
        "💡 You noticed how your company handles inventory — similar principles apply to e-commerce.",
        "💡 A marketing email from your company inspired some product listing ideas.",
        "💡 You studied how your company's website checkout flow works."
    ],
    "Build a SaaS": [
        "💡 Your company's internal tools gave you ideas for what's missing in the market.",
        "💡 You noticed a repetitive process at work — 'this could be automated into a product.'",
        "💡 A bug report at work made you think about user feedback systems."
    ],
    "Freelance Full-Time": [
        "💡 You tracked how much value you create daily vs. your salary — the gap is motivating.",
        "💡 A client interaction at work showed you how to scope projects properly.",
        "💡 You practiced estimating time for tasks — essential for freelance pricing."
    ],
    "Create Info Products": [
        "💡 You explained a complex concept to a colleague simply — that's content creation.",
        "💡 You documented a work process — that could become a guide or template.",
        "💡 A training session at work reminded you how much people pay to learn."
    ],
    "Content Creator": [
        "💡 You noticed a trending topic in your industry — content idea noted.",
        "💡 Your work presentation skills are transferable to video content.",
        "💡 A colleague shared your internal wiki post widely — your writing resonates."
    ]
};

// Game Configuration
// Total time each activity takes to simulate in milliseconds (2 seconds)
export const SIMULATION_DURATION_MS = 1500;
