import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { DocumentUploadForm } from "../../../src/components/erp/document-upload-form"
import { createClient } from "../../../src/lib/supabase/client"
import { createDocument } from "../../../src/actions/document.actions"
import { useRouter } from "next/navigation"

vi.mock("../../../src/lib/supabase/client", () => ({
  createClient: vi.fn(),
}))

vi.mock("../../../src/actions/document.actions", () => ({
  createDocument: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

describe("DocumentUploadForm Component", () => {
  const mockPush = vi.fn()
  const mockUpload = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
    vi.mocked(createClient).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }) },
      storage: { from: vi.fn().mockReturnValue({ upload: mockUpload }) },
    } as any)
  })

  it("renders with initial empty state", () => {
    render(<DocumentUploadForm />)
    expect(screen.getByText("Select or Drop Documents Here")).toBeInTheDocument()
    expect(screen.getByText("Document Metadata")).toBeInTheDocument()
  })

  it("allows selecting a client, shipment, or BOE for metadata", async () => {
    const user = userEvent.setup()
    const clients = [{ id: "c1", company_name: "Acme Corp" }]
    render(<DocumentUploadForm clients={clients} />)
    
    // Check Client Select - it's the second combobox (after Doc Type)
    const comboboxes = screen.getAllByRole("combobox")
    const clientSelect = comboboxes[1]
    await user.click(clientSelect)
    
    const acmeOption = screen.getByRole("option", { name: /Acme Corp/i })
    expect(acmeOption).toBeInTheDocument()
  })

  it("validates that at least one association is selected before uploading", async () => {
    const user = userEvent.setup()
    render(<DocumentUploadForm />)
    
    // Simulate File Upload
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    const file = new File(["dummy content"], "invoice.pdf", { type: "application/pdf" })
    await user.upload(fileInput, file)

    // Wait for file to queue
    expect(screen.getByText("invoice.pdf")).toBeInTheDocument()

    // Try to upload without setting metadata (Client, Shipment, BOE)
    const uploadBtn = screen.getByRole("button", { name: /Upload/i })
    await user.click(uploadBtn)

    // Should not call Supabase storage or createDocument action
    expect(mockUpload).not.toHaveBeenCalled()
    expect(createDocument).not.toHaveBeenCalled()
  })

  it("uploads files successfully when metadata is provided", async () => {
    const user = userEvent.setup()
    
    vi.mocked(createDocument).mockResolvedValue({ success: true, data: { id: "doc-123" } } as any)
    mockUpload.mockResolvedValue({ error: null })

    render(<DocumentUploadForm clients={[{ id: "c1", company_name: "Acme" }]} />)
    
    // Queue file
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    const file = new File(["content"], "invoice.pdf", { type: "application/pdf" })
    await user.upload(fileInput, file)

    // Select Client metadata (second combobox)
    const comboboxes = screen.getAllByRole("combobox")
    await user.click(comboboxes[1])
    const acmeOption = screen.getByRole("option", { name: /Acme/i })
    await user.click(acmeOption)

    // Upload
    const uploadBtn = screen.getByRole("button", { name: /Upload/i })
    await user.click(uploadBtn)

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled()
    })

    expect(createDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: "c1",
        file_type: "application/pdf",
        name: "invoice.pdf"
      })
    )
  })
})
