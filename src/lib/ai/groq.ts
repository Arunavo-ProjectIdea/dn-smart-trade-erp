import { createGroq } from '@ai-sdk/groq';

if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not set. AI Companion will not work.");
}

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export const defaultModel = groq('groq/compound');
