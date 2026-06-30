import * as React from "react"
import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TimelineStep {
  label: string
  description?: string
  date?: string
  status: "completed" | "current" | "pending" | "error"
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[]
}

export function Timeline({ steps, className, ...props }: TimelineProps) {
  return (
    <div className={cn("flex flex-col space-y-4", className)} {...props}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        
        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  step.status === "completed" && "bg-primary border-primary text-primary-foreground",
                  step.status === "current" && "border-primary text-primary bg-background ring-4 ring-primary/20",
                  step.status === "pending" && "border-muted bg-background text-muted-foreground",
                  step.status === "error" && "border-destructive text-destructive bg-background ring-4 ring-destructive/20",
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-4 w-4 font-bold" />
                ) : (
                  <Circle className={cn("h-3 w-3 fill-current", step.status === "pending" && "opacity-0")} />
                )}
              </div>
              {!isLast && (
                <div 
                  className={cn(
                    "w-px h-full my-1",
                    step.status === "completed" ? "bg-primary" : "bg-border"
                  )} 
                />
              )}
            </div>
            
            <div className="flex flex-col pb-6 pt-1">
              <span 
                className={cn(
                  "text-sm font-semibold",
                  step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.label}
              </span>
              
              {(step.description || step.date) && (
                <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                  {step.date && <span className="font-medium text-foreground/70">{step.date}</span>}
                  {step.description && <span>{step.description}</span>}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
