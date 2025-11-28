import { GoogleGenAI } from "@google/genai";

// Initialize the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHealthAssistantResponse = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: "You are a helpful, empathetic medical assistant for the MediSwift app. You help users understand medicines, side effects, and general wellness. Disclaimer: Always advise users to consult a doctor for serious issues. Keep answers concise and mobile-friendly.",
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the medical database right now. Please try again later.";
  }
};