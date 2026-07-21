import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCircle, faTruck, faServer } from "@fortawesome/free-solid-svg-icons"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    icon: faTruck,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "Shipment #SHP-8472 cleared customs",
    description: "Loading port: Port of Shanghai",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: 2,
    icon: faCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    title: "New Order #1024 placed",
    description: "Global Logistics Inc. placed a new order.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    icon: faServer,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    title: "System maintenance scheduled",
    description: "Server maintenance at 12 AM tonight.",
    time: "3 hours ago",
    unread: false,
  },
]

export function Notifications() {
  const unreadCount = notifications.filter(n => n.unread).length

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
            <Link href="/notifications" className="text-xs text-primary hover:underline font-medium">Mark all read</Link>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer",
                n.unread && "bg-primary/3"
              )}
            >
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", n.iconBg)}>
                <FontAwesomeIcon icon={n.icon} className={cn("h-3.5 w-3.5", n.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-xs font-semibold leading-snug", n.unread ? "text-foreground" : "text-muted-foreground")}>
                    {n.title}
                  </p>
                  {n.unread && <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.description}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
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
