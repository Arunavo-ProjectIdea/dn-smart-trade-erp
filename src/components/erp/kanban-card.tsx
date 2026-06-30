import React from "react"
import Link from "next/link"
import { GripVertical, Bot, AlertTriangle } from "lucide-react"
import { Shipment } from "@/lib/mock-data/shipments"

interface KanbanCardProps {
  shipment: Shipment
  colorClass?: string
}

export function KanbanCard({ shipment, colorClass = "bg-primary" }: KanbanCardProps) {
  // Extract initials for the avatar
  const initials = shipment.clientName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const formattedValue = shipment.declaredValue 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(shipment.declaredValue)
    : "N/A"

  return (
    <Link href={`/shipments/${shipment.id}`} className="block group">
      <div className={`bg-surface border ${shipment.isUrgent ? 'border-destructive/40 shadow-[0_4px_12px_rgba(255,0,0,0.05)]' : 'border-border/50 shadow-sm'} rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all duration-200 relative overflow-hidden hover:shadow-md h-full flex flex-col`}>
        {/* Top colored line indicator */}
        <div className={`absolute top-0 left-0 w-full h-1 ${shipment.isUrgent ? 'bg-destructive' : colorClass}`}></div>
        
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-medium text-foreground font-mono">{shipment.id}</span>
          
          <div className="flex items-center gap-2">
            {shipment.isUrgent && (
              <span className="bg-destructive/10 text-destructive text-[10px] px-2 py-0.5 rounded font-semibold border border-destructive/30 uppercase tracking-wider">
                Urgent
              </span>
            )}
            {!shipment.isUrgent && shipment.actionRequired && (
              <span className="bg-destructive/20 text-destructive text-[10px] px-2 py-0.5 rounded font-semibold border border-destructive/20 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Action Required
              </span>
            )}
            {!shipment.isUrgent && !shipment.actionRequired && shipment.hasAiDraft && (
              <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-semibold border border-primary/20 flex items-center gap-1">
                <Bot className="w-3 h-3" /> AI Drafted
              </span>
            )}
            
            {/* Drag handle icon - hidden until hover */}
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">{shipment.clientName}</h4>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{shipment.cargoDescription}</p>

        {/* Optional Progress Bar */}
        {shipment.progress !== undefined && shipment.progress > 0 && (
          <div className="mb-4 mt-auto">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Status Progress</span>
              <span className={colorClass.replace('bg-', 'text-')}>{shipment.progress}%</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full relative overflow-hidden ${colorClass}`}
                style={{ width: `${shipment.progress}%` }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[translateX_2s_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-end mt-auto pt-2">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Declared Value</p>
            <p className="text-sm font-semibold text-foreground/80">{formattedValue}</p>
          </div>
          
          {/* Avatar circles */}
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border-2 border-background z-20">
              <span className="text-[8px] font-bold text-foreground">{initials}</span>
            </div>
            {shipment.isUrgent && (
               <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border-2 border-background z-10">
                <span className="text-[8px] font-bold text-primary">AI</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
