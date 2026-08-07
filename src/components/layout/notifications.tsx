"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBell,
  faTruck,
  faFileLines,
  faGear,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationRow,
} from "@/actions/notifications.actions"

const TYPE_META: Record<string, { icon: typeof faBell; iconColor: string; iconBg: string }> = {
  shipment: { icon: faTruck, iconColor: "text-blue-500", iconBg: "bg-blue-500/10" },
  boe: { icon: faFileInvoice, iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10" },
  document: { icon: faFileLines, iconColor: "text-violet-500", iconBg: "bg-violet-500/10" },
  system: { icon: faGear, iconColor: "text-slate-500", iconBg: "bg-slate-500/10" },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString("en-BD", { day: "numeric", month: "short" })
}

export function Notifications() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotifications = async () => {
    setIsLoading(true)
    const res = await getNotifications()
    if (res.success && res.data) {
      setNotifications(res.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return
    setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, is_read: true } : x)))
    await markNotificationRead(id)
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })))
    await markAllNotificationsRead()
  }

  // Display top 4 recent notifications in header dropdown
  const recentNotifications = notifications.slice(0, 4)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative cursor-pointer" })}>
        <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        )}
        <span className="sr-only">Toggle notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground mt-0.5">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline font-medium focus:outline-none">
                Mark all read
              </button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isLoading ? (
            <div className="p-4 text-center text-xs text-muted-foreground">Loading alerts...</div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">No notifications right now</div>
          ) : (
            recentNotifications.map((n) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.system
              return (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id, n.is_read)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer",
                    !n.is_read && "bg-primary/[0.03]"
                  )}
                >
                  <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", meta.iconBg)}>
                    <FontAwesomeIcon icon={meta.icon} className={cn("h-3.5 w-3.5", meta.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-xs font-semibold leading-snug", !n.is_read ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </p>
                      {!n.is_read && <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.description}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              )
            })
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          href="/notifications"
          className="flex w-full items-center justify-center px-4 py-2.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
