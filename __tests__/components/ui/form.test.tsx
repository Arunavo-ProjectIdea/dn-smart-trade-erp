import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../../src/components/ui/form"
import { Input } from "../../../src/components/ui/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

function TestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage data-testid="form-message" />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe("Form Component", () => {
  it("renders form fields and shows validation errors", async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    // Elements should be visible
    expect(screen.getByText("Username")).toBeInTheDocument()
    expect(screen.getByText("This is your public display name.")).toBeInTheDocument()
    const input = screen.getByPlaceholderText("shadcn")
    expect(input).toBeInTheDocument()
    
    // Submit without filling
    const submitBtn = screen.getByRole("button", { name: "Submit" })
    await user.click(submitBtn)
    
    // Should show validation error
    await waitFor(() => {
      const errorMsg = screen.getByTestId("form-message")
      expect(errorMsg).toBeVisible()
      expect(errorMsg).toHaveTextContent("Username must be at least 2 characters.")
    })
    
    // Type valid input
    await user.type(input, "valid_user")
    
    // Error should disappear
    await waitFor(() => {
      expect(screen.queryByTestId("form-message")).not.toBeInTheDocument()
    })
  })
})
