import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ClientsPage from "../../../src/app/(app)/clients/page"
import { getClients, deactivateClientAction, activateClientAction } from "../../../src/app/(app)/clients/actions"

vi.mock("../../../src/app/(app)/clients/actions", () => ({
  getClients: vi.fn(),
  deactivateClientAction: vi.fn(),
  activateClientAction: vi.fn(),
}))

// Mock router for transitions
vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>()
  return {
    ...actual,
    useRouter: () => ({
      refresh: vi.fn(),
      push: vi.fn(),
    })
  }
})

describe("Clients Page", () => {
  const mockClients = [
    {
      id: "client-1",
      companyName: "Acme Corp",
      contactPerson: "John Doe",
      email: "john@acme.com",
      phone: "123-456",
      address: "123 Main St",
      clientType: "Importer",
      status: "Active",
    },
    {
      id: "client-2",
      companyName: "Global Trade Ltd",
      contactPerson: "Jane Smith",
      email: "jane@global.com",
      phone: "987-654",
      address: "456 Market St",
      clientType: "Exporter",
      status: "Inactive",
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getClients).mockResolvedValue({ data: mockClients, error: null } as any)
  })

  it("renders clients list successfully", async () => {
    const ui = await ClientsPage()
    render(ui)

    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
    expect(screen.getByText("Global Trade Ltd")).toBeInTheDocument()
    expect(screen.getByText("john@acme.com")).toBeInTheDocument()
  })

  it("handles empty state", async () => {
    vi.mocked(getClients).mockResolvedValue({ data: [], error: null } as any)
    const ui = await ClientsPage()
    render(ui)

    expect(screen.getByText("No clients found")).toBeInTheDocument()
  })

  it("handles error state", async () => {
    vi.mocked(getClients).mockResolvedValue({ data: null, error: "Database error" } as any)
    const ui = await ClientsPage()
    render(ui)

    expect(screen.getByText("Error loading clients. Please try again later.")).toBeInTheDocument()
  })

  it("filters clients by search text", async () => {
    const user = userEvent.setup()
    const ui = await ClientsPage()
    render(ui)

    const searchInput = screen.getByPlaceholderText(/Search clients/i)
    await user.type(searchInput, "Acme")

    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
    expect(screen.queryByText("Global Trade Ltd")).not.toBeInTheDocument()
  })

  it("triggers deactivate confirmation dialog", async () => {
    const user = userEvent.setup()
    const ui = await ClientsPage()
    render(ui)

    // The deactivate button for "client-1" (Active)
    const deactivateBtn = screen.getByRole("button", { name: /Deactivate/i })
    await user.click(deactivateBtn)

    expect(screen.getByText("Are you sure you want to deactivate this client? They will be marked as Inactive but their records will be preserved.")).toBeInTheDocument()

    // Confirm deactivation
    vi.mocked(deactivateClientAction).mockResolvedValue({ success: true } as any)
    const confirmBtn = screen.getByRole("button", { name: "Deactivate" })
    await user.click(confirmBtn)

    expect(deactivateClientAction).toHaveBeenCalledWith("client-1")
  })
})
