"use client"

import { useState } from "react"
import { PageHeader } from "@/components/erp/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTruck, faFileLines, faGear, faCircleCheck, faFilter } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils"

interface Notification {
  id: number
  icon: typeof faBell
  iconColor: string
  iconBg: string
  title: string
  description: string
  time: string
  unread: boolean
  type: "shipment" | "document" | "system" | "boe"
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    icon: faTruck,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "Shipment SHP-8472 cleared customs",
    description: "Loading port: Port of Chittagong. Status updated to Delivered.",
    time: "2 mins ago",
    unread: true,
    type: "shipment",
  },
  {
    id: 2,
    icon: faTruck,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    title: "Shipment SHP-8473 arrival delayed",
    description: "ETA updated to 2026-07-28 due to port congestion at Chattogram.",
    time: "45 mins ago",
    unread: true,
    type: "shipment",
  },
  {
    id: 3,
    icon: faFileLines,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    title: "Bill of Entry BOE-2026-002 approved",
    description: "BOE for Apex Trading Co. has been approved by customs.",
    time: "1 hour ago",
    unread: true,
    type: "boe",
  },
  {
    id: 4,
    icon: faFileLines,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    title: "New document upload from Acme Corp",
    description: "Packing List (Rev. 2) uploaded for shipment SHP-8475.",
    time: "3 hours ago",
    unread: false,
    type: "document",
  },
  {
    id: 5,
    icon: faGear,
    iconColor: "text-slate-500",
    iconBg: "bg-slate-500/10",
    title: "System maintenance scheduled",
    description: "Server maintenance window: tonight 12:00 AM – 2:00 AM (BST).",
    time: "5 hours ago",
    unread: false,
    type: "system",
  },
  {
    id: 6,
    icon: faTruck,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "Shipment SHP-8471 — BOE submission required",
    description: "Customs documentation must be submitted within 48 hours.",
    time: "1 day ago",
    unread: false,
    type: "shipment",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "shipment" | "document" | "system" | "boe">("all")

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return n.unread
    return n.type === activeFilter
  })

  const filterOptions = [
    { key: "all" as const, label: "All" },
    { key: "unread" as const, label: `Unread (${unreadCount})` },
    { key: "shipment" as const, label: "Shipments" },
    { key: "boe" as const, label: "BOE" },
    { key: "document" as const, label: "Documents" },
    { key: "system" as const, label: "System" },
  ]

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader
        title="All Notifications"
        description="View and manage all your system alerts and messages."
        action={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" aria-hidden="true" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Notification filters">
        <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
        {filterOptions.map(option => (
          <Button
            key={option.key}
            variant={activeFilter === option.key ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-7 px-3"
            onClick={() => setActiveFilter(option.key)}
            aria-pressed={activeFilter === option.key}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-3 max-w-4xl">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FontAwesomeIcon icon={faBell} className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-lg font-semibold text-foreground">No notifications</p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeFilter === "unread" ? "You have no unread notifications." : "Nothing to show in this category."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                "rounded-xl border-border/60 shadow-sm transition-all hover:shadow-md cursor-pointer group",
                n.unread && "border-primary/20 bg-primary/[0.02]"
              )}
              onClick={() => markRead(n.id)}
              role="button"
              tabIndex={0}
              aria-label={`${n.unread ? "Unread notification: " : ""}${n.title}`}
              onKeyDown={(e) => e.key === "Enter" && markRead(n.id)}
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", n.iconBg)}>
                  <FontAwesomeIcon icon={n.icon} className={cn("h-4 w-4", n.iconColor)} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className={cn("font-semibold text-sm leading-snug", n.unread ? "text-foreground" : "text-muted-foreground")}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground/70 whitespace-nowrap">{n.time}</span>
                      {n.unread && (
                        <span className="size-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
