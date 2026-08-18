import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { ThemeToggle } from "../../../src/components/layout/theme-toggle"
import { useTheme } from "next-themes"

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}))

describe("ThemeToggle Component", () => {
  it("renders correctly and allows theme switching", async () => {
    const setThemeMock = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ setTheme: setThemeMock, theme: "light" } as any)
    
    const user = userEvent.setup()
    
    render(<ThemeToggle />)
    
    const trigger = screen.getByRole("button", { name: "Toggle theme" })
    expect(trigger).toBeInTheDocument()
    
    // Click button
    await user.click(trigger)
    
    // Since theme was "light", clicking should set it to "dark"
    expect(setThemeMock).toHaveBeenCalledWith("dark")
  })
})
