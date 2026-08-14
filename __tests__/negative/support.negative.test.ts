import { describe, it, expect, vi, beforeEach } from "vitest"
import { createSupportRequest } from "../../src/actions/support.actions"
import { createClient } from "../../src/lib/supabase/server"

// Mock the dependencies
vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("Support Actions Negative Tests", () => {
  let mockSupabase: any

  beforeEach(() => {
    const chainMock: any = {
      select: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
      insert: vi.fn(),
    }
    
    const thenableChain = {
      ...chainMock,
      then: vi.fn((resolve) => resolve({ data: null, error: null }))
    }
    
    for (const key of Object.keys(chainMock)) {
      chainMock[key].mockReturnValue(thenableChain)
    }
    
    // Explicitly resolve single for the profile check
    chainMock.single.mockResolvedValue({ data: { role: 'Client' }, error: null })
    // Explicitly resolve insert for the success path
    chainMock.insert.mockResolvedValue({ error: null })

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } }, error: null }),
      },
      from: vi.fn().mockReturnValue(thenableChain),
      ...chainMock
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
    
    // Suppress console.error in tests
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("should fail when subject is missing or empty", async () => {
    const invalidData = {
      subject: "", // Invalid
      category: "Bug",
      priority: "High" as const,
      description: "This is a valid description."
    }

    const result = await createSupportRequest(invalidData)
    expect(result.success).toBe(false)
    
    // Zod parsing error stringified in the error response
    expect(result.error).toContain("Subject is required")
  })

  it("should fail when description is too short", async () => {
    const invalidData = {
      subject: "Broken Button",
      category: "Bug",
      priority: "Medium" as const,
      description: "Short" // Invalid (< 10 chars)
    }

    const result = await createSupportRequest(invalidData)
    expect(result.success).toBe(false)
    expect(result.error).toContain("Description must be at least 10 characters")
  })

  it("should fail when user is unauthorized", async () => {
    // Mock unauthorized user
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: "Auth error" } })

    const validData = {
      subject: "Valid Subject",
      category: "Bug",
      priority: "Low" as const,
      description: "This is a valid description."
    }

    const result = await createSupportRequest(validData)
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })

  it("should fail gracefully when database insert fails", async () => {
    // Mock DB failure
    mockSupabase.insert.mockResolvedValueOnce({ data: null, error: new Error("DB Connection Lost") })

    const validData = {
      subject: "Valid Subject",
      category: "Bug",
      priority: "Low" as const,
      description: "This is a valid description."
    }

    const result = await createSupportRequest(validData)
    expect(result.success).toBe(false)
    expect(result.error).toBe("Failed to submit support request")
  })
})
