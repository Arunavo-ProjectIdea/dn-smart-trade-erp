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
    <form onSubmit={onSave} className={cn("max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500", className)} {...props}>
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4 border-b border-border/50 mb-6">
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {children}
        </CardContent>

        <CardFooter className="flex items-center justify-end space-x-4 border-t border-border/50 pt-6 bg-muted/5 rounded-b-[14px]">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="shadow-sm"
          >
            {cancelText}
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="shadow-sm"
          >
            {isSubmitting ? "Saving..." : saveText}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
