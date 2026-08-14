import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useToast, toast } from "../../src/components/ui/use-toast"
import { renderHook } from "@testing-library/react"
import { toast as sonnerToast } from "sonner"

// Remove the global vitest.setup.ts mock specifically for this file
vi.unmock("../../src/components/ui/use-toast")

vi.mock("sonner", () => ({
  toast: vi.fn(),
}))

describe("use-toast hook and utility", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("hook: useToast", () => {
    it("calls sonnerToast with title and description", () => {
      const { result } = renderHook(() => useToast())
      result.current.toast({ title: "Success", description: "Operation completed." })
      expect(sonnerToast).toHaveBeenCalledWith("Success", { description: "Operation completed." })
    })

    it("calls sonnerToast with only title", () => {
      const { result } = renderHook(() => useToast())
      result.current.toast({ title: "Success" })
      expect(sonnerToast).toHaveBeenCalledWith("Success")
    })
  })

  describe("utility: toast", () => {
    it("calls sonnerToast with title and description", () => {
      toast({ title: "Error", description: "Failed action." })
      expect(sonnerToast).toHaveBeenCalledWith("Error", { description: "Failed action." })
    })

    it("calls sonnerToast with only title", () => {
      toast({ title: "Error" })
      expect(sonnerToast).toHaveBeenCalledWith("Error")
    })
  })
})
