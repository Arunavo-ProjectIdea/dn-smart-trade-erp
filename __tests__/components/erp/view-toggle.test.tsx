import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { ViewToggle } from "../../../src/components/erp/view-toggle"

describe("ViewToggle Component", () => {
  it("renders both toggle buttons", () => {
    render(<ViewToggle viewMode="table" onViewModeChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Grid" })).toBeInTheDocument()
  })

  it("highlights the active view mode", () => {
    const { rerender } = render(<ViewToggle viewMode="table" onViewModeChange={vi.fn()} />)
    const tableBtn = screen.getByRole("button", { name: "Table" })
    const gridBtn = screen.getByRole("button", { name: "Grid" })
    
    expect(tableBtn).toHaveAttribute("aria-pressed", "true")
    expect(gridBtn).toHaveAttribute("aria-pressed", "false")
    
    rerender(<ViewToggle viewMode="grid" onViewModeChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Table" })).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute("aria-pressed", "true")
  })

  it("calls onViewModeChange when clicked", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<ViewToggle viewMode="table" onViewModeChange={handleChange} />)
    
    await user.click(screen.getByRole("button", { name: "Grid" }))
    expect(handleChange).toHaveBeenCalledWith("grid")
  })
})
