import { NextResponse } from 'next/server';
import { processChatRequest } from '@/lib/ai/ai-service';
import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@/lib/ai/prompts';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role) {
        role = profile.role as UserRole;
      }
    }

    const result = await processChatRequest(supabase, messages, role);
    return result.toTextStreamResponse();
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
