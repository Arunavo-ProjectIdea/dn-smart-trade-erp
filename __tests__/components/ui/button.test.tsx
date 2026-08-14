import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "../../../src/components/ui/button"

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("applies default variant and size classes", () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole("button", { name: "Default" })
    expect(button).toHaveClass("bg-primary", "text-primary-foreground", "h-10", "px-4")
  })

  it("applies specific variant and size classes", () => {
    render(<Button variant="destructive" size="sm">Destructive</Button>)
    const button = screen.getByRole("button", { name: "Destructive" })
    expect(button).toHaveClass("bg-destructive/10", "text-destructive", "h-9", "px-4", "text-sm")
  })

  it("handles click events", () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole("button", { name: "Click me" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("can be disabled", () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Disabled</Button>)
    
    const button = screen.getByRole("button", { name: "Disabled" })
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
  
})
