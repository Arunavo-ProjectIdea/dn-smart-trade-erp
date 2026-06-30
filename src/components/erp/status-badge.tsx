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
  | "On Leave"
  | "Probation"
  | "In Transit"
  | "Customs Clearance"
  | "Delivered"
  | "Delayed"
  | "Cancelled"

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
      case "Delivered":
        return "bg-success/10 text-success hover:bg-success/20 border-success/20"

      // Warning (Yellow)
      case "Pending":
      case "Pending Review":
      case "In Clearance":
      case "Customs Clearance":
      case "Probation":
        return "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20"

      // Danger (Red)
      case "Inactive":
      case "Rejected":
      case "Cancelled":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"

      // Neutral (Gray)
      case "Archived":
        return "bg-muted text-muted-foreground hover:bg-muted/80"

      case "On Leave":
      case "Delayed":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-secondary-foreground/20"
      case "In Transit":
        return "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
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