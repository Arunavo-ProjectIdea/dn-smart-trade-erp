"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from("profiles")
      .select("email")
      .eq("username", loginEmail)
      .single()
      
    if (error || !data) {
      return { success: false, error: "Invalid login credentials" }
    }
    loginEmail = data.email
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

export async function updateUserPasswordAndClearForceChange(password: string): Promise<ActionResponse> {
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
  
  if (data?.user) {
    await supabase.from('profiles').update({ force_password_change: false }).eq('id', data.user.id)
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

export async function uploadAvatar(formData: FormData): Promise<ActionResponse<string>> {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const file = formData.get("avatar") as File
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" }
  }

  if (file.size > 2 * 1024 * 1024) {
    return { success: false, error: "File exceeds 2MB limit" }
  }

  const ext = file.name.split(".").pop()
  const path = `${userData.user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path)

  const avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userData.user.id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  revalidatePath("/profile")
  return { success: true, data: avatarUrl }
}
