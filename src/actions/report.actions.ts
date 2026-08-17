"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserProfile, ActionResponse } from "./auth.actions"
import { COMPLETED_SHIPMENT_STATUSES, INACTIVE_SHIPMENT_STATUSES_SQL } from "@/lib/constants/shipment"

export interface ReportKPIs {
  totalClients: number
  totalShipments: number
  totalDocuments: number
  totalBOE: number
  activeEmployees: number
  completedShipments: number
  activeShipments: number
}

export interface MonthlyTrend {
  month: string
  shipments: number
  documents: number
  clients: number
}

export interface ShipmentAnalytics {
  byStatus: Record<string, number>
  byTransportType: Record<string, number>
}

export interface DocumentAnalytics {
  byStatus: Record<string, number>
  byCategory: Record<string, number>
}

export interface ClientAnalytics {
  byStatus: Record<string, number>
  byType: Record<string, number>
}

export interface ReportTableRow {
  id: string
  date: string
  entityType: "Shipment" | "Document" | "Client" | "BOE"
  entityName: string
  status: string
  user: string
}

export async function getReportKPIs(): Promise<ActionResponse<ReportKPIs>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  try {
    if (role === "Client") {
      if (!client_id) return { success: false, error: "No client profile found" }

      const [
        { count: totalShipments },
        { count: completedShipments },
        { count: activeShipments },
        { count: totalDocuments },
      ] = await Promise.all([
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("client_id", client_id),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("client_id", client_id).in("status", COMPLETED_SHIPMENT_STATUSES),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("client_id", client_id).not("status", "in", INACTIVE_SHIPMENT_STATUSES_SQL),
        supabase.from("documents").select("*", { count: "exact", head: true }).eq("client_id", client_id),
      ])

      return {
        success: true,
        data: {
          totalClients: 0,
          totalShipments: totalShipments || 0,
          totalDocuments: totalDocuments || 0,
          totalBOE: 0,
          activeEmployees: 0,
          completedShipments: completedShipments || 0,
          activeShipments: activeShipments || 0,
        }
      }
    } else {
      const [
        { count: totalClients },
        { count: totalShipments },
        { count: completedShipments },
        { count: activeShipments },
        { count: totalDocuments },
        { count: totalBOE },
        { count: activeEmployees },
      ] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("shipments").select("*", { count: "exact", head: true }),
        supabase.from("shipments").select("*", { count: "exact", head: true }).in("status", COMPLETED_SHIPMENT_STATUSES),
        supabase.from("shipments").select("*", { count: "exact", head: true }).not("status", "in", INACTIVE_SHIPMENT_STATUSES_SQL),
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("bills_of_entry").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "Active").not("role", "eq", "Client"),
      ])

      return {
        success: true,
        data: {
          totalClients: totalClients || 0,
          totalShipments: totalShipments || 0,
          totalDocuments: totalDocuments || 0,
          totalBOE: totalBOE || 0,
          activeEmployees: activeEmployees || 0,
          completedShipments: completedShipments || 0,
          activeShipments: activeShipments || 0,
        }
      }
    }
  } catch (error) {
    console.error("Report KPIs Error:", error)
    return { success: false, error: "Failed to fetch report KPIs" }
  }
}

export async function getShipmentAnalytics(): Promise<ActionResponse<ShipmentAnalytics>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  let query = supabase.from("shipments").select("status, transport_type")
  if (role === "Client" && client_id) {
    query = query.eq("client_id", client_id)
  }

  const { data, error } = await query
  if (error) return { success: false, error: "Failed to generate shipments report." }

  const byStatus: Record<string, number> = {}
  const byTransportType: Record<string, number> = {}

  data.forEach(s => {
    const status = s.status || "Unknown"
    const tType = s.transport_type || "Unknown"
    byStatus[status] = (byStatus[status] || 0) + 1
    byTransportType[tType] = (byTransportType[tType] || 0) + 1
  })

  return { success: true, data: { byStatus, byTransportType } }
}

export async function getDocumentAnalytics(): Promise<ActionResponse<DocumentAnalytics>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  let query = supabase.from("documents").select("status, category")
  if (role === "Client" && client_id) {
    query = query.eq("client_id", client_id)
  }

  const { data, error } = await query
  if (error) return { success: false, error: "Failed to generate financial report." }

  const byStatus: Record<string, number> = {}
  const byCategory: Record<string, number> = {}

  data.forEach(d => {
    const status = d.status || "Unknown"
    const cat = d.category || "Unknown"
    byStatus[status] = (byStatus[status] || 0) + 1
    byCategory[cat] = (byCategory[cat] || 0) + 1
  })

  return { success: true, data: { byStatus, byCategory } }
}

export async function getClientAnalytics(): Promise<ActionResponse<ClientAnalytics>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role } = profileRes.data
  if (role === "Client") {
    return { success: true, data: { byStatus: {}, byType: {} } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.from("clients").select("status, client_type")
  if (error) return { success: false, error: "Failed to generate operations report." }

  const byStatus: Record<string, number> = {}
  const byType: Record<string, number> = {}

  data.forEach(c => {
    const status = c.status || "Unknown"
    const type = c.client_type || "Unknown"
    byStatus[status] = (byStatus[status] || 0) + 1
    byType[type] = (byType[type] || 0) + 1
  })

  return { success: true, data: { byStatus, byType } }
}

export async function getMonthlyTrends(): Promise<ActionResponse<MonthlyTrend[]>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  const months: string[] = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toLocaleString("default", { month: "short" }))
  }

  const trends: MonthlyTrend[] = months.map(month => ({
    month,
    shipments: 0,
    documents: 0,
    clients: 0
  }))

  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString()

  let shipQuery = supabase.from("shipments").select("created_at").gte("created_at", twelveMonthsAgo)
  let docQuery = supabase.from("documents").select("upload_date").gte("upload_date", twelveMonthsAgo)
  let clientQuery = supabase.from("clients").select("created_at").gte("created_at", twelveMonthsAgo)

  if (role === "Client" && client_id) {
    shipQuery = shipQuery.eq("client_id", client_id)
    docQuery = docQuery.eq("client_id", client_id)
    // Clients don't see client trends
  }

  const [shipRes, docRes, clientRes] = await Promise.all([
    shipQuery,
    docQuery,
    role === "Client" ? Promise.resolve({ data: [] }) : clientQuery
  ])

  const processDates = (data: any[] | null, dateField: string, type: "shipments" | "documents" | "clients") => {
    if (!data) return
    data.forEach(item => {
      if (!item[dateField]) return
      const d = new Date(item[dateField])
      const mStr = d.toLocaleString("default", { month: "short" })
      const t = trends.find(t => t.month === mStr)
      if (t) t[type]++
    })
  }

  processDates(shipRes.data, "created_at", "shipments")
  processDates(docRes.data, "upload_date", "documents")
  processDates(clientRes.data, "created_at", "clients")

  return { success: true, data: trends }
}

export async function getReportTableRows(): Promise<ActionResponse<ReportTableRow[]>> {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return { success: false, error: "Unauthorized" }

  const { role, client_id } = profileRes.data
  const supabase = await createClient()

  try {
    let shipQuery = supabase.from("shipments")
      .select("id, shipment_number, status, updated_at, clients(company_name)")
      .order("updated_at", { ascending: false })
      .limit(10)

    let docQuery = supabase.from("documents")
      .select("id, name, status, upload_date, profiles:uploaded_by_id(full_name)")
      .order("upload_date", { ascending: false })
      .limit(10)

    if (role === "Client" && client_id) {
      shipQuery = shipQuery.eq("client_id", client_id)
      docQuery = docQuery.eq("client_id", client_id)
    }

    const [shipRes, docRes] = await Promise.all([shipQuery, docQuery])
    const rows: ReportTableRow[] = []

    if (shipRes.data) {
      shipRes.data.forEach(s => {
        rows.push({
          id: s.id,
          date: s.updated_at || new Date().toISOString(),
          entityType: "Shipment",
          entityName: s.shipment_number,
          status: s.status || "Unknown",
          user: Array.isArray(s.clients) ? s.clients[0]?.company_name : (s.clients as any)?.company_name || "System"
        })
      })
    }

    if (docRes.data) {
      docRes.data.forEach(d => {
        rows.push({
          id: d.id,
          date: d.upload_date || new Date().toISOString(),
          entityType: "Document",
          entityName: d.name,
          status: d.status || "Unknown",
          user: Array.isArray(d.profiles) ? d.profiles[0]?.full_name : (d.profiles as any)?.full_name || "System"
        })
      })
    }

    rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return { success: true, data: rows.slice(0, 15) }

  } catch (error) {
    console.error("Report Table Rows Error:", error)
    return { success: false, error: "Failed to fetch report rows" }
  }
}
