import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CommandMenu } from "../../../src/components/layout/command-menu"
import { getEmployees } from "../../../src/actions/employees.actions"
import { useRouter } from "next/navigation"

vi.mock("../../../src/actions/employees.actions", () => ({
  getEmployees: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

describe("CommandMenu Component", () => {
  let user: any;
  let mockPush: any;

  beforeEach(() => {
    user = userEvent.setup();
    mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.mocked(getEmployees).mockResolvedValue({
      success: true,
      data: [
        { id: "emp-1", fullName: "John Doe", department: "Logistics", email: "john@test.com", phone: "", role: "Employee", status: "Active", joinedDate: "2023-01-01" }
      ]
    });
  });

  it("does not render when closed", () => {
    const { container } = render(<CommandMenu open={false} onOpenChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders when open and shows default navigation items", async () => {
    render(<CommandMenu open={true} onOpenChange={vi.fn()} />)
    
    expect(screen.getByPlaceholderText("Type a command or search...")).toBeInTheDocument()
    expect(screen.getByText("Search for clients, shipments, employees, or navigate to pages.")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Shipments")).toBeInTheDocument()
  })

  it("filters results based on search input", async () => {
    render(<CommandMenu open={true} onOpenChange={vi.fn()} />)
    
    const input = screen.getByPlaceholderText("Type a command or search...")
    await user.type(input, "John")
    
    // Wait for the employee result
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
      expect(screen.getByText("Logistics")).toBeInTheDocument()
    })
    
    // Default navigation shouldn't show if it doesn't match
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument()
  })

  it("calls onOpenChange and router.push when an item is selected", async () => {
    const onOpenChange = vi.fn()
    render(<CommandMenu open={true} onOpenChange={onOpenChange} />)
    
    const input = screen.getByPlaceholderText("Type a command or search...")
    await user.type(input, "Dashboard")
    
    const btn = screen.getByRole("button", { name: "Dashboard" })
    await user.click(btn)
    
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
  })

  it("shows no results message when no matches found", async () => {
    render(<CommandMenu open={true} onOpenChange={vi.fn()} />)
    
    const input = screen.getByPlaceholderText("Type a command or search...")
    await user.type(input, "xyznonexistent")
    
    await waitFor(() => {
      expect(screen.getByText('No results found for "xyznonexistent"')).toBeInTheDocument()
    })
  })
})
