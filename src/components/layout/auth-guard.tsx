"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface AuthGuardProps {
  children: React.ReactNode
  role: string
  forcePasswordChange?: boolean
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

export function AuthGuard({ children, role, forcePasswordChange = false }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const authorizedRef = useRef(false)

  useEffect(() => {
    // Force password change on first login
    if (forcePasswordChange && !pathname.startsWith("/change-password")) {
      router.push("/change-password")
      return
    }

    // Role-based access control
    if (role === "Client") {
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

    if (role === "Employee") {
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
  }, [pathname, router, role, forcePasswordChange])

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
