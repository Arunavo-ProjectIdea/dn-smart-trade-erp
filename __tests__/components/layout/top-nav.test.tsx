import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TopNav } from "../../../src/components/layout/top-nav"

vi.mock("../../../src/components/layout/breadcrumbs", () => ({
  DynamicBreadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}))

vi.mock("../../../src/components/layout/notifications", () => ({
  Notifications: () => <div data-testid="notifications">Notifications</div>,
}))

vi.mock("../../../src/components/layout/user-nav", () => ({
  UserNav: ({ role }: any) => <div data-testid="user-nav" data-role={role}>User Nav</div>,
}))

vi.mock("../../../src/components/layout/command-menu", () => ({
  CommandMenu: ({ open, onOpenChange }: any) => (
    <div data-testid="command-menu" data-open={open}>
      <button onClick={() => onOpenChange(false)}>Close Command Menu</button>
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

describe("TopNav Component", () => {
  it("renders layout components and passes down role", () => {
    const onMenuClick = vi.fn()
    render(<TopNav onMenuClick={onMenuClick} role="Admin" />)
    
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument()
    expect(screen.getByTestId("notifications")).toBeInTheDocument()
    
    const userNav = screen.getByTestId("user-nav")
    expect(userNav).toBeInTheDocument()
    expect(userNav).toHaveAttribute("data-role", "Admin")
  })

  it("calls onMenuClick when hamburger is clicked", () => {
    const onMenuClick = vi.fn()
    render(<TopNav onMenuClick={onMenuClick} role="Admin" />)
    
    const menuBtn = screen.getByLabelText("Open sidebar")
    fireEvent.click(menuBtn)
    expect(onMenuClick).toHaveBeenCalled()
  })

  it("opens CommandMenu when search bar is clicked", () => {
    const onMenuClick = vi.fn()
    render(<TopNav onMenuClick={onMenuClick} role="Admin" />)
    
    // Command menu initially closed
    expect(screen.getByTestId("command-menu")).toHaveAttribute("data-open", "false")
    
    // Click search
    const searchBar = screen.getByText("Search or type a command...")
    fireEvent.click(searchBar)
    
    // Command menu opens
    expect(screen.getByTestId("command-menu")).toHaveAttribute("data-open", "true")
  })

  it("shows Create button for Admin with New Employee option", async () => {
    const user = userEvent.setup()
    const onMenuClick = vi.fn()
    render(<TopNav onMenuClick={onMenuClick} role="Admin" />)
    
    const createBtn = screen.getByText("Create")
    expect(createBtn).toBeInTheDocument()
    
    // Open dropdown
    await user.click(createBtn)
    
    const employeeOption = await screen.findByText("New Employee")
    expect(employeeOption).toBeInTheDocument()
  })

  it("hides New Employee option for Employee role", async () => {
    const user = userEvent.setup()
    const onMenuClick = vi.fn()
    render(<TopNav onMenuClick={onMenuClick} role="Employee" />)
    
    const createBtn = screen.getByText("Create")
    
    // Open dropdown
    await user.click(createBtn)
    
    // Wait for dropdown to open by checking for "New Client"
    await screen.findByText("New Client")
    
    expect(screen.queryByText("New Employee")).not.toBeInTheDocument()
  })

  it("hides Create button entirely for Client role", () => {
    const onMenuClick = vi.fn()
    render(<TopNav onMenuClick={onMenuClick} role="Client" />)
    
    expect(screen.queryByText("Create")).not.toBeInTheDocument()
  })
})
