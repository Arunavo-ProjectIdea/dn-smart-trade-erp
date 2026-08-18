import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { DynamicBreadcrumbs } from "../../../src/components/layout/breadcrumbs"
import { usePathname } from "next/navigation"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}))

describe("DynamicBreadcrumbs Component", () => {
  it("renders nothing when on root path", () => {
    vi.mocked(usePathname).mockReturnValue("/")
    const { container } = render(<DynamicBreadcrumbs />)
    expect(container.firstChild).toBeNull()
  })

  it("renders breadcrumbs for standard path", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/settings")
    render(<DynamicBreadcrumbs />)
    
    // Check elements
    const dashboardLink = screen.getByText("Dashboard")
    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink.closest("a")).toHaveAttribute("href", "/dashboard")
    
    // Last item should not be a link
    const settingsText = screen.getByText("Settings")
    expect(settingsText).toBeInTheDocument()
    expect(settingsText.closest("a")).toBeNull()
  })

  it("truncates UUIDs in path", () => {
    vi.mocked(usePathname).mockReturnValue("/clients/123e4567-e89b-12d3-a456-426614174000")
    render(<DynamicBreadcrumbs />)
    
    expect(screen.getByText("Clients")).toBeInTheDocument()
    expect(screen.getByText("123e4567...")).toBeInTheDocument()
  })
})
