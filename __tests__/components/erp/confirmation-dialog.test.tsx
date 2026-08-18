import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { ConfirmationDialog } from "../../../src/components/erp/confirmation-dialog"
import { Button } from "../../../src/components/ui/button"

describe("ConfirmationDialog Component", () => {
  it("opens when uncontrolled trigger is clicked and fires callbacks", async () => {
    const handleConfirm = vi.fn()
    const handleCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmationDialog
        title="Delete Item"
        description="Are you sure?"
        trigger={<Button>Delete</Button>}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )

    await user.click(screen.getByText("Delete"))
    
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    // Test confirm
    await user.click(screen.getByText("Confirm"))
    expect(handleConfirm).toHaveBeenCalled()
  })

  it("renders controlled when open prop is true", () => {
    render(
      <ConfirmationDialog
        open={true}
        title="Controlled Dialog"
        description="Visible immediately."
        onConfirm={vi.fn()}
      />
    )
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("Controlled Dialog")).toBeInTheDocument()
  })
})
