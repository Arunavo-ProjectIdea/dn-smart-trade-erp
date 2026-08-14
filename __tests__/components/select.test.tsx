import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../src/components/ui/select"

describe("Select Component", () => {
  it("opens when trigger is clicked and displays items", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger aria-label="Food">
          <SelectValue placeholder="Select a food" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    // Radix select content renders inside a portal, accessible via listbox
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    expect(screen.getByText("Apple")).toBeInTheDocument()
    expect(screen.getByText("Banana")).toBeInTheDocument()
  })
})
