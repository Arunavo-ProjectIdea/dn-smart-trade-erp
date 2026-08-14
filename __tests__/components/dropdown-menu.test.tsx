import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../src/components/ui/dropdown-menu"

describe("DropdownMenu Component", () => {
  it("displays items when open", () => {
    render(
      <DropdownMenu defaultOpen={true}>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByRole("menu")).toBeInTheDocument()
    expect(screen.getByText("My Account")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })
})
