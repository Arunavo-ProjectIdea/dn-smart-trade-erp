import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Label } from "../../../src/components/ui/label"

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label htmlFor="test">Test Label</Label>)
    const label = screen.getByText("Test Label")
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute("for", "test")
  })

  it("applies base classes", () => {
    render(<Label>Base Label</Label>)
    const label = screen.getByText("Base Label")
    expect(label).toHaveClass("text-sm", "font-medium", "leading-none")
  })

  it("passes custom classNames down", () => {
    render(<Label className="custom-label">Custom Label</Label>)
    expect(screen.getByText("Custom Label")).toHaveClass("custom-label")
  })
})
