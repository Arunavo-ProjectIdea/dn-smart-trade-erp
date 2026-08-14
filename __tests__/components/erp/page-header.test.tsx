import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { PageHeader } from "../../../src/components/erp/page-header"

describe("PageHeader Component", () => {
  it("renders title and description", () => {
    render(<PageHeader title="Dashboard" description="Overview of metrics" />)
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument()
    expect(screen.getByText("Overview of metrics")).toBeInTheDocument()
  })

  it("renders optional actions and badges", () => {
    render(
      <PageHeader 
        title="Orders" 
        action={<button>Create Order</button>} 
        badge={<span data-testid="badge">Beta</span>} 
      />
    )
    expect(screen.getByRole("button", { name: "Create Order" })).toBeInTheDocument()
    expect(screen.getByTestId("badge")).toHaveTextContent("Beta")
  })
})
