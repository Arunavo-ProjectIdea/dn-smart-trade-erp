import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconDefinition
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ 
  icon = faFolderOpen, 
  title, 
  description, 
  action, 
  className,
  ...props 
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 p-8 text-center animate-in fade-in-50 zoom-in-95 duration-500",
        className
      )}
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-6 shadow-sm border border-primary/10 transition-transform hover:scale-105 duration-300">
        <FontAwesomeIcon icon={icon} className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-foreground tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2 transition-transform hover:-translate-y-0.5 duration-300">
          {action}
        </div>
      )}
    </div>
  )
}
