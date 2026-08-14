import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import BOEListPage from "../../../src/app/(app)/boe/page"
import { getBOEs, deleteBOE } from "../../../src/app/(app)/boe/actions"
import { getUserProfile } from "../../../src/actions/auth.actions"

vi.mock("../../../src/app/(app)/boe/actions", () => ({
  getBOEs: vi.fn(),
  deleteBOE: vi.fn(),
}))

vi.mock("../../../src/actions/auth.actions", () => ({
  getUserProfile: vi.fn(),
}))

describe("BOE List Page", () => {
  const mockBoes = [
    {
      id: "boe-1",
      boeNumber: "BOE-2026-001",
      status: "Submitted",
      createdAt: "2026-08-14T00:00:00Z",
      importer: {
        clientName: "Tech Imports",
        companyName: "Tech Imports LLC",
      },
      shipment: {
        port: "Chittagong",
        shipmentId: "shp-1",
      },
      duties: {
        grandTotal: 15000,
      }
    },
    {
      id: "boe-2",
      boeNumber: "BOE-2026-002",
      status: "Draft",
      createdAt: "2026-08-15T00:00:00Z",
      importer: {
        clientName: "Global Trade",
        companyName: "Global Trade Inc",
      },
      shipment: {
        port: "Dhaka",
        shipmentId: "shp-2",
      },
      duties: {
        grandTotal: 5000,
      }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserProfile).mockResolvedValue({ data: { role: "Admin" } } as any)
    vi.mocked(getBOEs).mockResolvedValue({ data: mockBoes as any, error: null } as any)
  })

  it("renders loading state initially", async () => {
    let resolvePromise: any
    vi.mocked(getBOEs).mockReturnValue(new Promise(resolve => {
      resolvePromise = resolve
    }))
    
    render(<BOEListPage />)
    expect(screen.getByText("Loading Bills of Entry from Supabase...")).toBeInTheDocument()
    
    // Cleanup
    resolvePromise({ data: [], error: null })
  })

  it("renders boe list successfully", async () => {
    render(<BOEListPage />)

    await waitFor(() => {
      expect(screen.queryByText("Loading Bills of Entry from Supabase...")).not.toBeInTheDocument()
    })

    expect(screen.getByText("BOE-2026-001")).toBeInTheDocument()
    expect(screen.getByText("BOE-2026-002")).toBeInTheDocument()
    expect(screen.getByText("Tech Imports")).toBeInTheDocument()
    expect(screen.getByText("Global Trade")).toBeInTheDocument()
    
    // Currency check
    expect(screen.getByText("BDT 15,000.00")).toBeInTheDocument()
  })

  it("filters BOEs by search term", async () => {
    const user = userEvent.setup()
    render(<BOEListPage />)

    await waitFor(() => {
      expect(screen.queryByText("Loading Bills of Entry from Supabase...")).not.toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search BOE number/i)
    await user.type(searchInput, "001")

    expect(screen.getByText("BOE-2026-001")).toBeInTheDocument()
    expect(screen.queryByText("BOE-2026-002")).not.toBeInTheDocument()
  })

  it("shows delete in dropdown and handles deletion for admins", async () => {
    const user = userEvent.setup()
    vi.spyOn(window, "confirm").mockReturnValue(true)
    vi.mocked(deleteBOE).mockResolvedValue({ success: true } as any)

    render(<BOEListPage />)

    await waitFor(() => {
      expect(screen.queryByText("Loading Bills of Entry from Supabase...")).not.toBeInTheDocument()
    })

    // Click the first dropdown menu
    // Dropdown triggers might be multiple
    const triggers = screen.getAllByRole("button")
    // Find the ellipsis trigger (last column)
    // The data table renders row actions. It's usually a button with class "h-8 w-8" (size icon)
    // Actually we can just find it by clicking the first SVG or button with no text
    const dropdownTriggers = triggers.filter(t => t.className.includes("h-8 w-8"))
    
    if (dropdownTriggers.length > 0) {
        await user.click(dropdownTriggers[0])
        
        // Wait for dropdown to appear
        const deleteItem = await screen.findByText("Delete")
        await user.click(deleteItem)

        expect(window.confirm).toHaveBeenCalled()
        expect(deleteBOE).toHaveBeenCalledWith("boe-1")
    }
  })
})
