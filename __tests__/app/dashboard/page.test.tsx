import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import DashboardPage from "../../../src/app/(app)/dashboard/page"
import { getUserProfile } from "../../../src/actions/auth.actions"
import { getDashboardStats, getRecentActivities, getRecentDocuments, getRecentShipments } from "../../../src/actions/dashboard.actions"

vi.mock("../../../src/actions/auth.actions", () => ({
  getUserProfile: vi.fn(),
}))

vi.mock("../../../src/actions/dashboard.actions", () => ({
  getDashboardStats: vi.fn(),
  getRecentActivities: vi.fn(),
  getRecentDocuments: vi.fn(),
  getRecentShipments: vi.fn(),
}))

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getDashboardStats).mockResolvedValue({
      data: {
        totalClients: 5,
        totalShipments: 12,
        totalDocuments: 20,
        totalBOE: 8,
        activeEmployees: 3,
        pendingDocuments: 2,
        pendingShipments: 4,
        activeShipments: 6,
        last30DaysClients: 1,
        last30DaysShipments: 3,
        last30DaysDocuments: 5,
      }
    } as any)

    vi.mocked(getRecentActivities).mockResolvedValue({ data: [] } as any)
    vi.mocked(getRecentDocuments).mockResolvedValue({ data: [] } as any)
    vi.mocked(getRecentShipments).mockResolvedValue({ data: [] } as any)
  })

  it("renders Admin Dashboard with admin stats", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({ data: { role: "Admin" } } as any)
    
    const ui = await DashboardPage()
    render(ui)

    expect(screen.getByRole("heading", { name: "Admin Dashboard" })).toBeInTheDocument()
    expect(screen.getByText("Overview of your enterprise logistics and trade operations.")).toBeInTheDocument()
    
    // Check for some admin specific stats
    expect(screen.getByText("Active Employees")).toBeInTheDocument()
    expect(screen.getByText("Pending Shipments")).toBeInTheDocument()
  })

  it("renders Client Dashboard with client stats", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({ data: { role: "Client" } } as any)
    
    const ui = await DashboardPage()
    render(ui)

    expect(screen.getByRole("heading", { name: "My Trade Dashboard" })).toBeInTheDocument()
    expect(screen.getByText("Track your shipments, documents, and trade activity.")).toBeInTheDocument()
    
    // Check for some client specific stats
    expect(screen.getByText("My Active Shipments")).toBeInTheDocument()
    expect(screen.getByText("My Total Shipments")).toBeInTheDocument()
    
    // Admin stats shouldn't be there
    expect(screen.queryByText("Active Employees")).not.toBeInTheDocument()
  })

  it("renders empty states when no recent data", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({ data: { role: "Admin" } } as any)
    
    const ui = await DashboardPage()
    render(ui)

    expect(screen.getByText("No shipments found")).toBeInTheDocument()
    expect(screen.getByText("No recent activity")).toBeInTheDocument()
    expect(screen.getByText("No documents found")).toBeInTheDocument()
  })

  it("renders recent shipments and documents when data exists", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({ data: { role: "Admin" } } as any)
    vi.mocked(getRecentShipments).mockResolvedValue({
      data: [
        { id: "ship1", shipment_number: "SHP-100", status: "In Transit", updated_at: "2026-08-14" }
      ]
    } as any)
    vi.mocked(getRecentDocuments).mockResolvedValue({
      data: [
        { id: "doc1", name: "Invoice.pdf", status: "Approved", upload_date: "2026-08-14" }
      ]
    } as any)
    vi.mocked(getRecentActivities).mockResolvedValue({
      data: [
        { id: "act1", type: "shipment", title: "Shipment Arrived", description: "At Port", timestamp: "2026-08-14" }
      ]
    } as any)
    
    const ui = await DashboardPage()
    render(ui)

    expect(screen.getByText("SHP-100")).toBeInTheDocument()
    expect(screen.getByText("Invoice.pdf")).toBeInTheDocument()
    expect(screen.getByText("Shipment Arrived")).toBeInTheDocument()
    
    // Empty states should be gone
    expect(screen.queryByText("No shipments found")).not.toBeInTheDocument()
  })
})
