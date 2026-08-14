import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { EmptyState } from "../../src/components/ui/empty-state"
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons"

describe("EmptyState Component", () => {
  it("renders the empty state correctly with title and description", () => {
    render(
      <EmptyState
        icon={faBoxOpen}
        title="No items found"
        description="Try adjusting your filters or search query."
      />
    )

    expect(screen.getByText("No items found")).toBeInTheDocument()
    expect(screen.getByText("Try adjusting your filters or search query.")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("No items found")
  })
})
