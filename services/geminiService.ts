import { GoogleGenAI, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Initialize ai and chat variables, but they might be null if no API_KEY is present.
let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and creative assistant. Provide clear and concise answers.',
    },
  });
}

export const sendMessageStream = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  if (!chat) {
    onChunk("Error: API key is not configured. This app cannot connect to the Gemini API on this deployed version.");
    console.error("API_KEY environment variable is not set.");
    return;
  }

  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    onChunk("Sorry, I encountered an error. Please try again.");
  }
};