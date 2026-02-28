import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize the SDK
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, occupationType, occupationDetail, skills, friends, quarter, interests } = body;

        const playerName = name || "the player";
        const playerOccupation = occupationDetail ? `${occupationDetail} (${occupationType})` : occupationType || "professional";
        const playerSkills = skills && skills.length > 0 ? skills.join(', ') : 'None specified';
        const playerFriends = friends && friends.length > 0
            ? friends.map((f: { name: string; job: string }) => `${f.name} (${f.job})`).join(', ')
            : 'None';
        const playerInterests = interests && interests.length > 0 ? interests.join(', ') : 'Not specified';
        const quarterNum = quarter || 1;

        const prompt = `You are an expert life coach helping ${playerName} discover their path to greater freedom and fulfillment.

Player Profile:
- Name: ${playerName}
- Occupation: ${playerOccupation}
- Current Skills: ${playerSkills}
- Interests: ${playerInterests}
- Connections: ${playerFriends}
- Current Quarter: Q${quarterNum}

Suggest exactly 3 macro-level, actionable quarterly projects or milestones that are:
1. Highly relevant to ${playerName}'s specific occupation and interests
2. Achievable as a side project or skill-building effort over one quarter (3 months)
3. Substantially ambitious — not just reading a book (e.g. "Build a Portfolio Site", "Start a Freelance Service", "Launch a YouTube Channel", "Join a Trading Community")
4. Progressing toward greater personal freedom/opportunities based on their profile

Each title must be ultra-short (max 5 words) and each type must be one of: coding, learning, social.
Make them feel personal and specific to ${playerName}'s background — not generic advice anyone could get.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING, description: 'Ultra short actionable title, max 5 words' },
                            description: { type: SchemaType.STRING, description: 'One short sentence explaining why this helps this specific player' },
                            type: { type: SchemaType.STRING, description: 'One of: coding, learning, social' }
                        },
                        required: ['title', 'description', 'type']
                    }
                }
            }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text) {
            throw new Error("No text returned from Gemini");
        }

        const actions = JSON.parse(text);

        return NextResponse.json({ actions });
    } catch (error) {
        console.error('Error generating actions:', error);
        return NextResponse.json({ error: 'Failed to generate actions' }, { status: 500 });
    }
}
