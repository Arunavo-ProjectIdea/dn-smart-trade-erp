import React from "react"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  count: number
  colorClass?: string
  bgClass?: string
  borderClass?: string
  badgeClass?: string
  pulse?: boolean
  children?: React.ReactNode
}

export function KanbanColumn({ 
  title, 
  count, 
  colorClass = "text-muted-foreground", 
  bgClass = "bg-muted",
  borderClass = "border-border/50",
  badgeClass = "bg-muted text-muted-foreground",
  pulse = false, 
  children 
}: KanbanColumnProps) {
  return (
    <div className="w-[320px] flex flex-col gap-4 flex-shrink-0 h-full max-h-full">
      <div className="flex items-center justify-between px-2">
        <h3 className={cn("text-sm uppercase tracking-wider font-semibold", colorClass)}>
          {title}
        </h3>
        
        <div className="flex items-center gap-2">
          {pulse && (
            <span className="relative flex h-2 w-2">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", bgClass)}></span>
              <span className={cn("relative inline-flex rounded-full h-2 w-2", bgClass)}></span>
            </span>
          )}
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-mono font-medium", badgeClass)}>
            {count}
          </span>
        </div>
      </div>
      
      <div className={cn(
        "bg-surface/40 backdrop-blur-md border rounded-xl p-3 flex-1 overflow-y-auto flex flex-col gap-3 relative",
        borderClass,
        "custom-scrollbar" // ensure custom-scrollbar is defined in global CSS or use standard Tailwind scrollbar hiding
      )}>
        {/* Subtle highlight for active/pulse column */}
        {pulse && (
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-xl"></div>
        )}
        
        {children}
        
        {/* Empty Drop Zone visually */}
        {count === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 border-2 border-dashed border-border/50 rounded-lg p-6 mt-2">
            <p className="text-sm font-medium text-muted-foreground">Drop shipments here</p>
          </div>
        )}
      </div>
    </div>
  )
}
