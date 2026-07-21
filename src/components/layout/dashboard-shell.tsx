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
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = React.useState(true)

  React.useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDesktopSidebarOpen(savedState === "false")
    }
  }, [])

  const toggleDesktopSidebar = () => {
    const newState = !desktopSidebarOpen
    setDesktopSidebarOpen(newState)
    localStorage.setItem("sidebarCollapsed", String(!newState))
  }
  
  const [role] = React.useState<Role>(() => {
    const user = AuthService.getCurrentUser();
    return user ? user.role : propRole;
  });

  return (
    <div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar role={role} className="w-full" onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Static sidebar for desktop */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
          desktopSidebarOpen ? "lg:w-[280px]" : "lg:w-[80px]"
        }`}
      >
        <Sidebar 
          role={role} 
          isCollapsed={!desktopSidebarOpen} 
          onToggleCollapse={toggleDesktopSidebar}
          className="border-r" 
        />
      </div>

      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          desktopSidebarOpen ? "lg:pl-[280px]" : "lg:pl-[80px]"
        }`}
      >
        <TopNav 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        <main className="flex-1 py-8 bg-background relative">
          <div className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
