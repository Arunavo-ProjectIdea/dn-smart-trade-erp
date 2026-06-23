"use client"

import { useEffect, useState } from "react"
import { AuthService, UserRole } from "@/lib/auth"

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>("Admin")

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user) {
      setRole(user.role)
    }
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{role} Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the DN Smart Trade ERP AI Platform.
        </p>
      </div>
      
      {/* Placeholder for dashboard widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow h-32 flex items-center justify-center p-6">
            <span className="text-muted-foreground">Widget {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
