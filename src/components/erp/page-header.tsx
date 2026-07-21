import * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
  badge?: React.ReactNode
}

export function PageHeader({ title, description, action, badge, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 mb-8", className)} {...props}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {badge && badge}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 items-center gap-2">
            {action}
          </div>
        )}
      </div>
      <div className="h-px bg-border/60" />
    </div>
  )
}
