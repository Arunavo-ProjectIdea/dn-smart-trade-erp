import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getDocuments,
  getDocumentById,
  createDocument,
  archiveDocument,
  restoreDocument,
  permanentlyDeleteDocument,
  updateDocumentStatus,
  updateDocument,
  downloadDocument,
  replaceDocumentFile,
  getUploadOptions
} from "../../src/actions/document.actions"
import { createClient } from "../../src/lib/supabase/server"
import { revalidatePath } from "next/cache"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("document.actions", () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    const chainMock: any = {
      select: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    
    // Create a wrapper that is thenable but doesn't expose 'then' on mockSupabase itself
    const thenableChain = {
      ...chainMock,
      then: vi.fn((resolve) => resolve({ data: null, error: null }))
    }
    
    for (const key of Object.keys(chainMock)) {
      chainMock[key].mockReturnValue(thenableChain)
    }
    
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } }, error: null })
      },
      from: vi.fn().mockReturnValue(thenableChain),
      storage: {
        from: vi.fn().mockReturnThis(),
        createSignedUrl: vi.fn(),
      },
      ...chainMock
    }
    
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe("getDocuments", () => {
    it("returns documents successfully", async () => {
      mockSupabase.order.mockResolvedValue({ data: [{ id: "doc-1", name: "Doc 1" }], error: null })
      const result = await getDocuments()
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(mockSupabase.from).toHaveBeenCalledWith("documents")
    })
  })

  describe("getDocumentById", () => {
    it("returns document successfully", async () => {
      mockSupabase.single.mockResolvedValue({ data: { id: "doc-1", name: "Doc 1" }, error: null })
      const result = await getDocumentById("doc-1")
      
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe("Doc 1")
    })
  })

  describe("createDocument", () => {
    it("creates document successfully", async () => {
      const mockDoc = { id: "doc-1", name: "New Doc" }
      // Mock document insert
      mockSupabase.single.mockResolvedValue({ data: mockDoc, error: null })

      const formData = {
        id: "doc-1",
        name: "New Doc",
        category: "Client Documents" as any,
        type: "PDF",
        current_file_url: "url",
        file_type: "application/pdf",
        file_size: 1000
      }

      const result = await createDocument(formData)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockDoc)
      expect(revalidatePath).toHaveBeenCalledWith("/documents")
    })
  })

  describe("archiveDocument", () => {
    it("archives document successfully", async () => {
      mockSupabase.eq.mockResolvedValue({ error: null })
      
      const result = await archiveDocument("doc-1")
      
      expect(result.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
        status: "Archived"
      }))
    })
  })

  describe("restoreDocument", () => {
    it("restores document successfully", async () => {
      mockSupabase.eq.mockResolvedValue({ error: null })
      
      const result = await restoreDocument("doc-1")
      
      expect(result.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
        status: "Pending Review"
      }))
    })
  })

  describe("permanentlyDeleteDocument", () => {
    it("deletes document successfully", async () => {
      mockSupabase.eq.mockResolvedValue({ error: null })
      
      const result = await permanentlyDeleteDocument("doc-1")
      
      expect(result.success).toBe(true)
      expect(mockSupabase.delete).toHaveBeenCalled()
    })
  })

  describe("updateDocumentStatus", () => {
    it("updates status successfully", async () => {
      mockSupabase.eq.mockResolvedValue({ error: null })
      
      const result = await updateDocumentStatus("doc-1", "Approved")
      
      expect(result.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
        status: "Approved"
      }))
      expect(revalidatePath).toHaveBeenCalledWith("/documents/doc-1")
    })
  })

  describe("getUploadOptions", () => {
    it("returns options successfully", async () => {
      // Mock Promise.all responses
      mockSupabase.order.mockResolvedValueOnce({ data: [{ id: "c1", company_name: "Client 1" }] }) // clients
      mockSupabase.limit.mockResolvedValueOnce({ data: [{ id: "s1", container_number: "CONT1" }] }) // shipments
      mockSupabase.limit.mockResolvedValueOnce({ data: [{ id: "b1", boe_number: "BOE1" }] }) // boes

      const result = await getUploadOptions()
      
      expect(result.clients).toHaveLength(1)
      expect(result.shipments).toHaveLength(1)
      expect(result.billsOfEntry).toHaveLength(1)
    })
  })

  describe("updateDocument", () => {
    it("updates document successfully", async () => {
      mockSupabase.eq.mockResolvedValue({ error: null })
      
      const result = await updateDocument("doc-1", { name: "Updated Doc" })
      
      expect(result.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
        name: "Updated Doc"
      }))
    })
  })

  describe("downloadDocument", () => {
    it("returns signed url", async () => {
      mockSupabase.single.mockResolvedValue({ data: { current_file_url: "path/to/file.pdf" }, error: null })
      mockSupabase.storage.createSignedUrl.mockResolvedValue({ data: { signedUrl: "https://signed.url" }, error: null })

      const result = await downloadDocument("doc-1")
      
      expect(result.success).toBe(true)
      expect(result.data?.url).toBe("https://signed.url")
    })

    it("returns error if no file url", async () => {
      mockSupabase.single.mockResolvedValue({ data: { current_file_url: null }, error: null })

      const result = await downloadDocument("doc-1")
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("No file associated with this document")
    })
  })

  describe("replaceDocumentFile", () => {
    it("replaces file successfully", async () => {
      mockSupabase.single.mockResolvedValue({ 
        data: { current_file_url: "old.pdf", file_size: 100, file_type: "pdf" }, 
        error: null 
      })

      const result = await replaceDocumentFile("doc-1", {
        current_file_url: "new.pdf",
        file_size: 200,
        file_type: "pdf"
      })
      
      expect(result.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
        current_file_url: "new.pdf",
        file_size: 200
      }))
    })
  })
})
