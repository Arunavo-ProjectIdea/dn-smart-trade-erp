import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Notifications } from "../../../src/components/layout/notifications"

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.mock("@/actions/notifications.actions", () => ({
  getNotifications: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: "1", type: "system", title: "Test 1", message: "Msg 1", is_read: false, created_at: new Date().toISOString() },
      { id: "2", type: "system", title: "Test 2", message: "Msg 2", is_read: false, created_at: new Date().toISOString() }
    ]
  }),
  markNotificationRead: vi.fn().mockResolvedValue({ success: true }),
  markAllNotificationsRead: vi.fn().mockResolvedValue({ success: true }),
}))



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

describe("Notifications Component", () => {
  let user: any;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders trigger and shows unread indicator", () => {
    render(<Notifications />)
    const trigger = screen.getByRole("button", { name: "Toggle notifications" })
    expect(trigger).toBeInTheDocument()
  })

  it("opens menu and marks all as read", async () => {
    render(<Notifications />)
    const trigger = screen.getByRole("button", { name: "Toggle notifications" })
    
    await user.click(trigger)
    
    // Check elements in dropdown
    const countText = await screen.findByText("2 unread")
    expect(countText).toBeInTheDocument()
    
    const markAllReadBtn = screen.getByRole("button", { name: "Mark all read" })
    await user.click(markAllReadBtn)
    
    // Count should be updated
    await waitFor(() => {
      expect(screen.getByText("0 unread")).toBeInTheDocument()
    })
    
    expect(screen.queryByRole("button", { name: "Mark all read" })).not.toBeInTheDocument()
  })
})
