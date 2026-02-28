import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name, occupationType, occupationDetail, skillTags, knowledgeTags, friends, quarter,
            activities, dreamPath,
            // legacy fallback fields
            goal, actionTitle, actionType
        } = body;

        // Build a rich player context string
        const playerName = name || "the player";
        const playerOccupation = occupationDetail ? `${occupationDetail} (${occupationType})` : occupationType || "professional";
        const playerSkills = skillTags && skillTags.length > 0 ? skillTags.join(', ') : 'none yet';
        const playerKnowledge = knowledgeTags && knowledgeTags.length > 0 ? knowledgeTags.join(', ') : 'none yet';
        const playerFriends = friends && friends.length > 0
            ? friends.map((f: { name: string; job: string; desc?: string }) => `${f.name} (${f.job}${f.desc ? ', ' + f.desc : ''})`).join(', ')
            : 'none';
        const quarterNum = quarter || 1;
        const playerDreamPath = dreamPath || 'still exploring / undecided';

        // Build activity summary
        const activeActivities = activities && activities.length > 0
            ? activities.filter((a: { allocated: number }) => a.allocated > 0)
            : [];

        const activitiesSummary = activeActivities.length > 0
            ? activeActivities.map((a: { name: string; category: string; allocated: number }) =>
                `${a.name} (${a.category}, ${a.allocated} hrs)`
            ).join(', ')
            : actionTitle || 'working on dreams';

        const skillCount = activeActivities.filter((a: { category: string }) => a.category === 'skill').reduce((sum: number, a: { allocated: number }) => sum + a.allocated, 0);
        const hobbyCount = activeActivities.filter((a: { category: string }) => a.category === 'hobby').reduce((sum: number, a: { allocated: number }) => sum + a.allocated, 0);
        const socialCount = activeActivities.filter((a: { category: string }) => a.category === 'social').reduce((sum: number, a: { allocated: number }) => sum + a.allocated, 0);

        // Build social activity details for knowledge inference
        const socialActivities = activeActivities.filter((a: { category: string }) => a.category === 'social');
        const socialFriendDetails = socialActivities.map((a: { name: string; allocated: number }) => {
            const friend = friends?.find((f: { name: string }) => f.name === a.name);
            return friend ? `${a.name} (${friend.job}, ${a.allocated}hrs) - spending time with this friend could expose ${playerName} to ${friend.job}-related domain knowledge` : `${a.name} (${a.allocated}hrs)`;
        }).join('; ');

        const prompt = `You are a life coach AND entrepreneurial advisor writing a quarterly review for ${playerName}.

Player Profile:
- Name: ${playerName}
- Occupation: ${playerOccupation}
- Current Skills: ${playerSkills}
- Current Domain Knowledge: ${playerKnowledge}
- Dream Path / Goal: ${playerDreamPath}
- Connections/Friends: ${playerFriends}
- Quarter: ${quarterNum}

This quarter, ${playerName} spent their 8 free-time hours on:
${activitiesSummary}

Time breakdown: ${skillCount}h on skills/learning, ${hobbyCount}h on hobbies/leisure, ${socialCount}h on social/networking.
${socialFriendDetails ? `Social details: ${socialFriendDetails}` : ''}

Write a personalized quarterly summary with the following:

1. NARRATIVE: 3-4 sentence personalized story. Use ${playerName}'s actual name. Reference specific activities. If they have friends, mention one naturally.

2. INSIGHT: 1 sentence about their focus pattern this quarter.

3. SKILLS IMPROVED: Return 0 or 1 skill. Only add a skill if the activities this quarter CLEARLY warrant it. It is perfectly fine (and preferred) to return an empty array if nothing stands out. Do NOT inflate this.

4. KNOWLEDGE GAINED: Return 0 or 1 domain knowledge tag. Knowledge comes from:
   - Social interactions: If they hung out with a friend who works in law, they MIGHT gain "Legal Industry" knowledge.
   - Hobbies: Playing games MIGHT give "Game Design" knowledge.
   - Skills: Learning web dev MIGHT give "Tech Industry" knowledge.
   Knowledge is DIFFERENT from skills — it's about understanding domains, industries, and fields. Return empty array if nothing warranted. Do NOT force it.

5. OPPORTUNITIES: Generate exactly 1 bold, specific opportunity recommendation. This should be a concrete business/project idea UNIQUELY suited to this player. It MUST:
   - Have a short, exciting title (max 6 words)
   - Have a 1-sentence description of what it is
   - Have reasoning that explains WHY this player specifically should try this (connect their skills + knowledge + friends)
   - Specify which of their skills, knowledge, and friends make this possible
   - Feel personal — not generic advice anyone could get
   ${dreamPath ? `- Align with their dream path: "${dreamPath}" when possible` : '- Since they are still exploring, suggest diverse directions'}

6. SUGGESTION: A specific, actionable next step for next quarter. Be concrete.

${!dreamPath || dreamPath === 'still exploring / undecided' ? `7. SUGGESTED PATHS: Since ${playerName} hasn't set a dream path yet, suggest 2-3 possible dream paths/directions they could pursue based on everything you know about them. These should be specific life/career directions. Each must include a short reasoning sentence explaining why this path fits them.` : ''}`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        narrative: {
                            type: SchemaType.STRING,
                            description: '3-4 sentence personalized quarterly story using the player name and specific activities'
                        },
                        insight: {
                            type: SchemaType.STRING,
                            description: '1 sentence about the player focus pattern this quarter'
                        },
                        suggestion: {
                            type: SchemaType.STRING,
                            description: 'A specific, actionable next step for next quarter. Be concrete.'
                        },
                        skills_improved: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                            description: '0 or 1 skill names. Only include if clearly warranted. Empty array is fine and preferred over inflated results.'
                        },
                        knowledge_gained: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                            description: '0 or 1 domain knowledge area. Only include if clearly warranted by social interactions, hobbies, or skill activities. Empty array is fine.'
                        },
                        opportunities: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    title: {
                                        type: SchemaType.STRING,
                                        description: 'Short exciting title, max 6 words'
                                    },
                                    description: {
                                        type: SchemaType.STRING,
                                        description: '1 sentence describing the opportunity'
                                    },
                                    reasoning: {
                                        type: SchemaType.STRING,
                                        description: 'Why this player specifically should try this — connect their skills + knowledge + friends'
                                    },
                                    confidence: {
                                        type: SchemaType.STRING,
                                        description: 'high, medium, or low — based on how well it matches the player profile'
                                    },
                                    based_on_skills: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING },
                                        description: 'Which of the player skills make this possible'
                                    },
                                    based_on_knowledge: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING },
                                        description: 'Which domain knowledge areas make this possible'
                                    },
                                    based_on_friends: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING },
                                        description: 'Which friends/connections make this possible (use format: "Name (Job)")'
                                    }
                                },
                                required: ['title', 'description', 'reasoning', 'confidence', 'based_on_skills', 'based_on_knowledge', 'based_on_friends']
                            },
                            description: 'Exactly 1 bold opportunity recommendation uniquely suited to this player'
                        },
                        suggested_paths: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    path: {
                                        type: SchemaType.STRING,
                                        description: 'A specific dream path direction, e.g. "Start a Food Blog", "Freelance Full-Time"'
                                    },
                                    reasoning: {
                                        type: SchemaType.STRING,
                                        description: 'Why this path fits the player based on their skills, knowledge, friends'
                                    }
                                },
                                required: ['path', 'reasoning']
                            },
                            description: '2-3 dream path suggestions based on player profile. Only include when player has no dream path set.'
                        }
                    },
                    required: ['narrative', 'insight', 'suggestion', 'skills_improved', 'knowledge_gained', 'opportunities']
                }
            }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text) {
            throw new Error("No text returned from Gemini");
        }

        const outcome = JSON.parse(text);

        // Normalize the nested based_on structure for the frontend
        if (outcome.opportunities) {
            outcome.opportunities = outcome.opportunities.map((opp: {
                title: string;
                description: string;
                reasoning: string;
                confidence: string;
                based_on_skills?: string[];
                based_on_knowledge?: string[];
                based_on_friends?: string[];
                based_on?: { skills: string[]; knowledge: string[]; friends: string[] };
            }) => ({
                ...opp,
                based_on: {
                    skills: opp.based_on_skills || [],
                    knowledge: opp.based_on_knowledge || [],
                    friends: opp.based_on_friends || []
                }
            }));
        }

        return NextResponse.json(outcome);
    } catch (error) {
        console.error('Error evaluating action:', error);
        return NextResponse.json({ error: 'Failed to evaluate action' }, { status: 500 });
    }
}
