import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { StatusBadge } from "../../../src/components/erp/status-badge"

describe("StatusBadge Component", () => {
  it("renders Active status with correct styles", () => {
    const { container } = render(<StatusBadge status="Active" />)
    expect(screen.getByText("Active")).toBeInTheDocument()
    
    // Check if the badge has the specific emerald classes applied for Active
    const badge = container.firstChild
    expect(badge).toHaveClass("text-emerald-700")
    expect(badge).toHaveClass("bg-emerald-500/10")
  })

  it("renders Pending status with warning styles", () => {
    const { container } = render(<StatusBadge status="Pending" />)
    expect(screen.getByText("Pending")).toBeInTheDocument()
    
    const badge = container.firstChild
    expect(badge).toHaveClass("text-amber-700")
  })

  it("renders fallback for unknown statuses gracefully", () => {
    const { container } = render(<StatusBadge status={"UnknownStatus" as any} />)
    expect(screen.getByText("UnknownStatus")).toBeInTheDocument()
    
    const badge = container.firstChild
    expect(badge).toHaveClass("text-muted-foreground")
  })
})
