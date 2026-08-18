import { describe, it, expect, vi, beforeEach } from "vitest"
import { getHSCodeAutocomplete, findHSCodesWithAI } from "../../src/actions/hs-code-ai.actions"
import { createClient } from "../../src/lib/supabase/server"
import * as tradeSynonyms from "../../src/lib/trade-synonyms"

vi.mock("../../src/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("../../src/lib/trade-synonyms", () => ({
  expandTradeSynonym: vi.fn(),
}))

describe("HS Code AI Actions", () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      rpc: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never)
  })

  describe("getHSCodeAutocomplete", () => {
    it("should return empty array if query is too short", async () => {
      const result = await getHSCodeAutocomplete("1")
      expect(result).toEqual([])
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it("should return formatted autocomplete items", async () => {
      const mockData = [
        { hscode: "1234.56.78", tariff_description: "Test Item" },
        { hscode: "9876.54.32", tariff_description: null }
      ]
      mockSupabase.limit.mockResolvedValueOnce({ data: mockData, error: null })
      
      const result = await getHSCodeAutocomplete("test")
      expect(result).toHaveLength(2)
      expect(result[0].description).toBe("Test Item")
      expect(result[1].description).toBe("9876.54.32") // fallback to hscode if desc is null
    })

    it("should return empty array on DB error", async () => {
      mockSupabase.limit.mockResolvedValueOnce({ data: null, error: { message: "DB error" } })
      const result = await getHSCodeAutocomplete("test")
      expect(result).toEqual([])
    })
  })

  describe("findHSCodesWithAI", () => {
    it("should return empty result if query is empty", async () => {
      const result = await findHSCodesWithAI("   ")
      expect(result.candidates).toEqual([])
      expect(result.totalMatches).toBe(0)
    })

    it("should handle successful RPC match", async () => {
      vi.mocked(tradeSynonyms.expandTradeSynonym).mockReturnValue({
        searchTerm: "laptop",
        matchedKeyword: "laptop",
        matchedCategory: "Electronics"
      })

      const mockRpcData = [{
        hscode: "8471.30.00",
        tariff_description: "Portable digital automatic data processing machines",
        category: "Computers",
        cd: 5, sd: 0, vat: 15, ait: 5, at: 5, rd: 0,
        trgm_score: 0.8
      }]

      mockSupabase.rpc.mockResolvedValueOnce({ data: mockRpcData, error: null })

      const result = await findHSCodesWithAI("laptop")
      expect(result.candidates).toHaveLength(1)
      expect(result.candidates[0].hsCode).toBe("8471.30.00")
      expect(result.candidates[0].confidence).toBeGreaterThanOrEqual(70)
      expect(result.candidates[0].matchedKeywords).toContain("laptop")
      expect(result.candidates[0].duties.estimatedTotal).toBe(30) // 5+0+15+5+0+5
    })

    it("should fallback to direct ILIKE query if RPC fails or returns empty", async () => {
      vi.mocked(tradeSynonyms.expandTradeSynonym).mockReturnValue({
        searchTerm: "laptop",
        matchedKeyword: undefined,
        matchedCategory: undefined
      })

      // RPC fails
      mockSupabase.rpc.mockResolvedValueOnce({ data: null, error: { message: "RPC fail" } })
      
      // Fallback query succeeds
      const mockFallbackData = [{
        hscode: "8471.30.00",
        tariff_description: "Portable machine",
        cd: 10
      }]
      mockSupabase.limit.mockResolvedValueOnce({ data: mockFallbackData, error: null })

      const result = await findHSCodesWithAI("laptop")
      expect(result.candidates).toHaveLength(1)
      expect(result.candidates[0].confidence).toBe(55) // Math.round(0.6 * 75 + 10) = 45+10 = 55
      expect(result.candidates[0].duties.cd).toBe(10)
    })

    it("should return empty result if both RPC and fallback fail", async () => {
      vi.mocked(tradeSynonyms.expandTradeSynonym).mockReturnValue({
        searchTerm: "laptop",
        matchedKeyword: undefined,
        matchedCategory: undefined
      })

      // Both fail
      mockSupabase.rpc.mockResolvedValueOnce({ data: null, error: null })
      mockSupabase.limit.mockResolvedValueOnce({ data: null, error: null })

      const result = await findHSCodesWithAI("laptop")
      expect(result.candidates).toHaveLength(0)
    })
  })
})
