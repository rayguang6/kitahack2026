import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize the SDK
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { goal, skills } = body;

        if (!goal) {
            return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
        }

        const prompt = `You are an expert career coach. The user wants to achieve: "${goal}". 
Their current skills are: ${skills && skills.length > 0 ? skills.join(', ') : 'None specified'}. 
Suggest 3 macro-level, actionable projects or milestones they should focus on for this **Quarter**.
These should be substantial and longer-term tasks (e.g. "Start a YouTube Channel", "Master B2B Sales", "Launch Ecom Store", "Build Fullstack SaaS"), not simple nightly reading tasks.
However, keep the title ultra short (max 5 words) so it's easy to read in a UI list.
Make them highly relevant to their ultimate goal.`;

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
                            description: { type: SchemaType.STRING, description: 'One short sentence explaining why this helps' },
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
