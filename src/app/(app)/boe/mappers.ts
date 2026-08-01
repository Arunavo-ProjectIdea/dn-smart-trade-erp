import { BillOfEntry, BOEProduct, BOETimelineEvent, BOEStatus } from "@/lib/types/boe"

export interface RawBOEFromSupabase {
  id: string
  boe_number: string
  shipment_id: string
  status: string | null
  notes: string | null
  duties_import_duty: number | null
  duties_vat: number | null
  duties_ait: number | null
  duties_at: number | null
  duties_other_charges: number | null
  duties_grand_total: number | null
  created_at: string | null
  updated_at: string | null
  shipment?: {
    id: string
    shipment_number: string
    loading_port: string | null
    discharge_port: string | null
    arrival_port: string | null
    origin_country: string | null
    shipping_line: string | null
    vessel_name: string | null
    container_number: string | null
    eta: string | null
    created_at: string | null
    client?: {
      id: string
      company_name: string
      contact_person: string
      bin_number: string | null
      tin_number: string | null
      address: string
    } | null
  } | null
  boe_products?: Array<{
    id: string
    product_name: string
    hs_code: string | null
    quantity: number
    unit: string
    declared_value: number
    currency: string
  }> | null
  boe_timeline?: Array<{
    id: string
    status: string
    date: string
    note: string | null
    author?: {
      full_name: string
    } | null
  }> | null
}

export function mapBOE(raw: RawBOEFromSupabase): BillOfEntry {
  const client = raw.shipment?.client

  const importer = {
    clientName: client?.contact_person || client?.company_name || "N/A",
    companyName: client?.company_name || "N/A",
    bin: client?.bin_number || "N/A",
    tin: client?.tin_number || "N/A",
    address: client?.address || "N/A",
  }

  const port = raw.shipment?.discharge_port || raw.shipment?.arrival_port || raw.shipment?.loading_port || "Chittagong Port"
  const carrier = raw.shipment?.shipping_line || raw.shipment?.vessel_name || "N/A"

  const shipment = {
    shipmentId: raw.shipment?.shipment_number || raw.shipment_id,
    port,
    countryOfOrigin: raw.shipment?.origin_country || "N/A",
    carrier,
    containerNumber: raw.shipment?.container_number || "N/A",
    arrivalDate: raw.shipment?.eta || raw.shipment?.created_at || raw.created_at || new Date().toISOString(),
  }

  const products: BOEProduct[] = (raw.boe_products || []).map((p) => ({
    id: p.id,
    productName: p.product_name,
    hsCode: p.hs_code || "N/A",
    quantity: Number(p.quantity) || 0,
    unit: p.unit || "Pieces",
    declaredValue: Number(p.declared_value) || 0,
    currency: p.currency || "USD",
  }))

  const importDuty = Number(raw.duties_import_duty) || 0
  const vat = Number(raw.duties_vat) || 0
  const ait = Number(raw.duties_ait) || 0
  const at = Number(raw.duties_at) || 0
  const otherCharges = Number(raw.duties_other_charges) || 0
  const grandTotal = Number(raw.duties_grand_total) || (importDuty + vat + ait + at + otherCharges)

  const duties = {
    importDuty,
    vat,
    ait,
    at,
    otherCharges,
    grandTotal,
  }

  const timeline: BOETimelineEvent[] = (raw.boe_timeline || []).map((t) => ({
    id: t.id,
    date: t.date || raw.created_at || new Date().toISOString(),
    status: (t.status as BOEStatus) || "Draft",
    note: t.note || "",
    author: t.author?.full_name || "System",
  }))

  const validStatuses: BOEStatus[] = ["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Completed"]
  const status: BOEStatus = validStatuses.includes(raw.status as BOEStatus) ? (raw.status as BOEStatus) : "Draft"

  return {
    id: raw.id,
    boeNumber: raw.boe_number,
    status,
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.created_at || new Date().toISOString(),
    importer,
    shipment,
    products,
    duties,
    timeline,
    notes: raw.notes || undefined,
  }
}
