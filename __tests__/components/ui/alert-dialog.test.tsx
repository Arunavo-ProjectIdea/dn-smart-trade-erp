import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../../src/components/ui/alert-dialog"

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

describe("AlertDialog Component", () => {
  let user: any;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders trigger and can be opened", async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger data-testid="alert-trigger">Open Dialog</AlertDialogTrigger>
        <AlertDialogContent data-testid="alert-content">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    // Trigger is present
    const trigger = screen.getByTestId("alert-trigger")
    expect(trigger).toBeInTheDocument()
    
    // Content is initially hidden
    expect(screen.queryByTestId("alert-content")).not.toBeInTheDocument()
    
    // Open dialog
    await user.click(trigger)
    
    // Dialog content should now be visible
    const content = await screen.findByTestId("alert-content")
    expect(content).toBeInTheDocument()
    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()
  })
})
