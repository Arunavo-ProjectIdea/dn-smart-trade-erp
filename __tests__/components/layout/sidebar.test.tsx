import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Sidebar } from "../../../src/components/layout/sidebar"
import { usePathname } from "next/navigation"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}))

describe("Sidebar Component", () => {
  it("renders Admin navigation items", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard")
    render(<Sidebar role="Admin" />)
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Employees")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })

  it("renders Employee navigation items (no Settings/Employees)", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard")
    render(<Sidebar role="Employee" />)
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.queryByText("Employees")).not.toBeInTheDocument()
    expect(screen.queryByText("Settings")).not.toBeInTheDocument()
  })

  it("renders Client navigation items", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard")
    render(<Sidebar role="Client" />)
    
    expect(screen.getByText("My Shipments")).toBeInTheDocument()
    expect(screen.queryByText("Employees")).not.toBeInTheDocument()
  })

  it("calls onToggleCollapse when collapse button is clicked", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard")
    const onToggle = vi.fn()
    render(<Sidebar role="Admin" onToggleCollapse={onToggle} isCollapsed={false} />)
    
    const collapseBtn = screen.getByTitle("Collapse Sidebar")
    fireEvent.click(collapseBtn)
    
    expect(onToggle).toHaveBeenCalled()
  })
})
