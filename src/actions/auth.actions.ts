"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { User } from "@supabase/supabase-js"
import { Database } from "@/types/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
  const emailOrUsername = formData.get("email") as string
  const password = formData.get("password") as string

  if (!emailOrUsername || !password) {
    return { success: false, error: "Email or Username and password are required" }
  }

  const supabase = await createClient()

  let loginEmail = emailOrUsername
  if (!loginEmail.includes("@")) {
    const { data, error } = await supabase.rpc("get_email_by_username", { p_username: loginEmail })
    if (error || !data) {
      return { success: false, error: "Invalid login credentials" }
    }
    loginEmail = data
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
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

export async function updateUserPassword(password: string): Promise<ActionResponse> {
  if (!password) {
    return { success: false, error: "Password is required" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.updateUser({
    password,
  })

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

export async function getUserProfile(): Promise<ActionResponse<Profile & { user: User }>> {
  const supabase = await createClient()
  
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return { success: false, error: userError?.message || "User not found" }
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single()

  if (profileError || !profileData) {
    return { success: false, error: profileError?.message || "Profile not found" }
  }

  return { success: true, data: { ...profileData, user: userData.user } }
}

export async function updateUserProfile(updates: Partial<Profile>): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return { success: false, error: userError?.message || "User not found" }
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
