import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "../../../src/components/ui/breadcrumb"

describe("Breadcrumb Component", () => {
  it("renders breadcrumb structure correctly", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" data-testid="link-home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="current-page">Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    // Nav element
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "breadcrumb")

    // Link
    const link = screen.getByTestId("link-home")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/")
    
    // Ellipsis
    expect(screen.getByTestId("ellipsis")).toBeInTheDocument()
    
    // Current page
    const page = screen.getByTestId("current-page")
    expect(page).toBeInTheDocument()
    expect(page).toHaveAttribute("aria-current", "page")
  })
})
