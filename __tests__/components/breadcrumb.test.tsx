import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "../../src/components/ui/breadcrumb"

describe("Breadcrumb Component", () => {
  it("renders a full breadcrumb trail correctly", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByText("Home")).toHaveAttribute("href", "/")
    expect(screen.getByText("Components")).toHaveAttribute("href", "/components")
    expect(screen.getByText("Breadcrumb")).toHaveAttribute("aria-current", "page")
    expect(screen.getByText("Breadcrumb")).toHaveAttribute("role", "link")
  })
})
