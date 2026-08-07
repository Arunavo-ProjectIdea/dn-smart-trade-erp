"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"

export type NotificationType = Database["public"]["Enums"]["notification_type"]
export type NotificationPriority = Database["public"]["Enums"]["notification_priority"]
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"]

export type NotificationFilter = {
  type?: NotificationType | "all" | "unread"
  dateFrom?: string
  dateTo?: string
}

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────

export async function getNotifications(
  filter?: NotificationFilter
): Promise<ActionResult<NotificationRow[]>> {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return { success: false, error: "Not authenticated" }
  }

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })

  if (filter?.type && filter.type !== "all" && filter.type !== "unread") {
    query = query.eq("type", filter.type)
  }

  if (filter?.type === "unread") {
    query = query.eq("is_read", false)
  }

  if (filter?.dateFrom) {
    query = query.gte("created_at", filter.dateFrom)
  }

  if (filter?.dateTo) {
    query = query.lte("created_at", filter.dateTo)
  }

  let { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  // Seed initial notifications if user has 0 notifications
  if ((!data || data.length === 0) && (!filter?.type || filter.type === "all")) {
    const initialSeeds = [
      {
        user_id: userData.user.id,
        type: "shipment" as NotificationType,
        priority: "high" as NotificationPriority,
        title: "Shipment #SHP-8472 cleared customs",
        description: "Container MSKU4920193 cleared customs at Los Angeles Port.",
        is_read: false,
      },
      {
        user_id: userData.user.id,
        type: "boe" as NotificationType,
        priority: "medium" as NotificationPriority,
        title: "Bill of Entry #BOE-99231 Approved",
        description: "Customs duty payment of ৳24,500 verified and approved.",
        is_read: false,
      },
      {
        user_id: userData.user.id,
        type: "document" as NotificationType,
        priority: "medium" as NotificationPriority,
        title: "Commercial Invoice uploaded",
        description: "Commercial Invoice for Global Logistics Inc. uploaded successfully.",
        is_read: false,
      },
      {
        user_id: userData.user.id,
        type: "system" as NotificationType,
        priority: "low" as NotificationPriority,
        title: "Welcome to DN Smart Trade ERP",
        description: "Your enterprise dashboard & automated compliance engine are ready.",
        is_read: true,
      },
    ]

    await supabase.from("notifications").insert(initialSeeds)

    const refetched = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })

    data = refetched.data
  }

  return { success: true, data: data ?? [] }
}

export async function getUnreadCount(): Promise<ActionResult<number>> {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id)
    .eq("is_read", false)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: count ?? 0 }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/notifications")
  return { success: true }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userData.user.id)
    .eq("is_read", false)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/notifications")
  return { success: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteNotification(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/notifications")
  return { success: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE (reusable for Shipment, BOE, Document modules)
// ─────────────────────────────────────────────────────────────────────────────

export async function createNotification(params: {
  userId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  description: string
  entityId?: string
  entityType?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}): Promise<ActionResult<string>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: params.userId,
      type: params.type,
      priority: params.priority,
      title: params.title,
      description: params.description,
      entity_id: params.entityId ?? null,
      entity_type: params.entityType ?? null,
      data: params.data ?? {},
    })
    .select("id")
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data.id }
}
