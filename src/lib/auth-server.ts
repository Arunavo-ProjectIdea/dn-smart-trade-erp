import { createClient } from "@/lib/supabase/server"
import { User, UserRole } from "./auth"

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Resolve role from public.profiles
    const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()

    return {
      id: user.id,
      name: profile?.full_name || user.email || 'User',
      email: user.email!,
      role: (profile?.role as UserRole) || 'Client'
    }
  } catch (e) {
    console.error("getCurrentUser error:", e)
    return null
  }
}
