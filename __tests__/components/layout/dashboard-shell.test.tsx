import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { DashboardShell } from "../../../src/components/layout/dashboard-shell"

vi.mock("../../../src/components/layout/sidebar", () => ({
  Sidebar: ({ role, isCollapsed, onToggleCollapse }: any) => (
    <div data-testid="sidebar" data-role={role} data-collapsed={isCollapsed}>
      <button onClick={onToggleCollapse}>Toggle</button>
    </div>
  ),
}))

vi.mock("../../../src/components/layout/top-nav", () => ({
  TopNav: ({ onMenuClick, role }: any) => (
    <div data-testid="top-nav" data-role={role}>
      <button onClick={onMenuClick}>Menu</button>
    </div>
  ),
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

describe("DashboardShell Component", () => {
  it("renders children and layout components", () => {
    render(
      <DashboardShell>
        <div data-testid="child-content">Child Content</div>
      </DashboardShell>
    )
    
    expect(screen.getByTestId("child-content")).toBeInTheDocument()
    // Should render two sidebars: one for sheet (mobile), one for desktop
    const sidebars = screen.getAllByTestId("sidebar")
    expect(sidebars.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByTestId("top-nav")).toBeInTheDocument()
  })

  it("passes role to Sidebar and TopNav", () => {
    render(
      <DashboardShell role="Client">
        <div>Content</div>
      </DashboardShell>
    )
    
    const sidebars = screen.getAllByTestId("sidebar")
    expect(sidebars[0]).toHaveAttribute("data-role", "Client")
    
    const topNav = screen.getByTestId("top-nav")
    expect(topNav).toHaveAttribute("data-role", "Client")
  })
})
