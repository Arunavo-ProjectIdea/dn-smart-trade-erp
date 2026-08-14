import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../src/components/ui/accordion"

describe("Accordion Component", () => {
  let user: any;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders accordion and toggles content", async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger data-testid="trigger">Is it accessible?</AccordionTrigger>
          <AccordionContent data-testid="content">
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const trigger = screen.getByTestId("trigger")
    expect(trigger).toBeInTheDocument()
    
    const content = screen.getByTestId("content")
    // Content is initially hidden
    expect(content).not.toBeVisible()

    // Click to open
    await user.click(trigger)

    expect(content).toBeVisible()
    expect(screen.getByText("Yes. It adheres to the WAI-ARIA design pattern.")).toBeVisible()
    
    // Click to close
    await user.click(trigger)
    
    await waitFor(() => {
      expect(content).not.toBeVisible()
    })
  })
})
