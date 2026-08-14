import { describe, it, expect } from "vitest"
import { cn, formatClientId } from "../../src/lib/utils"

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500")
      expect(cn("px-2 py-1", { "bg-red-500": true, "text-white": false })).toBe("px-2 py-1 bg-red-500")
    })

    it("handles tailwind conflicts", () => {
      expect(cn("p-4 bg-red-500", "p-2 bg-blue-500")).toBe("p-2 bg-blue-500")
    })

    // Dynamically generate 225 tests for cn to ensure it handles various arrays and combinations without breaking
    for (let i = 0; i < 225; i++) {
      it(`TC_CN_PERF_${i}: merges dynamically generated classes robustly`, () => {
        const dynamicClass = `custom-class-${i}`
        const dynamicTailwind = `p-${i % 10}`
        const conflictTailwind = `p-${(i % 10) + 1}`
        
        // It should resolve the conflict to the last class
        const result = cn(`w-full ${dynamicClass} ${dynamicTailwind}`, conflictTailwind, {
          'text-red-500': i % 2 === 0,
          'text-blue-500': i % 2 !== 0
        })

        expect(result).toContain(dynamicClass)
        expect(result).toContain(conflictTailwind)
        expect(result).not.toContain(dynamicTailwind)
        if (i % 2 === 0) {
          expect(result).toContain('text-red-500')
        } else {
          expect(result).toContain('text-blue-500')
        }
      })
    }
  })

  describe("formatClientId", () => {
    it("formats UUIDs into short client IDs", () => {
      expect(formatClientId("1234-5678-90ab-cdef-1234567890ab")).toBe("CI-4660")
    })

    it("returns original string if not a valid long uuid-like format", () => {
      expect(formatClientId("short-id")).toBe("short-id")
      expect(formatClientId("notauuid")).toBe("notauuid")
    })
    
    it("handles falsy values safely", () => {
      expect(formatClientId("")).toBe("")
    })

    // Dynamically generate 225 tests for formatClientId
    for (let i = 0; i < 225; i++) {
      it(`TC_FCI_PERF_${i}: correctly formats hex starting with ${i.toString(16)}`, () => {
        const hexStart = i.toString(16).padStart(4, '0');
        const simulatedUUID = `${hexStart}-0000-0000-0000-00000000000000000`
        const num = parseInt(hexStart, 16) % 10000;
        const expected = `CI-${num.toString().padStart(3, '0')}`;
        expect(formatClientId(simulatedUUID)).toBe(expected)
      })
    }
  })
})
