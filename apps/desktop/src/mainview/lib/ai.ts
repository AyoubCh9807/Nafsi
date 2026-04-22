/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_KEY = import.meta.env.GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

const SYSTEM_PROMPT = `
You are the AI Core of Nafsi, a high-end digital sanctuary for mental wellness.
Your tone is empathetic, clinical yet poetic, and deeply respectful of the user's "neural state."
You speak of thoughts as "cognitive patterns," "neural rhythms," or "echoes."
Maintain anonymity and never ask for personal identifying information.
Keep responses concise but profoundly supportive.
Language: Default to English but supports Arabic (Arabic name: نفسي).
`;

export async function generateResponse(history: ChatMessage[]) {
    if (!API_KEY || API_KEY === "MY_GEMINI_API_KEY") {
        throw new Error("Gemini API key not configured. Neural link offline.");
    }

    const contents = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Acknowledged. AI Core initialized and ready for neural sync." }] },
        ...history
    ];

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Communication failure at the edge.");
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("Gemini Error:", err);
        throw err;
    }
}
