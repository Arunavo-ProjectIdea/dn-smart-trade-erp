"use client"

import { NotificationItem } from "@/lib/mock-data/notifications"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Check, 
  ArrowUpRight,
  Clock
} from "lucide-react"
import Link from "next/link"

interface NotificationCardProps {
  notification: NotificationItem
  onToggleRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationCard({ notification, onToggleRead, onDelete }: NotificationCardProps) {
  // Category Icons & Badges
  const categoryConfig: Record<string, { icon: typeof Package; style: string }> = {
    "Shipments": { icon: Package, style: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
    "BOE Filings": { icon: FileText, style: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
    "Financial": { icon: DollarSign, style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    "Compliance": { icon: ShieldCheck, style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    "System": { icon: Bell, style: "bg-muted text-muted-foreground border-border/60" },
  }

  // Priority Indicators
  const priorityConfig: Record<string, { label: string; style: string; icon: typeof CheckCircle2 }> = {
    "High": { label: "High Priority", style: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", icon: AlertCircle },
    "Medium": { label: "Medium", style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: AlertTriangle },
    "Low": { label: "Info", style: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20", icon: Info },
    "Success": { label: "Resolved", style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  }

  const category = categoryConfig[notification.category] || categoryConfig["System"]
  const priority = priorityConfig[notification.priority] || priorityConfig["Low"]
  const CategoryIcon = category.icon
  const PriorityIcon = priority.icon

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 rounded-2xl border ${
        !notification.read
          ? "border-primary/40 bg-card shadow-xs hover:border-primary/60 hover:shadow-md"
          : "border-border/80 bg-card/60 hover:bg-card hover:border-border/90"
      }`}
    >
      {/* Unread Accent Dot Indicator */}
      {!notification.read && (
        <span className="absolute top-4 left-4 size-2 rounded-full bg-primary animate-pulse" />
      )}

      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            {/* Category Icon Container */}
            <div className={`size-10 sm:size-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${category.style}`}>
              <CategoryIcon className="size-5 stroke-[2]" />
            </div>

            {/* Notification Content */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className={`text-sm font-semibold truncate ${!notification.read ? "text-foreground font-bold" : "text-foreground/80"}`}>
                  {notification.title}
                </h4>

                {/* Priority Badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${priority.style}`}>
                  <PriorityIcon className="size-3 stroke-[2.5]" />
                  {priority.label}
                </span>

                {/* Category Pill */}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${category.style}`}>
                  {notification.category}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {notification.description}
              </p>

              <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {notification.timestamp}
                </span>

                {/* Action Link if provided */}
                {notification.link && (
                  <Link
                    href={notification.link}
                    className="inline-flex items-center gap-0.5 text-primary hover:underline font-semibold"
                  >
                    View Details
                    <ArrowUpRight className="size-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleRead(notification.id)}
              className="size-8 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              title={notification.read ? "Mark as unread" : "Mark as read"}
            >
              <Check className={`size-4 ${notification.read ? "text-emerald-500" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(notification.id)}
              className="size-8 rounded-xl hover:bg-rose-500/10 hover:text-rose-600"
              title="Delete notification"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
