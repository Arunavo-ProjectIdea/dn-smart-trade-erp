"use server"

import { createClient } from "@/lib/supabase/server"
import { Shipment } from "@/lib/types/shipment"
import { mapShipment, RawShipmentFromSupabase } from "./mappers"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"
import { notifyRolesAndClient } from "@/actions/notifications.actions"

type DbShipmentStatus = Database["public"]["Enums"]["shipment_status"]
type DbTransportType = Database["public"]["Enums"]["transport_type"]
type ShipmentUpdate = Database["public"]["Tables"]["shipments"]["Update"]

const SELECT_SHIPMENT_QUERY = `
  *,
  clients!client_id (
    id,
    company_name
  ),
  assigned_employee:profiles!assigned_employee_id (
    id,
    full_name
  ),
  shipment_products (
    id,
    name,
    hs_code,
    quantity,
    weight
  ),
  shipment_timeline (
    id,
    status,
    date,
    time,
    location,
    notes,
    responsible_employee:profiles!responsible_employee_id (
      id,
      full_name
    )
  )
`

export async function getShipments(): Promise<{ data: Shipment[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("shipments")
      .select(SELECT_SHIPMENT_QUERY)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching shipments from Supabase:", error)
      return { data: null, error: error.message }
    }

    const mappedShipments = (data as unknown as RawShipmentFromSupabase[]).map(mapShipment)
    return { data: mappedShipments, error: null }
  } catch (err) {
    console.error("Unexpected error in getShipments action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load shipments" }
  }
}

export async function getShipmentById(id: string): Promise<{ data: Shipment | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("shipments")
      .select(SELECT_SHIPMENT_QUERY)
      .or(`id.eq.${id},shipment_number.eq.${id}`)
      .single()

    if (error || !data) {
      console.error("Error fetching shipment by ID:", error)
      return { data: null, error: error?.message || "Shipment not found" }
    }

    const mapped = mapShipment(data as unknown as RawShipmentFromSupabase)
    return { data: mapped, error: null }
  } catch (err) {
    console.error("Unexpected error in getShipmentById action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load shipment details" }
  }
}

export async function createShipmentAction(formData: Partial<Shipment>): Promise<{ success: boolean; data?: Shipment; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, id")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can create shipments." }
    }

    if (!formData.clientId) {
      return { success: false, error: "Please select a valid client." }
    }

    const validStatuses: DbShipmentStatus[] = [
      "Pending", "Booked", "Loaded", "In Transit", "Arrived",
      "Customs Clearance", "Released", "Delivered", "Delayed"
    ]
    const validTransportTypes: DbTransportType[] = ["Sea", "Air", "Land"]

    const status: DbShipmentStatus = validStatuses.includes(formData.status as DbShipmentStatus)
      ? (formData.status as DbShipmentStatus)
      : "Pending"

    const transportType: DbTransportType = validTransportTypes.includes(formData.transportType as DbTransportType)
      ? (formData.transportType as DbTransportType)
      : "Sea"

    const shipmentNumber = formData.shipmentNumber?.trim() || `SHP-${Date.now().toString().slice(-6)}`
    const assignedEmployeeId = formData.assignedEmployeeId || profile.id

    const insertData = {
      shipment_number: shipmentNumber,
      client_id: formData.clientId,
      status,
      exporter: formData.exporter || formData.clientName || "N/A",
      consignee: formData.consignee || formData.importer || "N/A",
      container_number: formData.containerNumber || null,
      container_size: formData.containerSize || "20ft",
      container_type: formData.containerType || "Standard",
      shipping_line: formData.shippingLine || null,
      vessel_name: formData.vesselName || null,
      voyage_number: formData.voyageNumber || null,
      origin_country: formData.originCountry || "China",
      destination_country: formData.destinationCountry || "Bangladesh",
      loading_port: formData.loadingPort || "Shanghai",
      discharge_port: formData.dischargePort || "Chittagong",
      arrival_port: formData.arrivalPort || "Chittagong",
      departure_date: formData.etd || new Date().toISOString().split("T")[0],
      eta: formData.eta || new Date().toISOString().split("T")[0],
      etd: formData.etd || new Date().toISOString().split("T")[0],
      incoterms: formData.incoterms || "FOB",
      transport_type: transportType,
      gross_weight: formData.grossWeight ? Number(formData.grossWeight) : null,
      net_weight: formData.netWeight ? Number(formData.netWeight) : null,
      package_count: formData.packageCount ? Number(formData.packageCount) : null,
      package_type: formData.packageType || "Cartons",
      assigned_employee_id: assignedEmployeeId
    }

    const { data: newRow, error: insertError } = await supabase
      .from("shipments")
      .insert(insertData)
      .select(SELECT_SHIPMENT_QUERY)
      .single()

    if (insertError) {
      console.error("Error creating shipment in Supabase:", insertError)
      return { success: false, error: insertError.message }
    }

    revalidatePath("/shipments")
    revalidatePath("/dashboard")

    const mapped = mapShipment(newRow as unknown as RawShipmentFromSupabase)
    return { success: true, data: mapped }
  } catch (err) {
    console.error("Unexpected error in createShipmentAction:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to create shipment" }
  }
}

export async function updateShipmentAction(id: string, formData: Partial<Shipment>): Promise<{ success: boolean; data?: Shipment; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, id")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can edit shipments." }
    }

    const validStatuses: DbShipmentStatus[] = [
      "Pending", "Booked", "Loaded", "In Transit", "Arrived",
      "Customs Clearance", "Released", "Delivered", "Delayed"
    ]
    const validTransportTypes: DbTransportType[] = ["Sea", "Air", "Land"]

    const status: DbShipmentStatus = validStatuses.includes(formData.status as DbShipmentStatus)
      ? (formData.status as DbShipmentStatus)
      : "Pending"

    const transportType: DbTransportType = validTransportTypes.includes(formData.transportType as DbTransportType)
      ? (formData.transportType as DbTransportType)
      : "Sea"

    const updateData: ShipmentUpdate = {
      status,
      transport_type: transportType,
      updated_at: new Date().toISOString()
    }

    if (formData.clientId) updateData.client_id = formData.clientId
    if (formData.shipmentNumber) updateData.shipment_number = formData.shipmentNumber.trim()
    if (formData.exporter !== undefined) updateData.exporter = formData.exporter
    if (formData.consignee !== undefined) updateData.consignee = formData.consignee
    if (formData.containerNumber !== undefined) updateData.container_number = formData.containerNumber || null
    if (formData.containerSize !== undefined) updateData.container_size = formData.containerSize
    if (formData.containerType !== undefined) updateData.container_type = formData.containerType
    if (formData.shippingLine !== undefined) updateData.shipping_line = formData.shippingLine || null
    if (formData.vesselName !== undefined) updateData.vessel_name = formData.vesselName || null
    if (formData.voyageNumber !== undefined) updateData.voyage_number = formData.voyageNumber || null
    if (formData.loadingPort !== undefined) updateData.loading_port = formData.loadingPort
    if (formData.dischargePort !== undefined) updateData.discharge_port = formData.dischargePort
    if (formData.eta) updateData.eta = formData.eta
    if (formData.etd) updateData.etd = formData.etd
    if (formData.incoterms !== undefined) updateData.incoterms = formData.incoterms
    if (formData.grossWeight !== undefined) updateData.gross_weight = formData.grossWeight ? Number(formData.grossWeight) : null
    if (formData.netWeight !== undefined) updateData.net_weight = formData.netWeight ? Number(formData.netWeight) : null
    if (formData.packageCount !== undefined) updateData.package_count = formData.packageCount ? Number(formData.packageCount) : null
    if (formData.packageType !== undefined) updateData.package_type = formData.packageType
    if (formData.assignedEmployeeId) updateData.assigned_employee_id = formData.assignedEmployeeId

    const { data: updatedRow, error: updateError } = await supabase
      .from("shipments")
      .update(updateData)
      .eq("id", id)
      .select(SELECT_SHIPMENT_QUERY)
      .single()

    if (updateError) {
      console.error("Error updating shipment in Supabase:", updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath("/shipments")
    revalidatePath(`/shipments/${id}`)
    revalidatePath(`/shipments/${id}/edit`)
    revalidatePath("/dashboard")

    const mapped = mapShipment(updatedRow as unknown as RawShipmentFromSupabase)
    return { success: true, data: mapped }
  } catch (err) {
    console.error("Unexpected error in updateShipmentAction:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to update shipment" }
  }
}

export async function deleteShipmentAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can delete shipments." }
    }

    const { error: deleteError } = await supabase
      .from("shipments")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Error deleting shipment from Supabase:", deleteError)
      return { success: false, error: deleteError.message }
    }

    revalidatePath("/shipments")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in deleteShipmentAction:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete shipment" }
  }
}

export async function createTimelineEntryAction(payload: {
  shipmentId: string
  status: string
  date?: string
  time?: string
  location?: string
  notes?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, id")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can update timeline." }
    }

    const today = new Date().toISOString().split("T")[0]
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const { error: timelineError } = await supabase
      .from("shipment_timeline")
      .insert({
        shipment_id: payload.shipmentId,
        status: payload.status,
        date: payload.date || today,
        time: payload.time || nowTime,
        location: payload.location || "Port",
        responsible_employee_id: profile.id,
        notes: payload.notes || null
      })

    if (timelineError) {
      console.error("Error creating timeline entry:", timelineError)
      return { success: false, error: timelineError.message }
    }

    const validStatuses: DbShipmentStatus[] = [
      "Pending", "Booked", "Loaded", "In Transit", "Arrived",
      "Customs Clearance", "Released", "Delivered", "Delayed"
    ]
    if (validStatuses.includes(payload.status as DbShipmentStatus)) {
      await supabase
        .from("shipments")
        .update({ status: payload.status as DbShipmentStatus, updated_at: new Date().toISOString() })
        .eq("id", payload.shipmentId)

      // Get client_id for the shipment
      const { data: shipmentData } = await supabase.from('shipments').select('client_id, shipment_number').eq('id', payload.shipmentId).single()
      if (shipmentData) {
        await notifyRolesAndClient(['Admin', 'Employee'], shipmentData.client_id, {
          type: 'shipment',
          priority: 'medium',
          title: 'Shipment Status Updated',
          message: `Shipment ${shipmentData.shipment_number || payload.shipmentId} is now ${payload.status}.`,
          entityId: payload.shipmentId,
          entityType: 'shipment'
        })
      }
    }

    revalidatePath("/shipments")
    revalidatePath(`/shipments/${payload.shipmentId}`)

    return { success: true }
  } catch (err) {
    console.error("Unexpected error in createTimelineEntryAction:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to add timeline entry" }
  }
}

export async function createShipmentProductAction(payload: {
  shipmentId: string
  name: string
  hsCode?: string
  quantity: number
  weight?: number
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can manage products." }
    }

    if (!payload.name) return { success: false, error: "Product name is required." }

    const { error: insertError } = await supabase
      .from("shipment_products")
      .insert({
        shipment_id: payload.shipmentId,
        name: payload.name,
        hs_code: payload.hsCode || null,
        quantity: payload.quantity || 1,
        weight: payload.weight ? Number(payload.weight) : null
      })

    if (insertError) {
      console.error("Error creating shipment product:", insertError)
      return { success: false, error: insertError.message }
    }

    revalidatePath(`/shipments/${payload.shipmentId}`)
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in createShipmentProductAction:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to add product" }
  }
}

export async function deleteShipmentProductAction(productId: string, shipmentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can delete products." }
    }

    const { error: deleteError } = await supabase
      .from("shipment_products")
      .delete()
      .eq("id", productId)

    if (deleteError) {
      console.error("Error deleting product:", deleteError)
      return { success: false, error: deleteError.message }
    }

    revalidatePath(`/shipments/${shipmentId}`)
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in deleteShipmentProductAction:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete product" }
  }
}
