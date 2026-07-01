"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  LayoutDashboard, 
  Settings, 
  Users,
  Briefcase,
  FileText,
  Truck,
  FileSpreadsheet,
  Hash,
  Bot,
  UserCircle
} from "lucide-react"

import { cn } from "@/lib/utils"

export type Role = "Admin" | "Employee" | "Client"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: Role
  onClose?: () => void
  isCollapsed?: boolean
}

export function Sidebar({ className, role = "Admin", onClose, isCollapsed = false, ...props }: SidebarProps) {
  const pathname = usePathname()

  const getNavigation = (role: Role) => {
    switch (role) {
      case "Admin":
        return [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Employees", href: "/employees", icon: Briefcase },
          { name: "Clients", href: "/clients", icon: Users },
          { name: "Shipments", href: "/shipments", icon: Truck },
          { name: "BOE", href: "/boe", icon: FileSpreadsheet },
          { name: "HS Codes", href: "/hs-codes", icon: Hash },
          { name: "Documents", href: "/documents", icon: FileText },
          { name: "Reports", href: "/reports", icon: BarChart3 },
          { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
          { name: "Profile", href: "/profile", icon: UserCircle },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      case "Employee":
        return [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Clients", href: "/clients", icon: Users },
          { name: "Shipments", href: "/shipments", icon: Truck },
          { name: "BOE", href: "/boe", icon: FileSpreadsheet },
          { name: "HS Codes", href: "/hs-codes", icon: Hash },
          { name: "Documents", href: "/documents", icon: FileText },
          { name: "Reports", href: "/reports", icon: BarChart3 },
          { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
          { name: "Profile", href: "/profile", icon: UserCircle },
        ]
      case "Client":
        return [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "My Shipments", href: "/shipments", icon: Truck },
          { name: "My Documents", href: "/documents", icon: FileText },
          { name: "Profile", href: "/profile", icon: UserCircle },
        ]
      default:
        return []
    }
  }

  const navigation = getNavigation(role)

  return (
    <div className={cn("flex h-full flex-col gap-y-5 bg-sidebar pb-4 transition-all duration-300", isCollapsed ? "px-2" : "px-6", className)} {...props}>
      <div className={cn("flex h-16 shrink-0 items-center", isCollapsed ? "justify-center" : "")}>
        <div className={cn("flex items-center font-bold text-primary tracking-tight transition-all duration-300", isCollapsed ? "text-sm gap-0" : "text-xl gap-2")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && <span className="truncate whitespace-nowrap">DN Smart Trade</span>}
        </div>
      </div>
      <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                return (
                  <li key={item.name} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-md bg-sidebar-accent"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Link
                      href={item.href}
                      onClick={() => onClose && onClose()}
                      title={isCollapsed ? item.name : undefined}
                      className={cn(
                        isActive
                          ? "text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        "relative z-10 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-all duration-200 hover:translate-x-1 active:scale-[0.98]",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground",
                          "h-5 w-5 shrink-0 transition-colors"
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && <span className="truncate whitespace-nowrap">{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="/help"
              onClick={() => onClose && onClose()}
              title={isCollapsed ? "Documentation" : undefined}
              className={cn(
                "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1 active:scale-[0.98]",
                isCollapsed && "justify-center"
              )}
            >
              <FileText
                className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-sidebar-accent-foreground"
                aria-hidden="true"
              />
              {!isCollapsed && <span className="truncate whitespace-nowrap">Documentation</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
