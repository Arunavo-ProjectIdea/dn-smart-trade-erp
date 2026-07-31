import { mockClients } from "./clients"
import { mockEmployees } from "./employees"

export interface Shipment {
  id: string
  trackingNumber: string
  clientId: string
  employeeId: string
  type: "Import" | "Export"
  status: "Pending" | "In Transit" | "Customs Clearance" | "Delivered" | "Delayed"
  originCountry: string
  destinationCountry: string
  value: number
  date: string
  boeNumber: string
}

const statuses: Shipment["status"][] = ["Pending", "In Transit", "Customs Clearance", "Delivered", "Delayed"]
const countries = ["USA", "UK", "China", "Germany", "Japan", "UAE", "India", "Canada", "Australia", "Singapore"]

export const mockShipments: Shipment[] = Array.from({ length: 50 }).map((_, i) => {
  const client = mockClients[i % 20]
  const employee = mockEmployees[i % 10]
  const type = i % 3 === 0 ? "Export" : "Import"
  const origin = type === "Import" ? countries[i % countries.length] : "USA"
  const dest = type === "Export" ? countries[(i + 1) % countries.length] : "USA"
  
  // Distribute dates over the last 12 months
  const date = new Date()
  date.setMonth(date.getMonth() - (i % 12))
  date.setDate(Math.max(1, (i * 7) % 28))

  return {
    id: `SHP-2026-${(1001 + i).toString()}`,
    trackingNumber: `TRK${Math.random().toString().substring(2, 10)}`,
    clientId: client.id,
    employeeId: employee.id,
    type,
    status: statuses[i % statuses.length],
    originCountry: origin,
    destinationCountry: dest,
    value: 5000 + (i * 1500) % 50000,
    date: date.toISOString(),
    boeNumber: `BOE-${2026000 + i}`,
  }
})

// KPI Data
export const kpiData = {
  totalClients: { value: 124, change: "+12%", trend: "up" },
  activeShipments: { value: 432, change: "+5%", trend: "up" },
  completedShipments: { value: 1289, change: "+18%", trend: "up" },
  revenueGenerated: { value: "$2.4M", change: "+8%", trend: "up" },
  boeProcessed: { value: 856, change: "-2%", trend: "down" },
  documentsUploaded: { value: 3421, change: "+24%", trend: "up" },
}

// Chart Data: 1. Shipment Status Distribution (Pie Chart)
export const shipmentStatusData = [
  { name: "Pending", value: 12 },
  { name: "In Transit", value: 35 },
  { name: "Customs Clearance", value: 20 },
  { name: "Delivered", value: 45 },
  { name: "Delayed", value: 5 },
]

// Chart Data: 2. Monthly Shipment Trend (Line Chart)
export const monthlyShipmentData = [
  { name: "Jan", shipments: 65 },
  { name: "Feb", shipments: 59 },
  { name: "Mar", shipments: 80 },
  { name: "Apr", shipments: 81 },
  { name: "May", shipments: 56 },
  { name: "Jun", shipments: 55 },
  { name: "Jul", shipments: 40 },
  { name: "Aug", shipments: 90 },
  { name: "Sep", shipments: 100 },
  { name: "Oct", shipments: 110 },
  { name: "Nov", shipments: 125 },
  { name: "Dec", shipments: 140 },
]

// Chart Data: 3. Import vs Export Analysis (Bar Chart)
export const importExportData = [
  { name: "Jan", Import: 40, Export: 25 },
  { name: "Feb", Import: 35, Export: 24 },
  { name: "Mar", Import: 50, Export: 30 },
  { name: "Apr", Import: 45, Export: 36 },
  { name: "May", Import: 30, Export: 26 },
  { name: "Jun", Import: 35, Export: 20 },
]

// Chart Data: 4. Top Clients by Shipment Volume (Horizontal Bar Chart)
export const topClientsData = [
  { name: "Sunset Imports Co.", volume: 312 },
  { name: "Global Logistics Inc.", volume: 142 },
  { name: "Apex Manufacturing", volume: 120 },
  { name: "Pacific Traders LLC", volume: 89 },
  { name: "TradeCorp Logistics", volume: 75 },
  { name: "EuroFreight Partners", volume: 60 },
  { name: "Alpha Impex", volume: 45 },
  { name: "Omega Exports", volume: 40 },
  { name: "Delta Shippers", volume: 35 },
  { name: "Zeta Trade", volume: 25 },
].sort((a, b) => b.volume - a.volume) // Sort for horizontal bar

// Chart Data: 5. Revenue Analytics (Area Chart)
export const revenueData = [
  { name: "Jan", revenue: 150000 },
  { name: "Feb", revenue: 180000 },
  { name: "Mar", revenue: 120000 },
  { name: "Apr", revenue: 200000 },
  { name: "May", revenue: 250000 },
  { name: "Jun", revenue: 220000 },
]

// Mock AI Insights
export const analyticsInsights = [
  "Shipment volume increased by 12% in the last quarter compared to the previous quarter.",
  "Sunset Imports Co. contributed 22% of total shipments this month.",
  "Delayed shipments decreased by 5% after the new customs clearance protocol was introduced.",
  "Revenue trend is positive, projected to reach $3.2M by year-end.",
]
