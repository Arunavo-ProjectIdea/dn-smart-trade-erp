import { describe, it, expect, vi, beforeEach } from "vitest"
import { createClientAction, updateClientAction, deactivateClientAction } from "../../src/app/(app)/clients/actions"
import { createClient } from "../../src/lib/supabase/server"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("Client Actions Negative Tests", () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: {} }),
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } })
      },
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: "client-123" }, error: null }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
    
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("createClientAction should return sanitized error message on DB failure", async () => {
    // Mock insert failure (e.g. duplicate email)
    mockSupabase.single.mockResolvedValueOnce({ data: { role: "Admin" } }) // profiles fetch
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: new Error("Raw RLS or duplicate key error") }) // insert fetch
    
    const clientData = { companyName: "Test Co", email: "test@test.com" }
    
    const result = await createClientAction(clientData)
    expect(result.data).toBeNull()
    // Defect 4 states we should return sanitized string
    expect(result.error).toBe("Failed to create client. Please try again.")
  })

  it("updateClientAction should return error on DB failure", async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: new Error("Update failed") })
    
    const result = await updateClientAction("client-123", { companyName: "New Co" })
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })

  it("deactivateClientAction should return error on DB failure", async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: new Error("Deactivate failed") })
    
    const result = await deactivateClientAction("client-123")
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })
})
