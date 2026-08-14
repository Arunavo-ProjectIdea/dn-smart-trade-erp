import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { LoadingState } from "../../../src/components/erp/loading-state"

describe("LoadingState Component", () => {
  it("renders table variant by default", () => {
    const { container } = render(<LoadingState />)
    // Should render table skeleton wrappers
    expect(container.firstChild).toHaveClass("space-y-4", "w-full")
  })

  it("renders card variant with specified count", () => {
    const { container } = render(<LoadingState variant="card" count={3} />)
    // grid layout for cards
    expect(container.firstChild).toHaveClass("grid", "gap-4")
    // Should have 3 child cards
    expect(container.firstChild?.childNodes).toHaveLength(3)
  })

  it("renders list variant with specified count", () => {
    const { container } = render(<LoadingState variant="list" count={2} />)
    // list layout
    expect(container.firstChild).toHaveClass("space-y-4")
    expect(container.firstChild?.childNodes).toHaveLength(2)
  })
})
