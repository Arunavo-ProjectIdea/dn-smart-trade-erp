import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../src/components/ui/alert-dialog"

describe("AlertDialog Component", () => {
  it("opens when trigger is clicked and displays content", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )

    const trigger = screen.getByText("Open Dialog")
    await user.click(trigger)

    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument()
    expect(screen.getByText("Cancel")).toBeInTheDocument()
    expect(screen.getByText("Continue")).toBeInTheDocument()
  })
})
