"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableColumns,
  faBriefcase,
  faUsers,
  faTruck,
  faFileExcel,
  faHashtag,
  faFileLines,
  faChartBar,
  faRobot,
  faCircleUser,
  faGear,
  faChevronLeft,
  faChevronRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

import { cn } from "@/lib/utils"

export type Role = "Admin" | "Employee" | "Client"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: Role
  onClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface NavItem {
  name: string
  href: string
  icon: IconDefinition
}

export function Sidebar({ className, role = "Admin", onClose, isCollapsed = false, onToggleCollapse, ...props }: SidebarProps) {
  const pathname = usePathname()

  const getNavigation = (role: Role): NavItem[] => {
    switch (role) {
      case "Admin":
        return [
          { name: "Dashboard", href: "/dashboard", icon: faTableColumns },
          { name: "Employees", href: "/employees", icon: faBriefcase },
          { name: "Clients", href: "/clients", icon: faUsers },
          { name: "Shipments", href: "/shipments", icon: faTruck },
          { name: "BOE", href: "/boe", icon: faFileExcel },
          { name: "HS Codes", href: "/hs-codes", icon: faHashtag },
          { name: "Documents", href: "/documents", icon: faFileLines },
          { name: "Reports", href: "/reports", icon: faChartBar },
          { name: "AI Assistant", href: "/ai-assistant", icon: faRobot },
          { name: "Profile", href: "/profile", icon: faCircleUser },
          { name: "Settings", href: "/settings", icon: faGear },
        ]
      case "Employee":
        return [
          { name: "Dashboard", href: "/dashboard", icon: faTableColumns },
          { name: "Clients", href: "/clients", icon: faUsers },
          { name: "Shipments", href: "/shipments", icon: faTruck },
          { name: "BOE", href: "/boe", icon: faFileExcel },
          { name: "HS Codes", href: "/hs-codes", icon: faHashtag },
          { name: "Documents", href: "/documents", icon: faFileLines },
          { name: "Reports", href: "/reports", icon: faChartBar },
          { name: "AI Assistant", href: "/ai-assistant", icon: faRobot },
          { name: "Profile", href: "/profile", icon: faCircleUser },
        ]
      case "Client":
        return [
          { name: "Dashboard", href: "/dashboard", icon: faTableColumns },
          { name: "My Shipments", href: "/shipments", icon: faTruck },
          { name: "My Documents", href: "/documents", icon: faFileLines },
          { name: "Profile", href: "/profile", icon: faCircleUser },
        ]
      default:
        return []
    }
  }

  const navigation = getNavigation(role)

  return (
    <div className={cn("flex h-full flex-col gap-y-5 bg-sidebar pb-4 transition-all duration-300", isCollapsed ? "px-1" : "px-6", className)} {...props}>
      <div className={cn("flex h-16 shrink-0 items-center transition-all duration-300", isCollapsed ? "justify-center" : "justify-between")}>
        <div className={cn("flex items-center gap-3 transition-all duration-300 w-full rounded-md hover:bg-sidebar-accent/50 p-2 cursor-pointer", isCollapsed ? "justify-center" : "")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-md">
            <FontAwesomeIcon icon={faCircle} className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="truncate whitespace-nowrap font-semibold text-sm leading-tight">DN Smart Trade</span>
              <span className="truncate whitespace-nowrap text-xs text-muted-foreground">Enterprise Workspace</span>
            </div>
          )}
        </div>

        {onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse Sidebar"
            title="Collapse Sidebar"
            className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-transparent text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer absolute right-[-16px] top-4 border border-border bg-background shadow-sm z-50 hover:shadow-md"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        {onToggleCollapse && isCollapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand Sidebar"
            title="Expand Sidebar"
            className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-transparent text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer absolute right-[-16px] top-4 border border-border bg-background shadow-sm z-50 hover:shadow-md"
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
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
                      className={cn(
                        isActive
                          ? "text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        "relative z-10 group/link flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-all duration-200 hover:translate-x-1 active:scale-[0.98]",
                        isCollapsed && "justify-center hover:translate-x-0"
                      )}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className={cn(
                          isActive ? "text-sidebar-accent-foreground drop-shadow-sm" : "text-muted-foreground group-hover/link:text-sidebar-accent-foreground",
                          "h-5 w-5 shrink-0 transition-all duration-200"
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && <span className="truncate whitespace-nowrap">{item.name}</span>}
                      
                      {isCollapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 pointer-events-none z-50 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200">
                          <div className="bg-slate-900 text-slate-50 text-xs font-medium rounded-md px-2.5 py-1.5 shadow-sm whitespace-nowrap">
                            {item.name}
                          </div>
                        </div>
                      )}
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
              className={cn(
                "group/link -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1 active:scale-[0.98] relative",
                isCollapsed && "justify-center hover:translate-x-0"
              )}
            >
              <FontAwesomeIcon icon={faFileLines}
                className="h-5 w-5 shrink-0 text-muted-foreground group-hover/link:text-sidebar-accent-foreground"
                aria-hidden="true"
              />
              {!isCollapsed && <span className="truncate whitespace-nowrap">Documentation</span>}
              
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 pointer-events-none z-50 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200">
                  <div className="bg-slate-900 text-slate-50 text-xs font-medium rounded-md px-2.5 py-1.5 shadow-sm whitespace-nowrap">
                    Documentation
                  </div>
                </div>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
