import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../src/components/ui/tabs"

describe("Tabs Component", () => {
  let user: any;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders tabs and toggles content", async () => {
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account" data-testid="trigger-account">Account</TabsTrigger>
          <TabsTrigger value="password" data-testid="trigger-password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" data-testid="content-account">
          Account details
        </TabsContent>
        <TabsContent value="password" data-testid="content-password">
          Password settings
        </TabsContent>
      </Tabs>
    )

    const triggerAccount = screen.getByTestId("trigger-account")
    const triggerPassword = screen.getByTestId("trigger-password")
    
    expect(triggerAccount).toBeInTheDocument()
    expect(triggerPassword).toBeInTheDocument()
    
    // Account content is visible initially
    expect(screen.getByTestId("content-account")).toBeVisible()
    expect(screen.queryByTestId("content-password")).not.toBeInTheDocument()

    // Click password tab
    await user.click(triggerPassword)

    await waitFor(() => {
      expect(screen.queryByTestId("content-account")).not.toBeInTheDocument()
    })
    expect(screen.getByTestId("content-password")).toBeVisible()
  })
})
