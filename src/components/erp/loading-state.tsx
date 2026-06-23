import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "table" | "card" | "list"
  count?: number
}

export function LoadingState({ variant = "table", count = 5, className, ...props }: LoadingStateProps) {
  if (variant === "card") {
    return (
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default: Table
  return (
    <div className={cn("space-y-4 w-full", className)} {...props}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="border rounded-md p-4 space-y-4">
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}
