"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faTruck, faFileLines, faGear, faFileInvoice } from "@fortawesome/free-solid-svg-icons"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/actions/notifications.actions"
import { mapNotificationToUI, NotificationUI } from "@/lib/mappers/notification.mapper"
import { createClient } from "@/lib/supabase/client"

const TYPE_META: Record<string, { icon: any; iconColor: string; iconBg: string }> = {
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
  const router = useRouter()
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<NotificationUI[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.isRead).length

  const fetchNotifications = useCallback(async () => {
    const res = await getNotifications({ type: "all" })
    if (res.success && res.data) {
      const mapped = res.data.map(mapNotificationToUI)
      setNotifications(mapped.slice(0, 10))
    }
  }, [])

  useEffect(() => {
    fetchNotifications()

    const supabase = createClient()
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    // Fallback polling every 10 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 10000)

    // Refresh on window focus
    const handleFocus = () => fetchNotifications()
    window.addEventListener("focus", handleFocus)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [pathname, fetchNotifications])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchNotifications()
    }
  }

  const handleMarkAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    await markAllNotificationsRead()
  }

  const handleMarkAsRead = async (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    await markNotificationRead(id)
  }

  const handleNotificationClick = async (id: string, href: string) => {
    await handleMarkAsRead(id)
    if (href && href !== "#") {
      router.push(href)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
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
        <DropdownMenuGroup className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications available
            </div>
          ) : (
            notifications.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.system
              return (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => {
                    setIsOpen(false)
                    handleNotificationClick(n.id, n.href)
                  }}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer",
                    !n.isRead && "bg-primary/5"
                  )}
                >
                  <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", meta.iconBg)}>
                    <FontAwesomeIcon icon={meta.icon} className={cn("h-3.5 w-3.5", meta.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-xs font-semibold leading-snug", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </p>
                      {!n.isRead && <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </DropdownMenuItem>
              )
            })
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          href="/notifications"
          onClick={() => setIsOpen(false)}
          className="flex w-full items-center justify-center px-4 py-2.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
