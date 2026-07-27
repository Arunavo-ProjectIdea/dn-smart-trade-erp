"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { User } from "@supabase/supabase-js"

export type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true, data }
}

export async function signOut(): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function resetPassword(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Email is required" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getCurrentUser(): Promise<ActionResponse<User>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return { success: false, error: error?.message || "User not found" }
  }

  return { success: true, data: data.user }
}
