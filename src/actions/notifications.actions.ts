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

  const { data, error } = await query

  if (error) {
    return { success: false, error: "Failed to fetch notifications." }
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
    return { success: false, error: "Failed to fetch unread notification count." }
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
    return { success: false, error: "Failed to mark notification as read." }
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
    return { success: false, error: "Failed to mark all notifications as read." }
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
    return { success: false, error: "Failed to delete notification." }
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
  message: string
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
      description: params.message,
      entity_id: params.entityId ?? null,
      entity_type: params.entityType ?? null,
      data: params.data ?? {},
    })
    .select("id")
    .single()

  if (error) {
    return { success: false, error: "Failed to create notification." }
  }

  return { success: true, data: data.id }
}

export async function notifyUsersByRoles(roles: Database['public']['Enums']['user_role'][], params: Omit<Parameters<typeof createNotification>[0], 'userId'>) {
  const supabase = await createClient()
  const { data: users, error } = await supabase.from('profiles').select('id, role').in('role', roles)
  if (error || !users) return { success: false, error: "Failed to process notification operation." }

  const promises = users.map(user => createNotification({ ...params, userId: user.id }))
  await Promise.all(promises)
  return { success: true }
}


export async function notifyUsersByClient(clientId: string, params: Omit<Parameters<typeof createNotification>[0], 'userId'>) {
  const supabase = await createClient()
  const { data: users, error } = await supabase.from('profiles').select('id').eq('client_id', clientId)
  if (error || !users) return { success: false, error: error?.message }

  const promises = users.map(user => createNotification({ ...params, userId: user.id }))
  await Promise.all(promises)
  return { success: true }
}


export async function notifyRolesAndClient(roles: Database['public']['Enums']['user_role'][], clientId: string | null, params: Omit<Parameters<typeof createNotification>[0], 'userId'>) {
  const promises: Promise<any>[] = []
  if (roles.length > 0) promises.push(notifyUsersByRoles(roles, params))
  if (clientId) promises.push(notifyUsersByClient(clientId, params))
  await Promise.all(promises)
  return { success: true }

}
