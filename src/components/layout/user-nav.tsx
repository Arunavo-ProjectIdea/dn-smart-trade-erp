"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthService } from "@/lib/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faGear, faUser } from "@fortawesome/free-solid-svg-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  const router = useRouter()
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(currentUser)
    }
  }, [])

  const handleLogout = () => {
    AuthService.logout().then(() => {
      window.location.replace("/login")
    })
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "AD"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm hover:ring-primary/30 transition-all duration-200">
          <AvatarImage src="/avatars/01.png" alt={user?.name || "User"} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold leading-none text-foreground">{user?.name || "Admin User"}</p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {user?.email || "admin@dnsmarttrade.com"}
              </p>
              {user?.role && (
                <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
            <FontAwesomeIcon icon={faUser} className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
            <FontAwesomeIcon icon={faGear} className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          render={<button type="button" onClick={handleLogout} />}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2 h-3.5 w-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
