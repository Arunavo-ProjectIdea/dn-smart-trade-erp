import { describe, it, expect, vi, beforeEach } from "vitest"
import { signIn, signOut, resetPassword, updateUserPassword, getCurrentUser, getUserProfile, updateUserProfile, uploadAvatar } from "../../src/actions/auth.actions"
import { createClient } from "../../src/lib/supabase/server"
import { createAdminClient } from "../../src/lib/supabase/admin"
import { revalidatePath } from "next/cache"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("../../src/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("auth.actions", () => {
  let mockSupabase: any
  let mockAdminSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockSupabase = {
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      update: vi.fn().mockReturnThis(),
      storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      }
    }
    
    mockAdminSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
    vi.mocked(createAdminClient).mockReturnValue(mockAdminSupabase as any)
  })

  describe("signIn", () => {
    it("fails if email/username or password is not provided", async () => {
      const formData = new FormData()
      const result = await signIn(formData)
      expect(result.success).toBe(false)
      expect(result.error).toBe("Email or Username and password are required")
    })

    it("signs in directly with email", async () => {
      const formData = new FormData()
      formData.append("email", "test@example.com")
      formData.append("password", "password123")

      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 1 } }, error: null })

      const result = await signIn(formData)
      
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      })
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout")
      expect(result.success).toBe(true)
    })

    it("fetches email by username if username is provided", async () => {
      const formData = new FormData()
      formData.append("email", "testuser")
      formData.append("password", "password123")

      mockAdminSupabase.single.mockResolvedValue({ data: { email: "test@example.com" }, error: null })
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 1 } }, error: null })

      const result = await signIn(formData)

      expect(mockAdminSupabase.from).toHaveBeenCalledWith("profiles")
      expect(mockAdminSupabase.eq).toHaveBeenCalledWith("username", "testuser")
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      })
      expect(result.success).toBe(true)
    })

    it("returns error if username is not found", async () => {
      const formData = new FormData()
      formData.append("email", "testuser")
      formData.append("password", "password123")

      mockAdminSupabase.single.mockResolvedValue({ data: null, error: { message: "Not found" } })

      const result = await signIn(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Invalid login credentials")
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })
  })

  describe("signOut", () => {
    it("signs out successfully", async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })
      const result = await signOut()
      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout")
    })

    it("returns error on failure", async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: { message: "Failed" } })
      const result = await signOut()
      expect(result.success).toBe(false)
      expect(result.error).toBe("Failed")
    })
  })

  describe("getUserProfile", () => {
    it("returns user profile successfully", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null })
      mockSupabase.single.mockResolvedValue({ data: { full_name: "Test User" }, error: null })

      const result = await getUserProfile()
      
      expect(result.success).toBe(true)
      expect(result.data?.full_name).toBe("Test User")
      expect(result.data?.user.id).toBe("user-123")
    })

    it("returns error if auth.getUser fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: "Auth error" } })
      
      const result = await getUserProfile()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("Auth error")
    })
  })

  describe("updateUserProfile", () => {
    it("updates profile successfully", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null })
      mockSupabase.update.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) })

      const result = await updateUserProfile({ full_name: "New Name" })
      
      expect(result.success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith("profiles")
    })
  })

  describe("uploadAvatar", () => {
    it("fails if file is not provided", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null })
      const formData = new FormData()
      
      const result = await uploadAvatar(formData)
      expect(result.success).toBe(false)
      expect(result.error).toBe("No file provided")
    })
    
    it("fails if file is too large", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null })
      const formData = new FormData()
      formData.append("avatar", new File(["x".repeat(3 * 1024 * 1024)], "avatar.png", { type: "image/png" }))
      
      const result = await uploadAvatar(formData)
      expect(result.success).toBe(false)
      expect(result.error).toBe("File exceeds 2MB limit")
    })

    it("uploads successfully", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null })
      
      const file = new File(["dummy content"], "avatar.png", { type: "image/png" })
      const formData = new FormData()
      formData.append("avatar", file)
      
      mockSupabase.storage.upload.mockResolvedValue({ error: null })
      mockSupabase.storage.getPublicUrl.mockReturnValue({ data: { publicUrl: "https://example.com/avatar.png" } })
      mockSupabase.update.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) })

      const result = await uploadAvatar(formData)
      
      expect(result.success).toBe(true)
      expect(result.data).toContain("https://example.com/avatar.png")
      expect(revalidatePath).toHaveBeenCalledWith("/profile")
    })
  })
})
