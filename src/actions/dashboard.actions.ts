"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserProfile, ActionResponse } from "./auth.actions"
import { INACTIVE_SHIPMENT_STATUSES_SQL } from "@/lib/constants/shipment"

export type DashboardStats = {
  totalClients: number
  totalShipments: number
  totalDocuments: number
  totalBOE: number
  activeEmployees: number
  pendingDocuments: number
  pendingShipments: number
  activeShipments: number
  last30DaysClients: number
  last30DaysShipments: number
  last30DaysDocuments: number
}

export type ActivityItem = {
  id: string
  type: "document" | "shipment" | "client"
  title: string
  description: string
  timestamp: string
  actor: string
}

export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) {
    return { success: false, error: "Unauthorized" }
  }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString()

  try {
    if (role === "Client") {
      if (!client_id) {
        return { success: false, error: "No client profile found" }
      }

      // Client sees only their own data
      const [
        { count: totalShipments },
        { count: activeShipments },
        { count: pendingShipments },
        { count: totalDocuments },
        { count: pendingDocuments },
        { count: last30DaysShipments },
        { count: last30DaysDocuments },
      ] = await Promise.all([
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("client_id", client_id),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("client_id", client_id).not("status", "in", INACTIVE_SHIPMENT_STATUSES_SQL),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("client_id", client_id).eq("status", "Pending"),
        supabase.from("documents").select("*", { count: "exact", head: true }).eq("client_id", client_id),
        supabase.from("documents").select("*", { count: "exact", head: true }).eq("client_id", client_id).eq("status", "Pending Review"),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("client_id", client_id).gte("created_at", thirtyDaysAgoStr),
        supabase.from("documents").select("*", { count: "exact", head: true }).eq("client_id", client_id).gte("upload_date", thirtyDaysAgoStr),
      ])

      return {
        success: true,
        data: {
          totalClients: 0,
          totalShipments: totalShipments || 0,
          totalDocuments: totalDocuments || 0,
          totalBOE: 0,
          activeEmployees: 0,
          pendingDocuments: pendingDocuments || 0,
          pendingShipments: pendingShipments || 0,
          activeShipments: activeShipments || 0,
          last30DaysClients: 0,
          last30DaysShipments: last30DaysShipments || 0,
          last30DaysDocuments: last30DaysDocuments || 0,
        }
      }
    } else {
      // Admin / Employee sees operational data
      const [
        { count: totalClients },
        { count: totalShipments },
        { count: activeShipments },
        { count: pendingShipments },
        { count: totalDocuments },
        { count: pendingDocuments },
        { count: totalBOE },
        { count: activeEmployees },
        { count: last30DaysClients },
        { count: last30DaysShipments },
        { count: last30DaysDocuments },
      ] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("shipments").select("*", { count: "exact", head: true }),
        supabase.from("shipments").select("*", { count: "exact", head: true }).not("status", "in", INACTIVE_SHIPMENT_STATUSES_SQL),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "Pending"),
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "Pending Review"),
        supabase.from("bills_of_entry").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "Active").not("role", "eq", "Client"),
        supabase.from("clients").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgoStr),
        supabase.from("shipments").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgoStr),
        supabase.from("documents").select("*", { count: "exact", head: true }).gte("upload_date", thirtyDaysAgoStr),
      ])

      return {
        success: true,
        data: {
          totalClients: totalClients || 0,
          totalShipments: totalShipments || 0,
          totalDocuments: totalDocuments || 0,
          totalBOE: totalBOE || 0,
          activeEmployees: activeEmployees || 0,
          pendingDocuments: pendingDocuments || 0,
          pendingShipments: pendingShipments || 0,
          activeShipments: activeShipments || 0,
          last30DaysClients: last30DaysClients || 0,
          last30DaysShipments: last30DaysShipments || 0,
          last30DaysDocuments: last30DaysDocuments || 0,
        }
      }
    }
  } catch (error) {
    console.error("Dashboard Stats Error:", error)
    return { success: false, error: "Failed to fetch dashboard stats" }
  }
}

export async function getRecentActivities(): Promise<ActionResponse<ActivityItem[]>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  try {
    let docActivitiesQuery = supabase.from("document_activities")
      .select("id, action, date, details, document_id, profiles:actor_id(full_name), documents!inner(name, client_id)")
      .order("date", { ascending: false })
      .limit(10)

    let shipActivitiesQuery = supabase.from("shipment_timeline")
      .select("id, status, date, time, notes, shipment_id, profiles:responsible_employee_id(full_name), shipments!inner(shipment_number, client_id)")
      .order("date", { ascending: false })
      .limit(10)

    if (role === "Client" && client_id) {
      docActivitiesQuery = docActivitiesQuery.eq("documents.client_id", client_id)
      shipActivitiesQuery = shipActivitiesQuery.eq("shipments.client_id", client_id)
    }

    const [docActivitiesRes, shipActivitiesRes] = await Promise.all([
      docActivitiesQuery,
      shipActivitiesQuery
    ])

    const activities: ActivityItem[] = []

    if (docActivitiesRes.data) {
      for (const item of docActivitiesRes.data) {
        // Handle relations as arrays or objects
        const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
        const document = Array.isArray(item.documents) ? item.documents[0] : item.documents
        
        const actorName = (profile as any)?.full_name || "System"
        const docName = (document as any)?.name || "Unknown Document"

        activities.push({
          id: item.id,
          type: "document",
          title: item.action,
          description: `Document: ${docName}`,
          timestamp: item.date || new Date().toISOString(),
          actor: actorName
        })
      }
    }

    if (shipActivitiesRes.data) {
      for (const item of shipActivitiesRes.data) {
        const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
        const shipment = Array.isArray(item.shipments) ? item.shipments[0] : item.shipments

        const actorName = (profile as any)?.full_name || "System"
        const shipNum = (shipment as any)?.shipment_number || "Unknown Shipment"
        
        // combine date and time if available
        let timestamp = item.date
        if (item.time) {
           timestamp = `${item.date}T${item.time}`
           // Very rough fallback
           if (isNaN(new Date(timestamp).getTime())) {
             timestamp = item.date
           }
        }

        activities.push({
          id: item.id,
          type: "shipment",
          title: `Shipment status updated to: ${item.status}`,
          description: `Shipment: ${shipNum} - ${item.notes || "No notes"}`,
          timestamp: timestamp || new Date().toISOString(),
          actor: actorName
        })
      }
    }

    // Sort combined activities by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Return top 15 total
    return { success: true, data: activities.slice(0, 15) }

  } catch (error) {
    console.error("Recent Activities Error:", error)
    return { success: false, error: "Failed to fetch activities" }
  }
}

export async function getRecentDocuments(): Promise<ActionResponse<any[]>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  let query = supabase.from("documents")
    .select("id, name, status, upload_date, expiry_date, profiles:uploaded_by_id(full_name)")
    .order("upload_date", { ascending: false })
    .limit(5)

  if (role === "Client" && client_id) {
    query = query.eq("client_id", client_id)
  }

  const { data, error } = await query
  if (error) return { success: false, error: "Failed to fetch activities." }
  return { success: true, data }
}

export async function getRecentShipments(): Promise<ActionResponse<any[]>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  let query = supabase.from("shipments")
    .select("id, shipment_number, status, updated_at, clients(company_name)")
    .order("updated_at", { ascending: false })
    .limit(5)

  if (role === "Client" && client_id) {
    query = query.eq("client_id", client_id)
  }

  const { data, error } = await query
  if (error) return { success: false, error: "Failed to fetch upcoming tasks." }
  return { success: true, data }
}
