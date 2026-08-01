import { streamText } from 'ai';
import { defaultModel } from './groq';
import { getSystemPrompt, UserRole } from './prompts';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  searchHSCodes,
  getDutyInformation,
  getShipmentInformation,
  getBOEInformation,
  getClientInformation
} from './tools';

export async function processChatRequest(
  supabase: SupabaseClient,
  messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
  role: UserRole,
  sessionId?: string | null
) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const lastMessage = messages[messages.length - 1]?.content || "";
  const lowerMsg = lastMessage.toLowerCase();
  
  let dynamicContext = "";

  // Intent routing (Internal Tool Router)
  if (lowerMsg.includes("hs code")) {
    dynamicContext += await searchHSCodes(supabase, lastMessage);
  }
  if (lowerMsg.includes("duty") || lowerMsg.includes("cd ") || lowerMsg.includes("vat") || lowerMsg.includes("tax")) {
    const match = lastMessage.match(/\b\d{4,8}\b/);
    if (match) {
      dynamicContext += "\n" + await getDutyInformation(supabase, match[0]);
    }
  }
  if (lowerMsg.includes("shipment") || lowerMsg.includes("shp-")) {
    const match = lastMessage.match(/shp-\d+/i) || [lastMessage];
    const query = match[0].replace(/shp-/i, '').trim();
    if (query) {
       dynamicContext += "\n" + await getShipmentInformation(supabase, query);
    }
  }
  if (lowerMsg.includes("boe") || lowerMsg.includes("bill of entry")) {
    dynamicContext += "\n" + await getBOEInformation(supabase, lastMessage);
  }
  if (lowerMsg.includes("client")) {
    dynamicContext += "\n" + await getClientInformation(supabase, lastMessage);
  }

  const systemPrompt = getSystemPrompt(role) + (dynamicContext.trim() ? `\n\n### LIVE DATABASE CONTEXT ###\nThe system retrieved this live data based on the user's query. Use this to answer if relevant:\n${dynamicContext}` : "");

  return streamText({
    model: defaultModel,
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      if (sessionId) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('chat_messages').insert({
            session_id: sessionId,
            role: 'assistant',
            content: text
          });
        } catch (e) {
          console.error("Failed to save assistant message", e);
        }
      }
    }
  });
}
