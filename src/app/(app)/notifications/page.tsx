"use client"

import { useState } from "react"
import { PageHeader } from "@/components/erp/page-header"
import { mockNotifications, NotificationItem } from "@/lib/mock-data/notifications"
import { NotificationCard } from "@/components/notifications/notification-card"
import { NotificationFilters } from "@/components/notifications/notification-filters"
import { EmptyState } from "@/components/erp/empty-state"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, ShieldAlert, Activity, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [unreadOnly, setUnreadOnly] = useState(false)

  // Actions
  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast({ title: "Notification Removed", description: "Selected alert has been deleted." })
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({ title: "All Marked as Read", description: "All notifications are now marked as read." })
  }

  const handleClearAll = () => {
    setNotifications([])
    toast({ title: "Notifications Cleared", description: "All notification alerts removed." })
  }

  // Filter Logic
  const filteredNotifications = notifications.filter((n) => {
    // 1. Search Query
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())

    // 2. Category
    const matchesCategory = selectedCategory === "All" || n.category === selectedCategory

    // 3. Priority
    const matchesPriority = selectedPriority === "All" || n.priority === selectedPriority

    // 4. Unread Only
    const matchesUnread = !unreadOnly || !n.read

    return matchesSearch && matchesCategory && matchesPriority && matchesUnread
  })

  // Metrics
  const unreadCount = notifications.filter((n) => !n.read).length
  const highPriorityCount = notifications.filter((n) => n.priority === "High").length
  const totalCount = notifications.length

  // Time Groups
  const timeGroups: NotificationItem["timeGroup"][] = ["Today", "Yesterday", "Earlier This Week"]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <PageHeader
        title="All Notifications & System Alerts"
        description="Monitor system events, clearance updates, Customs BOE alerts, and financial transaction notices."
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Notifications</span>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bell className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">{totalCount}</div>
          <span className="text-[11px] font-medium text-muted-foreground">Active in system</span>
        </Card>

        <Card className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Unread Alerts</span>
            <div className="size-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Activity className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">{unreadCount}</div>
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 font-semibold">
            {unreadCount > 0 ? "Requires action" : "All caught up"}
          </span>
        </Card>

        <Card className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">High Priority Alerts</span>
            <div className="size-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldAlert className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground">{highPriorityCount}</div>
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 font-semibold">
            Customs & inspection warnings
          </span>
        </Card>
      </div>

      {/* Filter Control Center */}
      <NotificationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        unreadOnly={unreadOnly}
        setUnreadOnly={setUnreadOnly}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        unreadCount={unreadCount}
        totalCount={filteredNotifications.length}
      />

      {/* Timeline Stream View */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-border/60 before:hidden sm:before:block">
          {timeGroups.map((group) => {
            const groupItems = filteredNotifications.filter((n) => n.timeGroup === group)
            if (groupItems.length === 0) return null

            return (
              <div key={group} className="space-y-4 relative">
                {/* Timeframe Group Header Node */}
                <div className="flex items-center gap-2.5 sm:ml-1">
                  <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs z-10">
                    <Clock className="size-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    {group}
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    ({groupItems.length} alerts)
                  </span>
                </div>

                {/* Notification Items List */}
                <div className="space-y-3 sm:ml-8">
                  {groupItems.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onToggleRead={handleToggleRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-8 border border-border/80 rounded-2xl text-center bg-card">
          <EmptyState
            icon={BellOff}
            title="No Notifications Found"
            description={
              searchQuery || selectedCategory !== "All" || selectedPriority !== "All" || unreadOnly
                ? "No alerts match your current filter parameters. Try clearing or broadening your search criteria."
                : "You have zero active system notifications right now. Everything is up to date!"
            }
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedPriority("All")
                  setUnreadOnly(false)
                }}
                className="rounded-xl border-border/80 text-xs font-semibold mt-2"
              >
                Reset Filters
              </Button>
            }
          />
        </Card>
      )}
    </div>
  )
}
