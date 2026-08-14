import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Checkbox } from "../../../src/components/ui/checkbox"

describe("Checkbox", () => {
  it("renders correctly", () => {
    render(<Checkbox data-testid="checkbox" />)
    expect(screen.getByTestId("checkbox")).toBeInTheDocument()
  })

  it("handles user interaction", () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox onCheckedChange={onCheckedChange} data-testid="checkbox" />)
    
    const checkbox = screen.getByTestId("checkbox")
    fireEvent.click(checkbox)
    
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("can be disabled", () => {
    render(<Checkbox disabled data-testid="checkbox" />)
    expect(screen.getByTestId("checkbox")).toHaveAttribute("aria-disabled", "true")
  })

  it("can be checked by default", () => {
    render(<Checkbox defaultChecked data-testid="checkbox" />)
    expect(screen.getByTestId("checkbox")).toHaveAttribute("aria-checked", "true")
  })
})
