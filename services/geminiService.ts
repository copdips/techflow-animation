import { GoogleGenAI, Type } from "@google/genai";
import { AnimationScript } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateAnimationScript = async (
  query: string, 
  isUrl: boolean
): Promise<AnimationScript> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = isUrl 
    ? `Analyze the technical content of this URL and generate an animation script: ${query}`
    : `Generate a technical animation script for this topic: ${query}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable grounding to handle URLs or current tech info
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING }, // Enum validation happens in UI/Types logic
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                },
                required: ["id", "label", "type", "x", "y"],
              },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  activeNodeIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  packets: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        from: { type: Type.STRING },
                        to: { type: Type.STRING },
                        label: { type: Type.STRING, nullable: true },
                        color: { type: Type.STRING, nullable: true },
                      },
                      required: ["from", "to"],
                    },
                  },
                },
                required: ["id", "title", "description", "activeNodeIds", "packets"],
              },
            },
          },
          required: ["title", "description", "nodes", "steps"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as AnimationScript;
      return data;
    } else {
      throw new Error("No content generated from Gemini.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
