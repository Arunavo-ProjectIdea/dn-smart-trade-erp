import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../../../src/components/ui/card"

describe("Card", () => {
  it("renders card with all sub-components", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId("card")).toBeInTheDocument()
    expect(screen.getByText("Card Title")).toBeInTheDocument()
    expect(screen.getByText("Card Description")).toBeInTheDocument()
    expect(screen.getByText("Card Content")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
  })

  it("passes custom classNames down", () => {
    render(
      <Card className="custom-card" data-testid="card">
        <CardHeader className="custom-header" data-testid="header" />
        <CardContent className="custom-content" data-testid="content" />
        <CardFooter className="custom-footer" data-testid="footer" />
      </Card>
    )

    expect(screen.getByTestId("card")).toHaveClass("custom-card")
    expect(screen.getByTestId("header")).toHaveClass("custom-header")
    expect(screen.getByTestId("content")).toHaveClass("custom-content")
    expect(screen.getByTestId("footer")).toHaveClass("custom-footer")
  })
})
