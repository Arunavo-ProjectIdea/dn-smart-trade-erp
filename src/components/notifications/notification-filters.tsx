"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCheck, Trash2, Bell, Package, FileText, DollarSign, ShieldCheck, Layers } from "lucide-react"

interface NotificationFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  selectedPriority: string
  setSelectedPriority: (priority: string) => void
  unreadOnly: boolean
  setUnreadOnly: (unreadOnly: boolean) => void
  onMarkAllAsRead: () => void
  onClearAll: () => void
  unreadCount: number
  totalCount: number
}

export function NotificationFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  unreadOnly,
  setUnreadOnly,
  onMarkAllAsRead,
  onClearAll,
  unreadCount,
  totalCount,
}: NotificationFiltersProps) {
  const categories = [
    { id: "All", label: "All Items", icon: Layers },
    { id: "Shipments", label: "Shipments", icon: Package },
    { id: "BOE Filings", label: "BOE Filings", icon: FileText },
    { id: "Financial", label: "Financial", icon: DollarSign },
    { id: "Compliance", label: "Compliance", icon: ShieldCheck },
    { id: "System", label: "System", icon: Bell },
  ]

  return (
    <div className="space-y-4">
      {/* Top Action Bar & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Showing:</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            {totalCount} Total Alerts
          </span>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {unreadCount} Unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-xl border-border/80 text-xs font-medium hover:text-primary hover:border-primary/40"
          >
            <CheckCheck className="mr-1.5 size-3.5 text-emerald-500" />
            Mark All Read
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            disabled={totalCount === 0}
            className="rounded-xl border-border/80 text-xs font-medium text-muted-foreground hover:text-rose-600 hover:border-rose-500/40"
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Search Input & Priority Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Field */}
        <div className="relative sm:col-span-7">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification title or message body..."
            className="h-9 pl-9 text-xs rounded-xl border-border/80 bg-background/50 focus-visible:ring-primary/20"
          />
        </div>

        {/* Priority Filter */}
        <div className="sm:col-span-3">
          <Select value={selectedPriority} onValueChange={(val) => setSelectedPriority(val || "All")}>
            <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs font-medium focus:ring-primary/20">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="High">High Priority</SelectItem>
              <SelectItem value="Medium">Medium Priority</SelectItem>
              <SelectItem value="Low">Low / Info</SelectItem>
              <SelectItem value="Success">Success / Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Unread Only Toggle Pill */}
        <div className="sm:col-span-2">
          <Button
            variant={unreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`w-full h-9 rounded-xl text-xs font-semibold ${
              unreadOnly ? "bg-primary text-primary-foreground shadow-xs" : "border-border/80 text-muted-foreground"
            }`}
          >
            {unreadOnly ? "Unread Only" : "Show All"}
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => {
          const IconComp = cat.icon
          const isActive = selectedCategory === cat.id

          return (
            <Button
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl text-xs font-semibold shrink-0 h-8 px-3 transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <IconComp className="mr-1.5 size-3.5" />
              {cat.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
