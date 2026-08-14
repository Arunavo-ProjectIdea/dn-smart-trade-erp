import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "../../../src/components/erp/empty-state"
import { faBox } from "@fortawesome/free-solid-svg-icons"

describe("EmptyState Component", () => {
  it("renders with title and default icon", () => {
    render(<EmptyState title="No items found" />)
    expect(screen.getByText("No items found")).toBeInTheDocument()
  })

  it("renders with description and action", () => {
    render(
      <EmptyState
        title="No items found"
        description="Try adjusting your filters"
        action={<button>Clear filters</button>}
      />
    )
    
    expect(screen.getByText("Try adjusting your filters")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(<EmptyState title="Title" className="custom-class" />)
    expect(container.firstChild).toHaveClass("custom-class")
  })
})
