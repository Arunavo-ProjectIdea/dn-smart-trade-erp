import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getReportKPIs,
  getShipmentAnalytics,
  getDocumentAnalytics,
  getClientAnalytics,
  getMonthlyTrends,
  getReportTableRows
} from "../../src/actions/report.actions"
import { getUserProfile } from "../../src/actions/auth.actions"
import { createClient } from "../../src/lib/supabase/server"

vi.mock("../../src/actions/auth.actions", () => ({
  getUserProfile: vi.fn(),
}))

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

describe("Report Actions", () => {
  let mockSupabase: any

  const createBuilder = (resolveValue: any) => {
    const builder: any = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn((resolve) => resolve(resolveValue))
    }
    return builder
  }

  const createRejectBuilder = (error: Error) => {
    const builder: any = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn((resolve, reject) => reject(error))
    }
    return builder
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = {
      from: vi.fn(),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
    vi.spyOn(console, "error").mockImplementation(() => {}) // Suppress errors in test output
  })

  describe("getReportKPIs", () => {
    it("should return Unauthorized if getUserProfile fails", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: false, error: "Unauthorized" } as any)
      const result = await getReportKPIs()
      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("should return Client KPIs if user is a Client", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Client", client_id: "client-1" } } as any)
      
      mockSupabase.from
        .mockReturnValueOnce(createBuilder({ count: 10 })) // totalShipments
        .mockReturnValueOnce(createBuilder({ count: 5 }))  // completedShipments
        .mockReturnValueOnce(createBuilder({ count: 5 }))  // activeShipments
        .mockReturnValueOnce(createBuilder({ count: 20 })) // totalDocuments

      const result = await getReportKPIs()
      expect(result.success).toBe(true)
      expect(result.data?.totalShipments).toBe(10)
      expect(result.data?.completedShipments).toBe(5)
      expect(result.data?.totalDocuments).toBe(20)
    })

    it("should return error for Client without client_id", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Client", client_id: null } } as any)
      const result = await getReportKPIs()
      expect(result.success).toBe(false)
      expect(result.error).toBe("No client profile found")
    })

    it("should return Admin KPIs if user is not a Client", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)
      
      mockSupabase.from
        .mockReturnValueOnce(createBuilder({ count: 50 }))  // totalClients
        .mockReturnValueOnce(createBuilder({ count: 100 })) // totalShipments
        .mockReturnValueOnce(createBuilder({ count: 80 }))  // completedShipments
        .mockReturnValueOnce(createBuilder({ count: 20 }))  // activeShipments
        .mockReturnValueOnce(createBuilder({ count: 200 })) // totalDocuments
        .mockReturnValueOnce(createBuilder({ count: 30 }))  // totalBOE
        .mockReturnValueOnce(createBuilder({ count: 10 }))  // activeEmployees

      const result = await getReportKPIs()
      expect(result.success).toBe(true)
      expect(result.data?.totalClients).toBe(50)
      expect(result.data?.totalShipments).toBe(100)
    })

    it("should handle DB exceptions", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)
      mockSupabase.from.mockReturnValueOnce(createRejectBuilder(new Error("DB Connection Error")))
      
      const result = await getReportKPIs()
      expect(result.success).toBe(false)
      expect(result.error).toBe("Failed to fetch report KPIs")
    })
  })

  describe("getShipmentAnalytics", () => {
    it("should aggregate by status and transport type", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)
      
      const mockData = [
        { status: "In Transit", transport_type: "Air" },
        { status: "In Transit", transport_type: "Sea" },
        { status: "Delivered", transport_type: "Air" }
      ]
      
      mockSupabase.from.mockReturnValueOnce(createBuilder({ data: mockData, error: null }))
      
      const result = await getShipmentAnalytics()
      expect(result.success).toBe(true)
      expect(result.data?.byStatus["In Transit"]).toBe(2)
      expect(result.data?.byStatus["Delivered"]).toBe(1)
      expect(result.data?.byTransportType["Air"]).toBe(2)
    })
  })

  describe("getDocumentAnalytics", () => {
    it("should aggregate by status and category for Client", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Client", client_id: "c1" } } as any)
      
      const mockData = [
        { status: "Approved", category: "Invoice" },
        { status: "Pending", category: "Invoice" }
      ]
      
      mockSupabase.from.mockReturnValueOnce(createBuilder({ data: mockData, error: null }))
      
      const result = await getDocumentAnalytics()
      expect(result.success).toBe(true)
      expect(result.data?.byStatus["Approved"]).toBe(1)
      expect(result.data?.byCategory["Invoice"]).toBe(2)
    })
  })

  describe("getClientAnalytics", () => {
    it("should return empty analytics if user is Client", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Client" } } as any)
      const result = await getClientAnalytics()
      expect(result.success).toBe(true)
      expect(result.data?.byStatus).toEqual({})
    })

    it("should aggregate client data if user is Admin", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)
      
      mockSupabase.from.mockReturnValueOnce(createBuilder({
        data: [{ status: "Active", client_type: "Corporate" }],
        error: null
      }))
      
      const result = await getClientAnalytics()
      expect(result.success).toBe(true)
      expect(result.data?.byStatus["Active"]).toBe(1)
      expect(result.data?.byType["Corporate"]).toBe(1)
    })
  })

  describe("getMonthlyTrends", () => {
    it("should aggregate trends correctly across months", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)
      
      const currentMonth = new Date().toISOString()
      
      mockSupabase.from
        .mockReturnValueOnce(createBuilder({ data: [{ created_at: currentMonth }], error: null })) // shipments
        .mockReturnValueOnce(createBuilder({ data: [{ upload_date: currentMonth }], error: null })) // documents
        .mockReturnValueOnce(createBuilder({ data: [{ created_at: currentMonth }], error: null })) // clients

      const result = await getMonthlyTrends()
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(12)
      
      const lastMonthStat = result.data![11] // Current month is at the end of the array
      expect(lastMonthStat.shipments).toBe(1)
      expect(lastMonthStat.documents).toBe(1)
      expect(lastMonthStat.clients).toBe(1)
    })
  })

  describe("getReportTableRows", () => {
    it("should aggregate shipments and documents and sort them by date", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)
      
      const olderDate = new Date("2023-01-01").toISOString()
      const newerDate = new Date("2023-12-31").toISOString()

      mockSupabase.from
        .mockReturnValueOnce(createBuilder({
          data: [{ id: "s1", shipment_number: "SHP1", status: "In Transit", updated_at: olderDate, clients: { company_name: "Client A" } }]
        }))
        .mockReturnValueOnce(createBuilder({
          data: [{ id: "d1", name: "Doc1", status: "Approved", upload_date: newerDate, profiles: { full_name: "User A" } }]
        }))

      const result = await getReportTableRows()
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      
      expect(result.data![0].id).toBe("d1")
      expect(result.data![1].id).toBe("s1")
    })
    
    it("should handle error gracefully", async () => {
      vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: { role: "Admin" } } as any)
      mockSupabase.from.mockReturnValueOnce(createRejectBuilder(new Error("DB fail")))
      
      const result = await getReportTableRows()
      expect(result.success).toBe(false)
    })
  })
})
