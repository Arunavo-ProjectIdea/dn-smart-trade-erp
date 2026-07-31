"use server"

import { createClient } from "@/lib/supabase/server"
import { Shipment } from "@/lib/types/shipment"
import { mapShipment, RawShipmentFromSupabase } from "./mappers"

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
