import { PanelLeft, Search, Plus, Truck, Users, Briefcase, FileSpreadsheet } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DynamicBreadcrumbs } from "./breadcrumbs"
import { Notifications } from "./notifications"
import { UserNav } from "./user-nav"

interface TopNavProps {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="-m-2.5 p-2.5 text-muted-foreground lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <PanelLeft className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center gap-x-6">
          <DynamicBreadcrumbs />
          
          <div className="hidden md:flex relative w-full max-w-md items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search or type a command..."
              className="h-9 w-full rounded-md border border-border bg-muted/50 pl-10 pr-12 text-sm outline-none transition-colors focus:bg-background focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              readOnly
            />
            <div className="absolute right-2 flex items-center gap-1">
              <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden lg:flex h-9 border border-border bg-background shadow-sm hover:bg-accent/50 gap-2 items-center px-3 rounded-md text-sm font-medium">
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Quick Add</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/shipments/create" className="w-full">
                  <DropdownMenuItem className="cursor-pointer flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>New Shipment</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/clients/new" className="w-full">
                  <DropdownMenuItem className="cursor-pointer flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>New Client</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/employees/new" className="w-full">
                  <DropdownMenuItem className="cursor-pointer flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>New Employee</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/boe/create" className="w-full">
                  <DropdownMenuItem className="cursor-pointer flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>New Bill of Entry</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

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
