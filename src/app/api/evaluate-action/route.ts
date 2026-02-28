import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { goal, actionTitle, actionType } = body;

        if (!goal || !actionTitle) {
            return NextResponse.json({ error: 'Goal and actionTitle are required' }, { status: 400 });
        }

        const prompt = `The user wants to achieve: "${goal}". Tonight they chose to perform this action for 3 hours: "${actionTitle}" (Type: ${actionType}).
Write a 2-sentence realistic outcome of how it went, and suggest exactly which skills improved (or new ones acquired) as a result of this action. Keep it engaging.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        narrative: { type: SchemaType.STRING, description: '2-sentence realistic and engaging outcome of the action' },
                        skills_improved: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                            description: 'names of skills that improved, e.g. "Solidity", "Networking". Keep it to 1-2 skills maximum.'
                        }
                    },
                    required: ['narrative', 'skills_improved']
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
