import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  createNotification
} from "../../src/actions/notifications.actions"
import { createClient } from "../../src/lib/supabase/server"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("Notifications Actions", () => {
  let mockSupabase: any
  let queryBuilder: any

  beforeEach(() => {
    vi.clearAllMocks()

    queryBuilder = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn((resolve) => resolve({ data: [{ id: "notif-1" }], error: null, count: 5 })),
    }

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } }, error: null }),
      },
      from: vi.fn().mockImplementation(() => queryBuilder),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
  })

  describe("getNotifications", () => {
    it("should fail if user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error("Auth error") })
      
      const result = await getNotifications()
      expect(result.success).toBe(false)
      expect(result.error).toBe("Not authenticated")
    })

    it("should fetch all notifications successfully", async () => {
      const result = await getNotifications()
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(mockSupabase.from).toHaveBeenCalledWith("notifications")
      expect(queryBuilder.eq).toHaveBeenCalledWith("user_id", "user-123")
    })

    it("should apply filters correctly", async () => {
      await getNotifications({ type: "system", dateFrom: "2023-01-01", dateTo: "2023-12-31" })
      expect(queryBuilder.eq).toHaveBeenCalledWith("type", "system")
      expect(queryBuilder.gte).toHaveBeenCalledWith("created_at", "2023-01-01")
      expect(queryBuilder.lte).toHaveBeenCalledWith("created_at", "2023-12-31")
    })

    it("should fetch only unread notifications", async () => {
      await getNotifications({ type: "unread" })
      expect(queryBuilder.eq).toHaveBeenCalledWith("is_read", false)
    })

    it("should handle DB error gracefully", async () => {
      queryBuilder.then = vi.fn((resolve) => resolve({ data: null, error: { message: "DB Error" } }))
      
      const result = await getNotifications()
      expect(result.success).toBe(false)
      expect(result.error).toBe("DB Error")
    })
  })

  describe("getUnreadCount", () => {
    it("should fetch unread count successfully", async () => {
      const result = await getUnreadCount()
      expect(result.success).toBe(true)
      expect(result.data).toBe(5)
    })

    it("should handle DB error", async () => {
      queryBuilder.then = vi.fn((resolve) => resolve({ count: null, error: { message: "Count error" } }))
      const result = await getUnreadCount()
      expect(result.success).toBe(false)
      expect(result.error).toBe("Count error")
    })
  })

  describe("markNotificationRead", () => {
    it("should mark a specific notification as read", async () => {
      const result = await markNotificationRead("notif-1")
      expect(result.success).toBe(true)
      expect(queryBuilder.update).toHaveBeenCalledWith({ is_read: true })
    })

    it("should handle DB error", async () => {
      queryBuilder.then = vi.fn((resolve) => resolve({ error: { message: "Update failed" } }))
      const result = await markNotificationRead("notif-1")
      expect(result.success).toBe(false)
      expect(result.error).toBe("Update failed")
    })
  })

  describe("markAllNotificationsRead", () => {
    it("should mark all user notifications as read", async () => {
      const result = await markAllNotificationsRead()
      expect(result.success).toBe(true)
    })
  })

  describe("deleteNotification", () => {
    it("should delete notification successfully", async () => {
      const result = await deleteNotification("notif-1")
      expect(result.success).toBe(true)
    })
  })

  describe("createNotification", () => {
    it("should create notification successfully", async () => {
      // Need single() to return an object instead of array for create
      queryBuilder.then = vi.fn((resolve) => resolve({ data: { id: "notif-1" }, error: null }))
      
      const result = await createNotification({
        userId: "target-user",
        type: "system",
        priority: "high",
        title: "Test Alert",
        description: "Test description"
      })
      expect(result.success).toBe(true)
      expect(result.data).toBe("notif-1")
      expect(queryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: "target-user",
        title: "Test Alert"
      }))
    })

    it("should handle DB error on creation", async () => {
      queryBuilder.then = vi.fn((resolve) => resolve({ data: null, error: { message: "Insert failed" } }))
      const result = await createNotification({
        userId: "target",
        type: "system",
        priority: "high",
        title: "T",
        description: "D"
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe("Insert failed")
    })
  })
})
