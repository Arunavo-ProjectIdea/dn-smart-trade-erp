import { NextResponse } from 'next/server';
import { processChatRequest } from '@/lib/ai/ai-service';
import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@/lib/ai/prompts';

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI Companion is currently unavailable due to missing API configuration." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    
    // Get user profile to determine role
    const { data: { user } } = await supabase.auth.getUser();
    let role: UserRole = "Guest";
    let newSessionId: string | null = null;
    
    if (user) {
      // If no session ID provided, create one
      if (!sessionId) {
        const firstMessage = messages[0]?.content || 'New Chat';
        const title = firstMessage.length > 40 ? firstMessage.substring(0, 40) + '...' : firstMessage;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: sessionData } = await (supabase as any)
          .from('chat_sessions')
          .insert({ user_id: user.id, title })
          .select('id')
          .single();
          
        if (sessionData) {
          newSessionId = sessionData.id;
        }
      }

      // Save the user's latest message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user' && (sessionId || newSessionId)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('chat_messages').insert({
          session_id: sessionId || newSessionId,
          role: 'user',
          content: lastMessage.content
        });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role) {
        role = profile.role as UserRole;
      }
    }

    const result = await processChatRequest(supabase, messages, role, sessionId || newSessionId);
    return result.toTextStreamResponse({
      headers: {
        'x-session-id': sessionId || newSessionId || ''
      }
    });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    
    // Handle specific errors based on status or message if needed
    const err = error as { status?: number; message?: string };
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "Too many requests to the AI service. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}
