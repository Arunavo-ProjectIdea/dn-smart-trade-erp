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
  | "In Transit"
  | "Customs Clearance"
  | "Delivered"
  | "Delayed"
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Pending Review"
  | "Approved"
  | "Archived"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const getVariantStyles = (status: StatusType) => {
    switch (status) {
      case "Active":
      case "Completed":
      case "Delivered":
      case "Approved":
        return "bg-success/10 text-success hover:bg-success/20 border-success/20"
      case "Pending":
      case "In Clearance":
      case "Customs Clearance":
      case "In Transit":
      case "Submitted":
      case "Under Review":
      case "Pending Review":
        return "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20"
      case "Inactive":
      case "Rejected":
      case "Delayed":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
      case "Archived":
        return "bg-muted text-muted-foreground hover:bg-muted/80 border-muted-foreground/20"
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80"
    }
  }

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", getVariantStyles(status), className)} 
      {...props}
    >
      {status}
    </Badge>
  )
}
