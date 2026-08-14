import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ShipmentForm } from "../../../src/components/erp/shipment-form"
import { createShipmentAction, updateShipmentAction } from "../../../src/app/(app)/shipments/actions"
import { getClients } from "../../../src/app/(app)/clients/actions"
import { useRouter } from "next/navigation"

vi.mock("../../../src/app/(app)/shipments/actions", () => ({
  createShipmentAction: vi.fn(),
  updateShipmentAction: vi.fn(),
}))

vi.mock("../../../src/app/(app)/clients/actions", () => ({
  getClients: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

describe("ShipmentForm Component", () => {
  const mockPush = vi.fn()
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush, refresh: mockRefresh } as any)
    vi.mocked(getClients).mockResolvedValue({ data: [{ id: "c1", companyName: "Test Client" }] } as any)
  })

  it("renders Step 1 initially and loads clients", async () => {
    render(<ShipmentForm />)
    
    // Check title by getting all occurrences of "Client Information" (the stepper and the header)
    expect(screen.getAllByText("Client Information")[0]).toBeInTheDocument()
    
    // Check that getClients was called
    await waitFor(() => {
      expect(getClients).toHaveBeenCalled()
    })
  })

  it("prevents proceeding to Step 2 if Client is not selected", async () => {
    const user = userEvent.setup()
    render(<ShipmentForm />)
    
    const nextBtn = screen.getByRole("button", { name: /Next Step/i })
    await user.click(nextBtn)
    
    // Should still be on Step 1
    expect(screen.getAllByText("Client Information")[0]).toBeInTheDocument()
  })

  it("navigates through steps when valid data is provided", async () => {
    const user = userEvent.setup()
    render(<ShipmentForm />)
    
    await waitFor(() => expect(getClients).toHaveBeenCalled())

    // Step 1 -> Select Client (it's the only combobox on step 1)
    const clientSelect = screen.getByRole("combobox")
    await user.click(clientSelect)
    const option = await screen.findByRole("option", { name: "Test Client" })
    await user.click(option)

    // Next to Step 2
    const nextBtn = screen.getByRole("button", { name: /Next Step/i })
    await user.click(nextBtn)

    // Now on Step 2
    expect(screen.getAllByText("Shipment Details")[0]).toBeInTheDocument()
    
    // Can go back to Step 1
    const prevBtn = screen.getByRole("button", { name: /Previous/i })
    await user.click(prevBtn)
    
    expect(screen.getAllByText("Client Information")[0]).toBeInTheDocument()
  })

  it("calls updateShipmentAction when submitting an edit", async () => {
    const user = userEvent.setup()
    vi.mocked(updateShipmentAction).mockResolvedValue({ success: true } as any)

    const initialData = { id: "ship-123", clientId: "c1", clientName: "Test Client", status: "Pending" } as any

    render(<ShipmentForm initialData={initialData} />)
    
    // Since it's edit mode, sidebar buttons are enabled. Go to step 6 (Review & Submit)
    const step6Btn = screen.getByText("Review & Submit")
    await user.click(step6Btn)

    // Submit
    const submitBtn = screen.getByRole("button", { name: /Save Changes/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(updateShipmentAction).toHaveBeenCalledWith("ship-123", expect.objectContaining({
        clientId: "c1"
      }))
    })
    
    expect(mockPush).toHaveBeenCalledWith("/shipments/ship-123")
    expect(mockRefresh).toHaveBeenCalled()
  })
})
