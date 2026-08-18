import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../src/components/ui/dropdown-menu"

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

describe("DropdownMenu Component", () => {
  let user: any;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders trigger and opens menu", async () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="dropdown-trigger">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent data-testid="dropdown-content">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem data-testid="dropdown-item" onClick={onSelect}>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByTestId("dropdown-trigger")
    expect(trigger).toBeInTheDocument()
    
    // Open menu
    await user.click(trigger)
    
    // Menu content should be visible
    const content = await screen.findByTestId("dropdown-content")
    expect(content).toBeInTheDocument()
    expect(screen.getByText("My Account")).toBeInTheDocument()
    
    // Click item
    const item = screen.getByTestId("dropdown-item")
    await user.click(item)
    
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled()
    })
  })
})
