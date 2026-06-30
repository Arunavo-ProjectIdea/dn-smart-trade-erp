"use client"

import * as React from "react"
import { TopNav } from "./top-nav"
import { Sidebar, Role } from "./sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import { AuthService } from "@/lib/auth"

interface DashboardShellProps {
  children: React.ReactNode
  role?: Role
}

export function DashboardShell({ children, role: propRole = "Admin" }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = React.useState(true)
  const [role, setRole] = React.useState<Role>(propRole)

  React.useEffect(() => {
    const initRole = async () => {
      const user = AuthService.getCurrentUser()
      if (user) {
        setRole(user.role)
      }
    }
    initRole()
  }, [])

  const handleMenuClick = () => {
    // For mobile (window width < 1024px, typical tailwind lg breakpoint is 1024)
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(true)
    } else {
      setDesktopSidebarOpen(!desktopSidebarOpen)
    }
  }

  return (
    <div>
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar role={role} className="w-full" />
        </SheetContent>
      </Sheet>

      {/* Static sidebar for desktop */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col transition-transform duration-300 ${desktopSidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
      >
        <Sidebar role={role} className="border-r" />
      </div>

      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 ${desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}
      >
        <TopNav onMenuClick={handleMenuClick} />

        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
