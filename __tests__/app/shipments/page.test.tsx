import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ShipmentsPage from "../../../src/app/(app)/shipments/page"
import { getShipments, deleteShipmentAction } from "../../../src/app/(app)/shipments/actions"
import { getUserProfile } from "../../../src/actions/auth.actions"

vi.mock("../../../src/app/(app)/shipments/actions", () => ({
  getShipments: vi.fn(),
  deleteShipmentAction: vi.fn(),
}))

vi.mock("../../../src/actions/auth.actions", () => ({
  getUserProfile: vi.fn(),
}))

describe("Shipments Page", () => {
  const mockShipments = [
    {
      id: "ship1",
      shipmentNumber: "SHP-12345",
      clientName: "Global Tech",
      loadingPort: "Shanghai",
      dischargePort: "New York",
      eta: "2026-09-01T00:00:00Z",
      status: "In Transit",
      transportType: "Sea",
    },
    {
      id: "ship2",
      shipmentNumber: "SHP-98765",
      clientName: "Acme Corp",
      loadingPort: "Shenzhen",
      dischargePort: "Los Angeles",
      eta: "2026-08-20T00:00:00Z",
      status: "Pending",
      transportType: "Air",
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserProfile).mockResolvedValue({ data: { role: "Admin" } } as any)
    vi.mocked(getShipments).mockResolvedValue({ data: mockShipments, error: null } as any)
  })

  it("renders loading state initially", async () => {
    // We delay the resolve to see the loading state
    let resolvePromise: any
    vi.mocked(getShipments).mockReturnValue(new Promise(resolve => {
      resolvePromise = resolve
    }))
    
    render(<ShipmentsPage />)
    expect(screen.getByText("Loading shipments from Supabase...")).toBeInTheDocument()
    
    // Cleanup
    resolvePromise({ data: [], error: null })
  })

  it("renders shipments data in the table after loading", async () => {
    render(<ShipmentsPage />)

    await waitFor(() => {
      expect(screen.queryByText("Loading shipments from Supabase...")).not.toBeInTheDocument()
    })

    // Check if shipments are rendered
    expect(screen.getByText("SHP-12345")).toBeInTheDocument()
    expect(screen.getByText("SHP-98765")).toBeInTheDocument()
    
    // Check ports
    expect(screen.getByText("Shanghai")).toBeInTheDocument()
    expect(screen.getByText("Shenzhen")).toBeInTheDocument()
    
    // Check clients
    expect(screen.getByText("Global Tech")).toBeInTheDocument()
    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
  })

  it("filters shipments based on search input", async () => {
    const user = userEvent.setup()
    render(<ShipmentsPage />)

    await waitFor(() => {
      expect(screen.queryByText("Loading shipments from Supabase...")).not.toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search by ID, Client, Port/i)
    await user.type(searchInput, "Global Tech")

    // SHP-12345 should remain
    expect(screen.getByText("SHP-12345")).toBeInTheDocument()
    
    // SHP-98765 should be hidden
    expect(screen.queryByText("SHP-98765")).not.toBeInTheDocument()
  })

  it("handles deletion for admins", async () => {
    const user = userEvent.setup()
    
    // Mock window.confirm
    vi.spyOn(window, "confirm").mockReturnValue(true)
    vi.mocked(deleteShipmentAction).mockResolvedValue({ success: true })

    render(<ShipmentsPage />)

    await waitFor(() => {
      expect(screen.queryByText("Loading shipments from Supabase...")).not.toBeInTheDocument()
    })

    // Find delete buttons. They have "Delete" text inside a button role.
    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i })
    expect(deleteButtons.length).toBeGreaterThan(0)
    
    // Click the first delete button (for SHP-12345)
    await user.click(deleteButtons[0])

    expect(window.confirm).toHaveBeenCalled()
    expect(deleteShipmentAction).toHaveBeenCalledWith("ship1")
  })
})
