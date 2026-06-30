import { StatusType } from "@/components/erp/status-badge"
import { mockClients } from "./clients"

export interface Shipment {
  id: string
  clientId: string
  clientName: string
  type: "Import" | "Export"
  containerNumber: string
  billOfLading: string
  originCountry: string
  destinationCountry: string
  carrier: string
  shippingLine: string
  portOfLoading: string
  portOfDestination: string
  departureDate: string
  expectedArrivalDate: string
  status: StatusType
  cargoDescription: string
  totalWeight: number // in kg
  numberOfPackages: number
  notes: string
  createdAt: string
  declaredValue?: number
  isUrgent?: boolean
  progress?: number
  hasAiDraft?: boolean
  actionRequired?: boolean
}

const origins = ["China", "USA", "Germany", "Japan", "India", "UK", "Brazil"]
const destinations = ["USA", "Canada", "UK", "Australia", "UAE", "Singapore"]
const carriers = ["Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "Evergreen"]
const statuses: StatusType[] = ["Pending", "In Transit", "Customs Clearance", "Delivered", "Completed", "Delayed", "Cancelled"]

export const mockShipments: Shipment[] = []

for (let i = 1; i <= 25; i++) {
  const client = mockClients[i % mockClients.length]
  const type = i % 2 === 0 ? "Import" : "Export"
  const status = statuses[i % statuses.length]
  const origin = type === "Import" ? origins[i % origins.length] : "Local Port"
  const destination = type === "Export" ? destinations[i % destinations.length] : "Local Port"
  
  mockShipments.push({
    id: `SHP-10${i.toString().padStart(2, '0')}`,
    clientId: client.id,
    clientName: client.companyName,
    type,
    containerNumber: `CONT${Math.floor(Math.random() * 9000000) + 1000000}`,
    billOfLading: `BOL-${Math.floor(Math.random() * 90000) + 10000}`,
    originCountry: origin,
    destinationCountry: destination,
    carrier: carriers[i % carriers.length],
    shippingLine: `${carriers[i % carriers.length]} Line`,
    portOfLoading: `${origin} Port`,
    portOfDestination: `${destination} Port`,
    departureDate: `2026-06-${(i % 28 + 1).toString().padStart(2, '0')}T10:00:00Z`,
    expectedArrivalDate: `2026-07-${(i % 28 + 1).toString().padStart(2, '0')}T14:00:00Z`,
    status,
    cargoDescription: `Industrial Equipment and Parts - Batch ${i}`,
    totalWeight: 15000 + i * 500,
    numberOfPackages: 100 + i * 10,
    notes: i % 4 === 0 ? "Priority shipment requested by client." : "Standard handling.",
    createdAt: `2026-05-${(i % 28 + 1).toString().padStart(2, '0')}T09:00:00Z`,
    declaredValue: 10000 + (i * 15400) % 250000,
    isUrgent: i % 7 === 0,
    progress: (i * 15) % 100,
    hasAiDraft: i % 3 === 0,
    actionRequired: i % 11 === 0
  })
}
