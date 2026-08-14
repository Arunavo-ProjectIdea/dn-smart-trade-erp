import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Input } from "../../../src/components/ui/input"

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument()
  })

  it("handles user input", () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} data-testid="input" />)
    
    const input = screen.getByTestId("input")
    fireEvent.change(input, { target: { value: "Hello" } })
    
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("can be disabled", () => {
    render(<Input disabled data-testid="input" />)
    expect(screen.getByTestId("input")).toBeDisabled()
  })
  
  it("passes custom classes correctly", () => {
    render(<Input className="custom-class" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("custom-class")
  })
  
  it("forwards refs correctly", () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
