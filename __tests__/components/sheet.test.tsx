import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../src/components/ui/sheet"

describe("Sheet Component", () => {
  it("opens when trigger is clicked and displays content", async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )

    const trigger = screen.getByText("Open Sheet")
    await user.click(trigger)

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Edit profile")).toBeInTheDocument()
    expect(screen.getByText("Make changes to your profile here.")).toBeInTheDocument()
  })
})
