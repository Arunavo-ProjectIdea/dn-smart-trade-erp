"use client"

<<<<<<< Updated upstream
import { useEffect, useState } from "react"
=======
import { useEffect, useRef, useState } from "react"
>>>>>>> Stashed changes
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/actions/auth.actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface AuthGuardProps {
  children: React.ReactNode
}

// Pages that Client role cannot access
const ADMIN_ONLY_PAGES = [
  "/employees",
  "/settings",
]

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
<<<<<<< Updated upstream
    const user = AuthService.getCurrentUser()
    
    if (!user) {
      // Not logged in, redirect to login with full page reload to clear state
      window.location.replace("/login")
      return
    }
=======
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
>>>>>>> Stashed changes

    // Role-based access control
    if (user.role === "Client") {
      // Clients shouldn't access admin pages
      const isRestricted = ADMIN_ONLY_PAGES.some(page => pathname.startsWith(page))
      if (isRestricted) {
        router.push("/dashboard") // Or a dedicated unauthorized page
        return
      }
    }

<<<<<<< Updated upstream
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthorized(true)
=======
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
>>>>>>> Stashed changes
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
