import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../../src/components/ui/sheet"

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;
  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

describe("Sheet Component", () => {
  let user: any;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders sheet trigger and opens content", async () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="trigger">Open</SheetTrigger>
        <SheetContent data-testid="content">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )

    const trigger = screen.getByTestId("trigger")
    expect(trigger).toBeInTheDocument()
    
    // Content is initially hidden
    expect(screen.queryByTestId("content")).not.toBeInTheDocument()

    // Click to open
    await user.click(trigger)

    const content = await screen.findByTestId("content")
    expect(content).toBeInTheDocument()
    expect(screen.getByText("Edit profile")).toBeInTheDocument()
  })
})
