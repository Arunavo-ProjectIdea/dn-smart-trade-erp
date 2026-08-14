import { describe, it, expect, vi, beforeEach } from "vitest"
import { signIn, resetPassword, updateUserPassword, uploadAvatar } from "../../src/actions/auth.actions"
import { createClient } from "../../src/lib/supabase/server"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("Auth Actions Negative Tests", () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signInWithPassword: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
      },
      rpc: vi.fn(),
      storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn(),
      }
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
  })

  it("signIn should fail if email/username is missing", async () => {
    const formData = new FormData()
    formData.append("password", "password123")
    
    const result = await signIn(formData)
    expect(result.success).toBe(false)
    expect(result.error).toContain("Email or Username and password are required")
  })

  it("signIn should fail if password is missing", async () => {
    const formData = new FormData()
    formData.append("email", "test@example.com")
    
    const result = await signIn(formData)
    expect(result.success).toBe(false)
    expect(result.error).toContain("Email or Username and password are required")
  })

  it("resetPassword should fail if email is missing", async () => {
    const formData = new FormData()
    
    const result = await resetPassword(formData)
    expect(result.success).toBe(false)
    expect(result.error).toContain("Email is required")
  })

  it("updateUserPassword should fail if password is missing", async () => {
    const result = await updateUserPassword("")
    expect(result.success).toBe(false)
    expect(result.error).toContain("Password is required")
  })

  it("uploadAvatar should fail if file size exceeds 2MB", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "user-123" } }, error: null })
    
    const formData = new FormData()
    // Create a mock file larger than 2MB
    const largeBuffer = new ArrayBuffer(3 * 1024 * 1024)
    const largeFile = new File([largeBuffer], "avatar.png", { type: "image/png" })
    formData.append("avatar", largeFile)

    const result = await uploadAvatar(formData)
    expect(result.success).toBe(false)
    expect(result.error).toContain("File exceeds 2MB limit")
  })

  it("uploadAvatar should fail if no file is provided", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "user-123" } }, error: null })
    
    const formData = new FormData()
    const result = await uploadAvatar(formData)
    expect(result.success).toBe(false)
    expect(result.error).toContain("No file provided")
  })

  it("uploadAvatar should fail if not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: "Auth Error" } })
    
    const formData = new FormData()
    const result = await uploadAvatar(formData)
    expect(result.success).toBe(false)
    expect(result.error).toContain("Not authenticated")
  })
})
