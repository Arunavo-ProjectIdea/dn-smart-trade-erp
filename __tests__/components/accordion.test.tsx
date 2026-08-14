import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../src/components/ui/accordion"

describe("Accordion Component", () => {
  it("renders closed by default", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    const trigger = screen.getByRole("button", { name: "Is it accessible?" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Yes. It adheres to the WAI-ARIA design pattern.")).not.toBeInTheDocument()
  })

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    const trigger = screen.getByRole("button", { name: "Is it accessible?" })
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Yes. It adheres to the WAI-ARIA design pattern.")).toBeInTheDocument()
  })

  it("allows multiple items to be open when type is multiple", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    await user.click(screen.getByText("Item 1"))
    await user.click(screen.getByText("Item 2"))
    
    expect(screen.getByText("Content 1")).toBeInTheDocument()
    expect(screen.getByText("Content 2")).toBeInTheDocument()
  })
})
