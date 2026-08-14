import { describe, it, expect, vi, beforeEach } from "vitest"
import { getChatSessions, getChatMessages } from "../../src/actions/chat.actions"
import { createClient } from "../../src/lib/supabase/server"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

describe("Chat Actions", () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
  })

  describe("getChatSessions", () => {
    it("should return Unauthorized if user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } })
      
      const result = await getChatSessions()
      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("should return chat sessions successfully", async () => {
      const mockSessions = [{ id: "sess-1", title: "Chat 1" }]
      mockSupabase.order.mockResolvedValueOnce({ data: mockSessions, error: null })
      
      const result = await getChatSessions()
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockSessions)
      expect(mockSupabase.from).toHaveBeenCalledWith("chat_sessions")
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "user-1")
    })

    it("should handle DB error gracefully", async () => {
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: "DB Error" } })
      
      const result = await getChatSessions()
      expect(result.success).toBe(false)
      expect(result.error).toBe("DB Error")
    })
  })

  describe("getChatMessages", () => {
    it("should return Unauthorized if user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } })
      
      const result = await getChatMessages("sess-1")
      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("should return chat messages successfully", async () => {
      const mockMessages = [{ id: "msg-1", role: "user", content: "Hello" }]
      mockSupabase.order.mockResolvedValueOnce({ data: mockMessages, error: null })
      
      const result = await getChatMessages("sess-1")
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockMessages)
      expect(mockSupabase.from).toHaveBeenCalledWith("chat_messages")
      expect(mockSupabase.eq).toHaveBeenCalledWith("session_id", "sess-1")
    })

    it("should handle DB error gracefully", async () => {
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: "DB Error" } })
      
      const result = await getChatMessages("sess-1")
      expect(result.success).toBe(false)
      expect(result.error).toBe("DB Error")
    })
  })
})
