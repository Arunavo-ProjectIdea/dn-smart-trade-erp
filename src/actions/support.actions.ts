"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const supportRequestSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["Low", "Medium", "High"], { required_error: "Priority is required" }),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

export type SupportRequestFormValues = z.infer<typeof supportRequestSchema>

export async function createSupportRequest(data: SupportRequestFormValues) {
  try {
    const supabase = await createClient()
    
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      throw new Error("Unauthorized")
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single()
    if (profile?.role !== 'Client') {
      throw new Error("Only clients can submit support requests")
    }

    const validatedData = supportRequestSchema.parse(data)

    const { error } = await supabase
      .from("support_requests")
      .insert({
        user_id: userData.user.id,
        subject: validatedData.subject,
        category: validatedData.category,
        priority: validatedData.priority,
        description: validatedData.description,
        status: "Open",
      })

    if (error) {
      console.error("Supabase insert error:", error)
      throw new Error("Failed to submit support request")
    }

    revalidatePath("/help")
    return { success: true }
  } catch (error) {
    console.error("Error creating support request:", error)
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function getUserSupportRequests() {
  try {
    const supabase = await createClient()
    
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      // In server components, returning empty array on unauthorized is safer
      return { success: false, data: [] }
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single()
    if (profile?.role !== 'Client') {
      return { success: true, data: [] }
    }

    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase select error:", error)
      return { success: false, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching support requests:", error)
    return { success: false, data: [] }
  }
}
