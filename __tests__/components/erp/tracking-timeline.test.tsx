import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { TrackingTimeline } from "../../../src/components/erp/tracking-timeline"

describe("TrackingTimeline Component", () => {
  it("renders empty state when no events are provided", () => {
    render(<TrackingTimeline events={[]} />)
    expect(screen.getByText("No tracking data")).toBeInTheDocument()
    expect(screen.getByText("Tracking information has not been updated for this shipment yet.")).toBeInTheDocument()
  })

  it("renders events in reverse chronological order (newest first)", () => {
    const mockEvents = [
      {
        id: "1",
        date: "2026-08-01",
        time: "10:00 AM",
        status: "Pending",
        location: "Warehouse A",
        responsibleEmployee: "John Doe",
      },
      {
        id: "2",
        date: "2026-08-02",
        time: "11:00 AM",
        status: "In Transit",
        location: "Port B",
        responsibleEmployee: "Jane Smith",
      },
    ]

    const { container } = render(<TrackingTimeline events={mockEvents} />)
    
    // Find all status headings
    const headings = screen.getAllByRole("heading")
    expect(headings[0]).toHaveTextContent("In Transit")
    expect(headings[1]).toHaveTextContent("Pending")
  })

  it("renders optional notes correctly", () => {
    const mockEvents = [
      {
        id: "1",
        date: "2026-08-01",
        time: "10:00 AM",
        status: "Pending",
        location: "Warehouse A",
        responsibleEmployee: "John Doe",
        notes: "Awaiting customs clearance documentation.",
      },
    ]

    render(<TrackingTimeline events={mockEvents} />)
    expect(screen.getByText("Awaiting customs clearance documentation.")).toBeInTheDocument()
  })
})
