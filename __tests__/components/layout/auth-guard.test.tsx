import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthGuard } from "../../../src/components/layout/auth-guard"
import { useRouter, usePathname } from "next/navigation"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}))

describe("AuthGuard Component", () => {
  const mockPush = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
  })

  it("redirects to /change-password if forcePasswordChange is true and not on that page", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard")
    render(
      <AuthGuard role="Admin" forcePasswordChange={true}>
        <div>Protected Content</div>
      </AuthGuard>
    )
    expect(mockPush).toHaveBeenCalledWith("/change-password")
    // Should render loading spinner instead of content
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("renders content if forcePasswordChange is true but already on /change-password", () => {
    vi.mocked(usePathname).mockReturnValue("/change-password")
    render(
      <AuthGuard role="Admin" forcePasswordChange={true}>
        <div>Change Password Form</div>
      </AuthGuard>
    )
    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByText("Change Password Form")).toBeInTheDocument()
  })

  it("redirects Client from Admin-only pages", () => {
    vi.mocked(usePathname).mockReturnValue("/employees")
    render(
      <AuthGuard role="Client">
        <div>Employees List</div>
      </AuthGuard>
    )
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
  })

  it("redirects Client from Internal-only pages", () => {
    vi.mocked(usePathname).mockReturnValue("/reports")
    render(
      <AuthGuard role="Client">
        <div>Reports</div>
      </AuthGuard>
    )
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
  })

  it("redirects Client from create/edit routes", () => {
    vi.mocked(usePathname).mockReturnValue("/shipments/create")
    render(
      <AuthGuard role="Client">
        <div>Create Shipment</div>
      </AuthGuard>
    )
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
  })

  it("redirects Employee from Admin-only pages", () => {
    vi.mocked(usePathname).mockReturnValue("/settings")
    render(
      <AuthGuard role="Employee">
        <div>Settings</div>
      </AuthGuard>
    )
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
  })

  it("allows Employee to access Internal pages", () => {
    vi.mocked(usePathname).mockReturnValue("/reports")
    render(
      <AuthGuard role="Employee">
        <div>Reports Content</div>
      </AuthGuard>
    )
    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByText("Reports Content")).toBeInTheDocument()
  })

  it("allows Admin to access any page", () => {
    vi.mocked(usePathname).mockReturnValue("/settings")
    render(
      <AuthGuard role="Admin">
        <div>Admin Settings</div>
      </AuthGuard>
    )
    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByText("Admin Settings")).toBeInTheDocument()
  })
})
