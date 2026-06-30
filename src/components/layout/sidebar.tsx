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
  UserCircle,
  Bell
} from "lucide-react"

import { cn } from "@/lib/utils"

export type Role = "Admin" | "Employee" | "Client"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: Role
  onClose?: () => void
}

export function Sidebar({ className, role = "Admin", onClose, ...props }: SidebarProps) {
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
          { name: "Notifications", href: "/notifications", icon: Bell },
          { name: "Profile", href: "/profile", icon: UserCircle },
        ]
      default:
        return []
    }
  }

  const navigation = getNavigation(role)

  return (
    <div className={cn("flex h-full flex-col gap-y-5 bg-sidebar px-6 pb-4", className)} {...props}>
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center gap-2 font-bold text-primary text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          DN Smart Trade
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
                      className={cn(
                        isActive
                          ? "text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        "relative z-10 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-all duration-200 hover:translate-x-1 active:scale-[0.98]"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground",
                          "h-5 w-5 shrink-0 transition-colors"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
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
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1 active:scale-[0.98]"
            >
              <FileText
                className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-sidebar-accent-foreground"
                aria-hidden="true"
              />
              Documentation
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
