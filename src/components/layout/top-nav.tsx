import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DynamicBreadcrumbs } from "./breadcrumbs"
import { Notifications } from "./notifications"
import { UserNav } from "./user-nav"

interface TopNavProps {
  onMenuClick: () => void
  onDesktopMenuClick?: () => void
}

export function TopNav({ onMenuClick, onDesktopMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="-m-2.5 p-2.5 text-muted-foreground lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      {onDesktopMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="-m-2.5 p-2.5 text-muted-foreground hidden lg:block"
          onClick={onDesktopMenuClick}
        >
          <span className="sr-only">Toggle sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      )}

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />
      {onDesktopMenuClick && (
        <div className="hidden lg:block h-6 w-px bg-border ml-2" aria-hidden="true" />
      )}

      <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <DynamicBreadcrumbs />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Notifications />
          
          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-border"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <UserNav />
        </div>
      </div>
    </header>
  )
}
