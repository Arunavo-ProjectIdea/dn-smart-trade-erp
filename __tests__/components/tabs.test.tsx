import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../src/components/ui/tabs"

describe("Tabs Component", () => {
  it("renders default tab content", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    )

    expect(screen.getByText("Make changes to your account here.")).toBeInTheDocument()
    expect(screen.queryByText("Change your password here.")).not.toBeInTheDocument()
  })

  it("switches tabs when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    )

    await user.click(screen.getByRole("tab", { name: "Password" }))
    expect(screen.queryByText("Make changes to your account here.")).not.toBeInTheDocument()
    expect(screen.getByText("Change your password here.")).toBeInTheDocument()
  })
})
