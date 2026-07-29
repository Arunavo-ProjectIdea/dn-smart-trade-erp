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

const statusConfig: Record<StatusType, { styles: string; dot: string }> = {
  "Active":            { styles: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
  "Completed":         { styles: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
  "Delivered":         { styles: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
  "Approved":          { styles: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
  "Pending":           { styles: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
  "In Clearance":      { styles: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
  "Customs Clearance": { styles: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
  "In Transit":        { styles: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
  "Submitted":         { styles: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
  "Under Review":      { styles: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20", dot: "bg-violet-500" },
  "Pending Review":    { styles: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20", dot: "bg-violet-500" },
  "Draft":             { styles: "bg-muted text-muted-foreground border-muted-foreground/20", dot: "bg-muted-foreground" },
  "Inactive":          { styles: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500" },
  "Rejected":          { styles: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500" },
  "Delayed":           { styles: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500" },
  "Archived":          { styles: "bg-muted text-muted-foreground border-muted-foreground/20", dot: "bg-muted-foreground" },
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { styles: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" }
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-[11px] px-2 py-0.5 rounded-full",
        config.styles,
        className
      )} 
      {...props}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", config.dot)} />
      {status}
    </Badge>
  )
}
