import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { PageTransition } from "../../../src/components/layout/page-transition"

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/test-path"),
}))

describe("PageTransition Component", () => {
  it("renders children wrapped in motion div", () => {
    render(
      <PageTransition>
        <p>Transition Content</p>
      </PageTransition>
    )
    expect(screen.getByText("Transition Content")).toBeInTheDocument()
    const motionDiv = screen.getByTestId("motion-div")
    expect(motionDiv).toBeInTheDocument()
  })
})
