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
  const [role, setRole] = React.useState<Role>(propRole)

  React.useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user) {
      setRole(user.role)
    }
  }, [])

  return (
    <div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar role={role} className="w-full" />
        </SheetContent>
      </Sheet>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar role={role} className="border-r" />
      </div>

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
