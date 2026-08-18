import { describe, it, expect, vi, beforeEach } from "vitest"
import { getDashboardStats, getRecentActivities, getRecentDocuments, getRecentShipments } from "../../src/actions/dashboard.actions"
import { getUserProfile } from "../../src/actions/auth.actions"
import { createClient } from "../../src/lib/supabase/server"

vi.mock("../../src/actions/auth.actions", () => ({
  getUserProfile: vi.fn(),
}))

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

describe("Dashboard Actions Negative Tests", () => {
  beforeEach(() => {
    vi.mocked(getUserProfile).mockResolvedValue({ success: false, error: "Unauthorized" } as any)
    
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("getDashboardStats should fail if user is unauthorized", async () => {
    const result = await getDashboardStats()
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })

  it("getRecentActivities should fail if user is unauthorized", async () => {
    const result = await getRecentActivities()
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })

  it("getRecentDocuments should fail if user is unauthorized", async () => {
    const result = await getRecentDocuments()
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })

  it("getRecentShipments should fail if user is unauthorized", async () => {
    const result = await getRecentShipments()
    expect(result.success).toBe(false)
    expect(result.error).toBe("Unauthorized")
  })

  it("getDashboardStats should fail for client if client_id is missing", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Client", client_id: null } } as any)
    
    const result = await getDashboardStats()
    expect(result.success).toBe(false)
    expect(result.error).toBe("No client profile found")
  })

  it("getDashboardStats should fail gracefully if DB errors", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)

    const mockSupabase = {
      from: vi.fn().mockImplementation(() => { throw new Error("DB Error") })
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)

    const result = await getDashboardStats()
    expect(result.success).toBe(false)
    expect(result.error).toBe("Failed to fetch dashboard stats")
  })
})
