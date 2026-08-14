"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { updateUserPasswordAndClearForceChange } from "@/actions/auth.actions"

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

export default function ChangePasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const res = await updateUserPasswordAndClearForceChange(values.password)
    setIsSubmitting(false)

    if (res.success) {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      })
      window.location.assign("/dashboard") // Force full reload to update context
    } else {
      toast({
        title: "Error",
        description: res.error || "Failed to update password. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full bg-background px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-border/50">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <FontAwesomeIcon icon={faLock} className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Security Required</CardTitle>
            <CardDescription className="text-base mt-2">
              For your security, please change your temporary password before accessing the system.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="pr-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 text-base mt-6" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Password & Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
