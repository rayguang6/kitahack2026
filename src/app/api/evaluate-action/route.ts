import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name, occupationType, occupationDetail, skillTags, friends, quarter,
            activities, // Array of { name, category, allocated }
            // legacy fallback fields
            goal, actionTitle, actionType
        } = body;

        // Build a rich player context string
        const playerName = name || "the player";
        const playerOccupation = occupationDetail ? `${occupationDetail} (${occupationType})` : occupationType || "professional";
        const playerSkills = skillTags && skillTags.length > 0 ? skillTags.join(', ') : 'none yet';
        const playerFriends = friends && friends.length > 0
            ? friends.map((f: { name: string; job: string }) => `${f.name} (${f.job})`).join(', ')
            : 'none';
        const quarterNum = quarter || 1;

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

        const prompt = `You are a life coach writing a quarterly review for ${playerName}.

Player Profile:
- Name: ${playerName}
- Occupation: ${playerOccupation}
- Current Skills: ${playerSkills}
- Connections/Friends: ${playerFriends}
- Quarter: ${quarterNum}

This quarter, ${playerName} spent their 8 free-time hours on:
${activitiesSummary}

Time breakdown: ${skillCount}h on skills/learning, ${hobbyCount}h on hobbies/leisure, ${socialCount}h on social/networking.

Write a personalized quarterly narrative summary. 
- Use ${playerName}'s actual name in the narrative.
- Reference specific activities they did.
- If they have friends, occasionally mention one by name in a natural context.
- Be warm, realistic, and encouraging (not generic).
- The narrative should be 3-4 sentences.
- The pattern insight should be 1 sentence about their focus pattern.
- The suggestion should be a specific, actionable next step for next quarter.
- Suggest 1-2 specific skills they gained or improved based on what they did.`;

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
                            description: '1 sentence about the player focus pattern this quarter (e.g. skill-heavy, well-balanced, socially driven)'
                        },
                        suggestion: {
                            type: SchemaType.STRING,
                            description: 'A specific, actionable next step for next quarter. Be concrete (e.g. Launch your first client project, Start posting content online).'
                        },
                        skills_improved: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                            description: '1-2 skill names they realistically gained this quarter based on their activities'
                        }
                    },
                    required: ['narrative', 'insight', 'suggestion', 'skills_improved']
                }
            }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text) {
            throw new Error("No text returned from Gemini");
        }

        const outcome = JSON.parse(text);
        return NextResponse.json(outcome);
    } catch (error) {
        console.error('Error evaluating action:', error);
        return NextResponse.json({ error: 'Failed to evaluate action' }, { status: 500 });
    }
}
