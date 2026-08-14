import { describe, it, expect, vi, beforeEach } from "vitest"
import { createDocument, archiveDocument, permanentlyDeleteDocument, updateDocumentStatus } from "../../src/actions/document.actions"
import { createClient } from "../../src/lib/supabase/server"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("Document Actions Negative Tests", () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } }, error: null }),
      },
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: "doc-123" }, error: null }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
    
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("createDocument should fail if user is unauthorized", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: "Unauthorized" } })
    
    const formData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Doc",
      category: "Invoice" as any,
      type: "PDF",
      current_file_url: "url",
      file_type: "application/pdf",
      file_size: 1024
    }

    const result = await createDocument(formData)
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })

  it("createDocument should fail gracefully on DB insert error", async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: new Error("DB Error") })
    
    const formData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Doc",
      category: "Invoice" as any,
      type: "PDF",
      current_file_url: "url",
      file_type: "application/pdf",
      file_size: 1024
    }

    const result = await createDocument(formData)
    expect(result.success).toBe(false)
    expect(result.error).toBe("DB Error")
  })

  it("archiveDocument should fail if user is unauthorized", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: "Unauthorized" } })
    
    const result = await archiveDocument("doc-123")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })

  it("permanentlyDeleteDocument should fail gracefully on DB error", async () => {
    mockSupabase.eq.mockResolvedValueOnce({ data: null, error: new Error("Foreign Key Violation") })
    
    const result = await permanentlyDeleteDocument("doc-123")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Foreign Key Violation")
  })

  it("updateDocumentStatus should fail if user is unauthorized", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: "Unauthorized" } })
    
    const result = await updateDocumentStatus("doc-123", "Approved")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })
})
