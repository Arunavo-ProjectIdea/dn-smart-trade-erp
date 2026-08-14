import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Avatar, AvatarImage, AvatarFallback } from "../../src/components/ui/avatar"

describe("Avatar Component", () => {
  it("renders the fallback when image is not provided", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("renders without crashing when image is provided", () => {
    // Note: Radix AvatarImage relies on the native Image object's onload event
    // which does not fire automatically in JSDOM, so it will fallback to rendering
    // the AvatarFallback. We just test that it mounts without error.
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="@johndoe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(container).toBeInTheDocument()
  })

  it("passes custom classes to Avatar", () => {
    const { container } = render(
      <Avatar className="w-16 h-16">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(container.firstChild).toHaveClass("w-16", "h-16")
  })
})
