import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge } from "../../../src/components/ui/badge"

describe("Badge", () => {
  it("renders correctly", () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText("Test Badge")).toBeInTheDocument()
  })

  it("applies default variant classes", () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText("Default")
    expect(badge).toHaveClass("bg-primary", "text-primary-foreground")
  })

  it("applies specific variant classes", () => {
    render(<Badge variant="destructive">Destructive</Badge>)
    const badge = screen.getByText("Destructive")
    expect(badge).toHaveClass("bg-destructive/10", "text-destructive")
  })

  it("applies secondary variant classes", () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    const badge = screen.getByText("Secondary")
    expect(badge).toHaveClass("bg-secondary", "text-secondary-foreground")
  })

  it("applies outline variant classes", () => {
    render(<Badge variant="outline">Outline</Badge>)
    const badge = screen.getByText("Outline")
    expect(badge).toHaveClass("text-foreground", "border")
  })

  it("passes custom classNames down", () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    expect(screen.getByText("Custom")).toHaveClass("custom-badge")
  })
})
