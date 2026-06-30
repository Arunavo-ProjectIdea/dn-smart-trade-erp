import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType =
  | "Active"
  | "Inactive"
  | "Pending"
  | "Completed"
  | "In Clearance"
  | "Rejected"
  | "Approved"
  | "Archived"
  | "Pending Review"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType
}

export function StatusBadge({
  status,
  className,
  ...props
}: StatusBadgeProps) {
  const getVariantStyles = (status: StatusType) => {
    switch (status) {
      // Success (Green)
      case "Active":
      case "Completed":
      case "Approved":
        return "bg-success/10 text-success hover:bg-success/20 border-success/20"

      // Warning (Yellow)
      case "Pending":
      case "Pending Review":
      case "In Clearance":
        return "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20"

      // Danger (Red)
      case "Inactive":
      case "Rejected":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"

      // Neutral (Gray)
      case "Archived":
        return "bg-muted text-muted-foreground hover:bg-muted/80"

      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80"
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        getVariantStyles(status),
        className
      )}
      {...props}
    >
      {status}
    </Badge>
  )
}