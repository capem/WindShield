
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTurbineStatusDescription(rpm: number, temperature: number, powerOutput: number): Promise<string> {
    const prompt = `Generate a very brief, one-sentence status report for a power turbine with these metrics: RPM: ${rpm}, Temperature: ${temperature}°C, Power Output: ${powerOutput} kW. The status report should be professional, technical, and concise.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching status from Gemini API:", error);
        return "Status analysis currently unavailable.";
    }
}
