import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import DocumentsPage from "../../../src/app/(app)/documents/page"
import { getDocuments, archiveDocument } from "../../../src/actions/document.actions"
import { getUserProfile } from "../../../src/actions/auth.actions"

vi.mock("../../../src/actions/document.actions", () => ({
  getDocuments: vi.fn(),
  archiveDocument: vi.fn(),
  restoreDocument: vi.fn(),
  permanentlyDeleteDocument: vi.fn()
}))

vi.mock("../../../src/actions/auth.actions", () => ({
  getUserProfile: vi.fn(),
}))

describe("Documents Page", () => {
  const mockDocs = [
    {
      id: "doc-1",
      name: "Invoice_001.pdf",
      category: "Financial Documents",
      client_id: "c1",
      client: { company_name: "Acme Corp" },
      shipment_id: "shp-1",
      type: "PDF",
      status: "Approved",
      upload_date: "2026-08-14T00:00:00Z",
      file_size: 1024 * 1024 * 2.5, // 2.5 MB
      uploaded_by: { full_name: "John Doe" },
    },
    {
      id: "doc-2",
      name: "PackingList.xlsx",
      category: "Shipment Documents",
      client_id: "c2",
      client: { company_name: "Global Tech" },
      shipment_id: "shp-2",
      type: "XLSX",
      status: "Pending Review",
      upload_date: "2026-08-15T00:00:00Z",
      file_size: 1024 * 500, // 500 KB
      uploaded_by: { full_name: "Jane Smith" },
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserProfile).mockResolvedValue({ data: { role: "Admin" } } as any)
    vi.mocked(getDocuments).mockResolvedValue({ success: true, data: mockDocs as any })
  })

  it("renders documents in grid view initially", async () => {
    const ui = await DocumentsPage()
    render(ui)

    expect(screen.getByText("Invoice_001.pdf")).toBeInTheDocument()
    expect(screen.getByText("PackingList.xlsx")).toBeInTheDocument()
    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
    expect(screen.getByText("Global Tech")).toBeInTheDocument()
    
    // File sizes are mapped in mapDocumentToUI (e.g. "2.5 MB" and "500.0 KB")
    expect(screen.getByText("2.5 MB")).toBeInTheDocument()
  })

  it("filters documents by search query", async () => {
    const user = userEvent.setup()
    const ui = await DocumentsPage()
    render(ui)

    const searchInput = screen.getByPlaceholderText(/Search by doc name/i)
    await user.type(searchInput, "Invoice")

    expect(screen.getByText("Invoice_001.pdf")).toBeInTheDocument()
    expect(screen.queryByText("PackingList.xlsx")).not.toBeInTheDocument()
  })

  it("handles soft delete (Move to Recycle Bin)", async () => {
    const user = userEvent.setup()
    vi.mocked(archiveDocument).mockResolvedValue({ success: true })

    const ui = await DocumentsPage()
    render(ui)

    // Find delete buttons. They have "Delete" text.
    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i })
    
    // Click the first delete button (for Invoice_001.pdf)
    await user.click(deleteButtons[0])

    // Wait for modal
    const moveBtn = await screen.findByRole("button", { name: "Move" })
    await user.click(moveBtn)

    expect(archiveDocument).toHaveBeenCalledWith("doc-1")
    
    // Check if it is removed from view (statusFilter defaults to non-archived)
    expect(screen.queryByText("Invoice_001.pdf")).not.toBeInTheDocument()
  })
})
