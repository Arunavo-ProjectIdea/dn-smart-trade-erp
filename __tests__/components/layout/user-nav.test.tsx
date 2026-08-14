import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UserNav } from "../../../src/components/layout/user-nav"
import { getUserProfile, signOut } from "../../../src/actions/auth.actions"
import { useRouter } from "next/navigation"

vi.mock("../../../src/actions/auth.actions", () => ({
  getUserProfile: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

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

describe("UserNav Component", () => {
  let user: any;
  let mockPush: any;

  beforeEach(() => {
    user = userEvent.setup();
    mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    
    // Default location replace mock
    const mockLocation = { replace: vi.fn() };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true
    });
  });

  it("renders with user data and shows correct menu items for Admin", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({
      success: true,
      data: {
        id: "1",
        full_name: "Admin User",
        email: "admin@test.com",
        role: "Admin",
      }
    })

    render(<UserNav role="Admin" />)
    
    const trigger = screen.getByRole("button")
    expect(trigger).toBeInTheDocument()
    
    // Open menu
    await user.click(trigger)
    
    // Check elements
    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeVisible()
    })
    expect(screen.getByText("admin@test.com")).toBeVisible()
    expect(screen.getByText("Profile")).toBeVisible()
    expect(screen.getByText("Settings")).toBeVisible()
    expect(screen.getByText("Log out")).toBeVisible()
  })

  it("does not show settings for Employee role", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({
      success: true,
      data: {
        id: "2",
        full_name: "Employee User",
        email: "employee@test.com",
        role: "Employee",
      }
    })

    render(<UserNav role="Employee" />)
    
    const trigger = screen.getByRole("button")
    await user.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText("Employee User")).toBeVisible()
    })
    expect(screen.queryByText("Settings")).not.toBeInTheDocument()
  })

  it("handles logout", async () => {
    vi.mocked(getUserProfile).mockResolvedValue({ success: true, data: {} })
    render(<UserNav />)
    
    const trigger = screen.getByRole("button")
    await user.click(trigger)
    
    const logoutBtn = await screen.findByText("Log out")
    await user.click(logoutBtn)
    
    expect(signOut).toHaveBeenCalled()
    expect(window.location.replace).toHaveBeenCalledWith("/login")
  })
})
