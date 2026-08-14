import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { DataTable } from "../../../src/components/erp/data-table"

// Mock sonner toast which is used by DataTable exports
vi.mock("sonner", () => ({
  toast: vi.fn(),
}))

const mockData = [
  { id: 1, name: "Alice", role: "Admin", status: "Active" },
  { id: 2, name: "Bob", role: "User", status: "Inactive" },
  { id: 3, name: "Charlie", role: "Editor", status: "Active" },
]

const columns = [
  { header: "ID", accessorKey: "id" as const, sortable: true },
  { header: "Name", accessorKey: "name" as const, sortable: true },
  { header: "Role", accessorKey: "role" as const },
  { header: "Status", accessorKey: "status" as const },
]

describe("DataTable Component", () => {
  it("renders headers and initial data", () => {
    render(<DataTable columns={columns} data={mockData} />)
    
    // Check headers
    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Role")).toBeInTheDocument()
    expect(screen.getByText("Status")).toBeInTheDocument()

    // Check data
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("Charlie")).toBeInTheDocument()
  })

  it("filters data based on search input", async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={mockData} searchKey="name" searchPlaceholder="Search names..." />)
    
    const searchInput = screen.getByPlaceholderText("Search names...")
    
    // Type "Bob"
    await user.type(searchInput, "Bob")
    
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument()
  })

  it("sorts data when clicking sortable column headers", async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={mockData} />)
    
    // Click Name header to sort
    const nameHeader = screen.getByText("Name").closest("th")!
    
    await user.click(nameHeader)
    
    // Check rows after sort (ascending)
    let rows = screen.getAllByRole("row")
    // Note: row 0 is header
    expect(rows[1]).toHaveTextContent("Alice")
    
    // Click again for descending
    await user.click(nameHeader)
    
    rows = screen.getAllByRole("row")
    expect(rows[1]).toHaveTextContent("Charlie")
  })

  it("paginates data based on page size", async () => {
    // 12 items to test pagination
    const largeData = Array.from({ length: 12 }).map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: "User",
      status: "Active"
    }))
    
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={largeData} />)
    
    // Should show 10 items initially
    expect(screen.getByText("User 10")).toBeInTheDocument()
    expect(screen.queryByText("User 11")).not.toBeInTheDocument()
    
    // Click next page
    const nextBtn = screen.getByRole("button", { name: "Go to next page" })
    await user.click(nextBtn)
    
    expect(screen.queryByText("User 10")).not.toBeInTheDocument()
    expect(screen.getByText("User 11")).toBeInTheDocument()
    expect(screen.getByText("User 12")).toBeInTheDocument()
  })

  it("shows empty state when no data exists", () => {
    render(<DataTable columns={columns} data={[]} emptyStateTitle="Custom Empty" />)
    expect(screen.getByText("Custom Empty")).toBeInTheDocument()
  })
})
