"use client"

import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@/components/erp/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBell,
  faTruck,
  faFileLines,
  faGear,
  faCircleCheck,
  faFilter,
  faTrash,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type NotificationFilter,
} from "@/actions/notifications.actions"
import { mapNotificationToUI, NotificationUI } from "@/lib/mappers/notification.mapper"
import { useRouter } from "next/navigation"

type FilterKey = "all" | "unread" | "shipment" | "boe" | "document" | "system"

const TYPE_META: Record<string, { icon: typeof faBell; iconColor: string; iconBg: string }> = {
  shipment: { icon: faTruck, iconColor: "text-blue-500", iconBg: "bg-blue-500/10" },
  boe: { icon: faFileInvoice, iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10" },
  document: { icon: faFileLines, iconColor: "text-violet-500", iconBg: "bg-violet-500/10" },
  system: { icon: faGear, iconColor: "text-slate-500", iconBg: "bg-slate-500/10" },
}

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
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

function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-3 max-w-4xl">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="rounded-xl border-border/60">
          <CardContent className="flex items-start gap-4 p-5">
            <Skeleton className="size-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState({ filter }: { filter: FilterKey }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
      <div className="rounded-2xl bg-muted/60 p-6 mb-6 ring-1 ring-border/40">
        <FontAwesomeIcon icon={faBell} className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
      </div>
      <p className="text-xl font-semibold text-foreground">All caught up!</p>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        {filter === "unread"
          ? "You have no unread notifications right now."
          : filter !== "all"
          ? `No ${filter} notifications yet.`
          : "When shipments update, BOEs are approved, or documents are uploaded, your notifications will appear here."}
      </p>
    </div>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationUI[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async (filter: FilterKey) => {
    setIsLoading(true)
    const f: NotificationFilter = {}
    if (filter === "unread") f.type = "unread"
    else if (filter !== "all") f.type = filter as NotificationFilter["type"]

    const res = await getNotifications(f)
    if (res.success && res.data) {
      setNotifications(res.data.map(mapNotificationToUI))
    } else {
      toast.error(res.error ?? "Failed to load notifications")
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(activeFilter)
  }, [activeFilter, load])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkReadAndNavigate = async (id: string, href: string) => {
    const n = notifications.find((x) => x.id === id)
    if (n && !n.isRead) {
      setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, isRead: true } : x)))
      const res = await markNotificationRead(id)
      if (!res.success) {
        setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, isRead: false } : x)))
        toast.error(res.error ?? "Failed to mark as read")
      }
    }
    
    if (href && href !== "#") {
      router.push(href)
    }
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })))
    const res = await markAllNotificationsRead()
    if (!res.success) {
      toast.error(res.error ?? "Failed to mark all as read")
      load(activeFilter)
    } else {
      toast.success("All notifications marked as read")
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    const res = await deleteNotification(id)
    if (res.success) {
      setNotifications((prev) => prev.filter((x) => x.id !== id))
    } else {
      toast.error(res.error ?? "Failed to delete notification")
    }
    setDeletingId(null)
  }

  const filterOptions: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
    { key: "shipment", label: "Shipments" },
    { key: "boe", label: "BOE" },
    { key: "document", label: "Documents" },
    { key: "system", label: "System" },
  ]

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader
        title="All Notifications"
        description="View and manage all your system alerts and messages."
        action={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" aria-hidden="true" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Notification filters">
        <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
        {filterOptions.map((option) => (
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

      {/* List */}
      {isLoading ? (
        <NotificationSkeleton />
      ) : notifications.length === 0 ? (
        <EmptyState filter={activeFilter} />
      ) : (
        <div className="flex flex-col gap-3 max-w-4xl">
          {notifications.map((n) => {
            const meta = TYPE_META[n.type] ?? TYPE_META.system
            return (
              <Card
                key={n.id}
                className={cn(
                  "rounded-xl border-border/60 shadow-sm transition-all hover:shadow-md cursor-pointer group",
                  !n.isRead && "border-primary/20 bg-primary/[0.02]"
                )}
                onClick={() => handleMarkReadAndNavigate(n.id, n.href)}
                role="button"
                tabIndex={0}
                aria-label={`${!n.isRead ? "Unread notification: " : ""}${n.title}`}
                onKeyDown={(e) => e.key === "Enter" && handleMarkReadAndNavigate(n.id, n.href)}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.iconBg)}>
                    <FontAwesomeIcon icon={meta.icon} className={cn("h-4 w-4", meta.iconColor)} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn("font-semibold text-sm leading-snug", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                          {n.title}
                        </p>
                        {n.priority !== "medium" && (
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize", PRIORITY_BADGE[n.priority])}>
                            {n.priority}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground/70 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                        {!n.isRead && <span className="size-2 rounded-full bg-primary shrink-0" aria-label="Unread" />}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={(e) => handleDelete(e, n.id)}
                          disabled={deletingId === n.id}
                          aria-label="Delete notification"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
