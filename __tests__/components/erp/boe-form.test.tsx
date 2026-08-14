import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { BOEForm } from "../../../src/components/erp/boe-form"
import { createBOE, updateBOE, createBOEProduct } from "../../../src/app/(app)/boe/actions"
import { useRouter } from "next/navigation"

vi.mock("../../../src/app/(app)/boe/actions", () => ({
  createBOE: vi.fn(),
  updateBOE: vi.fn(),
  createBOEProduct: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

describe("BOEForm Component", () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
  })

  it("renders Step 1 and validates required fields", async () => {
    const user = userEvent.setup()
    render(<BOEForm />)

    expect(screen.getAllByText("BOE & Shipment")[0]).toBeInTheDocument()

    // Try going next without selecting a shipment
    const nextBtn = screen.getByRole("button", { name: /Next/i })
    await user.click(nextBtn)

    expect(screen.getByText("Please select an existing Shipment reference.")).toBeInTheDocument()
  })

  it("navigates through steps and calculates Grand Total", async () => {
    const user = userEvent.setup()
    const availableShipments = [{ id: "ship-1", shipmentNumber: "SHP-1", clientName: "Client 1" }]
    
    render(<BOEForm availableShipments={availableShipments} />)

    // Select Shipment - It's the first combobox on the page
    const select = screen.getByRole("combobox")
    await user.click(select)
    await user.click(await screen.findByRole("option", { name: /SHP-1/i }))

    // Go Next -> Step 2
    const nextBtn = screen.getByRole("button", { name: /Next/i })
    await user.click(nextBtn)
    expect(screen.getAllByText("Customs Details")[0]).toBeInTheDocument()

    // Go Next -> Step 3
    await user.click(nextBtn)
    expect(screen.getAllByText("Duty Calculation")[0]).toBeInTheDocument()

    // Fill Duties
    await user.clear(screen.getByLabelText(/Import Duty/i))
    await user.type(screen.getByLabelText(/Import Duty/i), "100")

    await user.clear(screen.getByLabelText(/Value Added Tax/i))
    await user.type(screen.getByLabelText(/Value Added Tax/i), "15")

    // Check Auto-Calculated Total (100 + 15 = 115)
    expect(screen.getByLabelText(/Grand Total/i)).toHaveValue(115)
    
    // Go Next -> Step 4
    await user.click(nextBtn)
    expect(screen.getAllByText("Review & Submit")[0]).toBeInTheDocument()
  })

  it("calls updateBOE when in edit mode", async () => {
    const user = userEvent.setup()
    vi.mocked(updateBOE).mockResolvedValue({ success: true } as any)

    const initialData = { 
      id: "boe-123", 
      boeNumber: "BOE-TEST", 
      status: "Draft",
      shipment: { shipmentId: "ship-1" },
      duties: { importDuty: 100 }
    } as any

    render(<BOEForm initialData={initialData} />)
    
    // Go to Step 4 (we just click next 3 times)
    const nextBtn = screen.getByRole("button", { name: /Next/i })
    await user.click(nextBtn)
    await user.click(nextBtn)
    await user.click(nextBtn)

    // Submit Update
    const submitBtn = screen.getByRole("button", { name: /Update BOE/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(updateBOE).toHaveBeenCalledWith("boe-123", expect.objectContaining({
        boeNumber: "BOE-TEST",
      }))
    })

    expect(mockPush).toHaveBeenCalledWith("/boe/boe-123")
  })
})
