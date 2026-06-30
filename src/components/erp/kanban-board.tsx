import React from "react"
import { Shipment } from "@/lib/mock-data/shipments"
import { StatusType } from "@/components/erp/status-badge"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"

interface KanbanBoardProps {
  shipments: Shipment[]
}

const statusConfig: Record<string, { colorClass: string, bgClass: string, borderClass: string, badgeClass: string, pulse: boolean }> = {
  "Pending": {
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted",
    borderClass: "border-border/50",
    badgeClass: "bg-muted text-muted-foreground",
    pulse: false
  },
  "In Transit": {
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-500/30",
    badgeClass: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    pulse: true
  },
  "Customs Clearance": {
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500",
    borderClass: "border-orange-500/30",
    badgeClass: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    pulse: true
  },
  "Delivered": {
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500/30",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    pulse: false
  },
  "Completed": {
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500/30",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    pulse: false
  },
  "Delayed": {
    colorClass: "text-destructive",
    bgClass: "bg-destructive",
    borderClass: "border-destructive/30",
    badgeClass: "bg-destructive/10 text-destructive border border-destructive/20",
    pulse: true
  },
  "Cancelled": {
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted",
    borderClass: "border-border/50",
    badgeClass: "bg-muted text-muted-foreground",
    pulse: false
  }
}

export function KanbanBoard({ shipments }: KanbanBoardProps) {
  // We define the column order here
  const columns: StatusType[] = ["Pending", "In Transit", "Customs Clearance", "Delivered", "Completed"]

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar -mx-4 px-4 sm:-mx-8 sm:px-8">
      <div className="flex gap-6 h-[calc(100vh-220px)] min-w-max pb-4 items-start">
        {columns.map(status => {
          const columnShipments = shipments.filter(s => s.status === status)
          const config = statusConfig[status]

          return (
            <KanbanColumn 
              key={status}
              title={status}
              count={columnShipments.length}
              colorClass={config.colorClass}
              bgClass={config.bgClass}
              borderClass={config.borderClass}
              badgeClass={config.badgeClass}
              pulse={config.pulse}
            >
              {columnShipments.map(shipment => (
                <KanbanCard 
                  key={shipment.id} 
                  shipment={shipment} 
                  colorClass={config.bgClass}
                />
              ))}
            </KanbanColumn>
          )
        })}
      </div>
    </div>
  )
}
