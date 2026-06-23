import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormLayoutProps extends React.HTMLAttributes<HTMLFormElement> {
  title: string
  description?: string
  onSave: (e: React.FormEvent) => void
  onCancel: () => void
  isSubmitting?: boolean
  saveText?: string
  cancelText?: string
}

export function FormLayout({
  title,
  description,
  onSave,
  onCancel,
  isSubmitting = false,
  saveText = "Save changes",
  cancelText = "Cancel",
  className,
  children,
  ...props
}: FormLayoutProps) {
  return (
    <form onSubmit={onSave} className={cn("max-w-4xl mx-auto space-y-8", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {children}
        </CardContent>

        <CardFooter className="flex items-center justify-end space-x-4 border-t pt-6 bg-muted/20">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : saveText}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
