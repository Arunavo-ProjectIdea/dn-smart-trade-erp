import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Textarea } from "../../../src/components/ui/textarea"

describe("Textarea", () => {
  it("renders correctly", () => {
    render(<Textarea placeholder="Enter details" />)
    expect(screen.getByPlaceholderText("Enter details")).toBeInTheDocument()
  })

  it("handles user input", () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} data-testid="textarea" />)
    
    const textarea = screen.getByTestId("textarea")
    fireEvent.change(textarea, { target: { value: "Hello world\nNew line" } })
    
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("can be disabled", () => {
    render(<Textarea disabled data-testid="textarea" />)
    expect(screen.getByTestId("textarea")).toBeDisabled()
  })
  
  it("passes custom classes correctly", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />)
    expect(screen.getByTestId("textarea")).toHaveClass("custom-class")
  })
})
