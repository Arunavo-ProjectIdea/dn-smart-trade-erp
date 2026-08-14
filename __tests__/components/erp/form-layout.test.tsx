import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { FormLayout } from "../../../src/components/erp/form-layout"

describe("FormLayout Component", () => {
  it("renders with title, description, and children", () => {
    render(
      <FormLayout title="Test Title" description="Test Description" onSave={vi.fn()} onCancel={vi.fn()}>
        <div data-testid="child-element">Child Content</div>
      </FormLayout>
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
    expect(screen.getByTestId("child-element")).toBeInTheDocument()
    expect(screen.getByText("Child Content")).toBeInTheDocument()
  })

  it("handles cancel click", async () => {
    const user = userEvent.setup()
    const onCancelMock = vi.fn()
    
    render(
      <FormLayout title="Test" onSave={vi.fn()} onCancel={onCancelMock}>
        <div />
      </FormLayout>
    )

    const cancelBtn = screen.getByRole("button", { name: "Cancel" })
    await user.click(cancelBtn)
    
    expect(onCancelMock).toHaveBeenCalled()
  })

  it("handles form submission", async () => {
    const user = userEvent.setup()
    const onSaveMock = vi.fn(e => e.preventDefault()) // prevent default form submission reload in jsdom
    
    render(
      <FormLayout title="Test" onSave={onSaveMock} onCancel={vi.fn()}>
        <div />
      </FormLayout>
    )

    const saveBtn = screen.getByRole("button", { name: "Save changes" })
    await user.click(saveBtn)
    
    expect(onSaveMock).toHaveBeenCalled()
  })

  it("disables buttons and changes save text when isSubmitting is true", () => {
    render(
      <FormLayout title="Test" isSubmitting={true} onSave={vi.fn()} onCancel={vi.fn()}>
        <div />
      </FormLayout>
    )

    const cancelBtn = screen.getByRole("button", { name: "Cancel" })
    const saveBtn = screen.getByRole("button", { name: "Saving..." })

    expect(cancelBtn).toBeDisabled()
    expect(saveBtn).toBeDisabled()
  })
})
