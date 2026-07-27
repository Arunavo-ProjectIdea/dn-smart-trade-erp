"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/actions/auth.actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface AuthGuardProps {
  children: React.ReactNode
}

// Pages only Admin can access
const ADMIN_ONLY_PAGES = [
  "/employees",
  "/settings",
]

// Pages Clients cannot access (Admin + Employee only)
const INTERNAL_ONLY_PAGES = [
  "/clients",
  "/reports",
  "/hs-codes",
  "/duty-calculator",
]

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const authorizedRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    getCurrentUser().then((res) => {
      if (!isMounted) return

      if (!res.success || !res.data) {
        // Not logged in, redirect to login with full page reload to clear state
        window.location.replace("/login")
        return
      }

      // Temporary mock role for Milestone 3A compatibility. 
      // Real RBAC from profiles table will be implemented in Milestone 3B.
      const user = { role: "Admin" }

      // Role-based access control
      if (user.role === "Client") {
        // Clients cannot access Admin-only pages
        const isAdminRestricted = ADMIN_ONLY_PAGES.some(page => pathname.startsWith(page))
        // Clients cannot access internal ERP-only pages
        const isInternalRestricted = INTERNAL_ONLY_PAGES.some(page => pathname.startsWith(page))
        // Clients cannot access any create, new, or edit routes
        const isCreateOrEditRoute = pathname.includes('/create') || pathname.includes('/new') || pathname.includes('/edit')

        if (isAdminRestricted || isInternalRestricted || isCreateOrEditRoute) {
          router.push("/dashboard")
          return
        }
      }

      if (user.role === "Employee") {
        // Employees cannot access Admin-only pages
        const isAdminRestricted = ADMIN_ONLY_PAGES.some(page => pathname.startsWith(page))
        if (isAdminRestricted) {
          router.push("/dashboard")
          return
        }
      }

      if (!authorizedRef.current) {
        authorizedRef.current = true
        setIsAuthorized(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [pathname, router])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 animate-spin text-primary fa-spin" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
