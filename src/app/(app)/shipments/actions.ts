"use server"

import { createClient } from "@/lib/supabase/server"
import { Shipment } from "@/lib/types/shipment"
import { mapShipment, RawShipmentFromSupabase } from "./mappers"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"

type DbShipmentStatus = Database["public"]["Enums"]["shipment_status"]
type DbTransportType = Database["public"]["Enums"]["transport_type"]

export async function getShipments(): Promise<{ data: Shipment[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("shipments")
      .select(`
        *,
        clients!client_id (
          id,
          company_name
        ),
        assigned_employee:profiles!assigned_employee_id (
          id,
          full_name
        )
      `)
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
      .select(`
        *,
        clients!client_id (
          id,
          company_name
        ),
        assigned_employee:profiles!assigned_employee_id (
          id,
          full_name
        )
      `)
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
