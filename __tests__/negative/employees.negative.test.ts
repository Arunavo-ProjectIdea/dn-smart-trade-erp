import { describe, it, expect, vi, beforeEach } from "vitest"
import { createEmployee, updateEmployeeStatus, updateEmployee } from "../../src/actions/employees.actions"
import { createClient } from "../../src/lib/supabase/server"
import { createAdminClient } from "../../src/lib/supabase/admin"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))
vi.mock("../../src/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}))
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("Employee Actions Negative Tests", () => {
  let mockSupabase: any
  let mockAdminClient: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "admin-123" } }, error: null }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: "Admin" }, error: null }),
      update: vi.fn().mockReturnThis(),
    }

    mockAdminClient = {
      auth: {
        admin: {
          createUser: vi.fn().mockResolvedValue({ data: { user: { id: "new-user-123" } }, error: null })
        }
      }
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
    vi.mocked(createAdminClient).mockReturnValue(mockAdminClient as never)
  })

  it("createEmployee should fail if user is not an Admin", async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { role: "Employee" }, error: null })
    const result = await createEmployee({ email: "test@test.com", fullName: "Test" })
    expect(result.success).toBe(false)
    expect(result.error).toContain("Forbidden: Only Admins can create employees")
  })

  it("updateEmployeeStatus should fail if user is not an Admin", async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: { role: "Manager" }, error: null })
    const result = await updateEmployeeStatus("emp-123", "Inactive")
    expect(result.success).toBe(false)
    expect(result.error).toContain("Forbidden: Only Admins can update employee status")
  })

  it("updateEmployee should fail if user tries to update someone else and is not Admin", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "emp-1" } }, error: null })
    mockSupabase.single.mockResolvedValueOnce({ data: { role: "Employee" }, error: null })
    
    // Trying to update emp-2 as emp-1 (not Admin)
    const result = await updateEmployee("emp-2", { fullName: "New Name" })
    expect(result.success).toBe(false)
    expect(result.error).toContain("Forbidden: You can only update your own profile")
  })

  it("createEmployee should fail gracefully when auth service throws error", async () => {
    mockAdminClient.auth.admin.createUser.mockResolvedValueOnce({ data: null, error: new Error("Auth Failure") })
    const result = await createEmployee({ email: "test@test.com", fullName: "Test" })
    expect(result.success).toBe(false)
    expect(result.error).toBe("Auth Failure")
  })
})
