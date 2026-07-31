import { CargoProduct, Shipment, ShipmentStatus, TimelineEvent, TimelineEventStatus } from "@/lib/types/shipment"

export interface RawShipmentFromSupabase {
  id: string
  shipment_number: string
  client_id: string
  status: string | null
  exporter: string | null
  consignee: string | null
  container_number: string | null
  container_size: string | null
  container_type: string | null
  shipping_line: string | null
  vessel_name: string | null
  voyage_number: string | null
  origin_country: string | null
  destination_country: string | null
  loading_port: string | null
  discharge_port: string | null
  arrival_port: string | null
  departure_date: string | null
  eta: string | null
  etd: string | null
  incoterms: string | null
  transport_type: string | null
  gross_weight: number | null
  net_weight: number | null
  package_count: number | null
  package_type: string | null
  assigned_employee_id: string | null
  created_at: string | null
  updated_at: string | null
  clients?: {
    id: string
    company_name: string
  } | null
  assigned_employee?: {
    id: string
    full_name: string
  } | null
  shipment_products?: Array<{
    id: string
    name: string
    hs_code: string | null
    quantity: number
    weight: number | null
  }> | null
  shipment_timeline?: Array<{
    id: string
    status: string
    date: string
    time: string | null
    location: string | null
    notes: string | null
    responsible_employee?: {
      id: string
      full_name: string
    } | null
  }> | null
}

export function mapShipment(raw: RawShipmentFromSupabase): Shipment {
  const clientName = raw.clients?.company_name || "Unknown Client"
  const assignedEmployeeName = raw.assigned_employee?.full_name || "Unassigned"

  const products: CargoProduct[] = (raw.shipment_products || []).map((p) => ({
    id: p.id,
    name: p.name,
    hsCode: p.hs_code || "",
    quantity: Number(p.quantity || 0),
    weight: Number(p.weight || 0),
  }))

  const hsCodes = Array.from(new Set(products.map((p) => p.hsCode).filter(Boolean)))

  const timeline: TimelineEvent[] = (raw.shipment_timeline || []).map((t) => ({
    id: t.id,
    status: (t.status as TimelineEventStatus) || "Booked",
    date: t.date || new Date().toISOString().split("T")[0],
    time: t.time || "12:00 PM",
    location: t.location || "Port",
    responsibleEmployee: t.responsible_employee?.full_name || assignedEmployeeName,
    notes: t.notes || "",
  }))

  return {
    id: raw.id,
    shipmentNumber: raw.shipment_number,
    status: (raw.status as ShipmentStatus) || "Pending",
    clientId: raw.client_id,
    clientName,
    importer: clientName,
    exporter: raw.exporter || "N/A",
    consignee: raw.consignee || clientName,
    containerNumber: raw.container_number || "",
    containerSize: raw.container_size || "40ft",
    containerType: raw.container_type || "Standard",
    shippingLine: raw.shipping_line || "",
    vesselName: raw.vessel_name || "",
    voyageNumber: raw.voyage_number || "",
    originCountry: raw.origin_country || "China",
    destinationCountry: raw.destination_country || "Bangladesh",
    loadingPort: raw.loading_port || "Chittagong",
    dischargePort: raw.discharge_port || "Chittagong",
    arrivalPort: raw.arrival_port || "Chittagong",
    departureDate: raw.departure_date || new Date().toISOString().split("T")[0],
    eta: raw.eta || new Date().toISOString().split("T")[0],
    etd: raw.etd || new Date().toISOString().split("T")[0],
    incoterms: raw.incoterms || "FOB",
    transportType: (raw.transport_type as "Sea" | "Air" | "Land") || "Sea",
    products,
    hsCodes,
    grossWeight: Number(raw.gross_weight || 0),
    netWeight: Number(raw.net_weight || 0),
    packageCount: Number(raw.package_count || 0),
    packageType: raw.package_type || "Boxes",
    description: "",
    customsStatus: "Pending",
    clearanceStatus: "Pending",
    timeline,
    assignedEmployeeId: raw.assigned_employee_id || "",
    assignedEmployeeName,
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || new Date().toISOString(),
  }
}
