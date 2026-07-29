"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes, faBuilding, faBox, faFileExcel, faBriefcase } from "@fortawesome/free-solid-svg-icons"
import { mockClients } from "@/lib/mock-data/clients"
import { mockShipmentsList } from "@/lib/mock-data/shipment"
import { mockEmployees } from "@/lib/mock-data/employees"

// Mock BOE data for search since it's not centralized in a file
const mockBOEs = [
  { id: "BOE-99231", status: "Approved", date: "2026-05-15" },
  { id: "BOE-99232", status: "Pending", date: "2026-05-18" }
]

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setTimeout(() => setSearch(""), 0)
    }
  }, [open])

  if (!open) return null

  const lowerSearch = search.toLowerCase()

  const filteredClients = search ? mockClients.filter(c => 
    c.companyName.toLowerCase().includes(lowerSearch) || 
    c.id.toLowerCase().includes(lowerSearch)
  ).slice(0, 3) : []

  const filteredShipments = search ? mockShipmentsList.filter(s => 
    s.shipmentNumber.toLowerCase().includes(lowerSearch) || 
    s.clientName.toLowerCase().includes(lowerSearch)
  ).slice(0, 3) : []

  const filteredEmployees = search ? mockEmployees.filter(e => 
    e.fullName.toLowerCase().includes(lowerSearch) || 
    e.department.toLowerCase().includes(lowerSearch)
  ).slice(0, 3) : []

  const filteredBOEs = search ? mockBOEs.filter(b => 
    b.id.toLowerCase().includes(lowerSearch)
  ).slice(0, 3) : []

  const pages = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Clients", href: "/clients" },
    { name: "Shipments", href: "/shipments" },
    { name: "Employees", href: "/employees" },
    { name: "Bill of Entry", href: "/boe" },
    { name: "Documents", href: "/documents" },
    { name: "Reports", href: "/reports" },
  ]
  const filteredPages = search ? pages.filter(p => p.name.toLowerCase().includes(lowerSearch)) : pages.slice(0, 5)

  const handleSelect = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in flex items-start justify-center pt-[15vh]">
      <div 
        className="fixed inset-0" 
        onClick={() => onOpenChange(false)} 
        aria-hidden="true" 
      />
      <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl animate-in zoom-in-95 fade-in">
        <div className="flex items-center border-b px-3">
          <FontAwesomeIcon icon={faSearch} className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a command or search..."
            autoComplete="off"
          />
          <button onClick={() => onOpenChange(false)} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!search && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Search for clients, shipments, employees, or navigate to pages.
            </div>
          )}

          {filteredPages.length > 0 && (
            <div className="mb-4">
              <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Navigation</h3>
              {filteredPages.map(page => (
                <button
                  key={page.href}
                  onClick={() => handleSelect(page.href)}
                  className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  {page.name}
                </button>
              ))}
            </div>
          )}

          {filteredClients.length > 0 && (
            <div className="mb-4">
              <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Clients</h3>
              {filteredClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleSelect(`/clients/${client.id}`)}
                  className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <FontAwesomeIcon icon={faBuilding} className="mr-2 h-4 w-4 text-muted-foreground" />
                  {client.companyName}
                  <span className="ml-2 text-xs text-muted-foreground">{client.id}</span>
                </button>
              ))}
            </div>
          )}

          {filteredShipments.length > 0 && (
            <div className="mb-4">
              <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Shipments</h3>
              {filteredShipments.map(shipment => (
                <button
                  key={shipment.id}
                  onClick={() => handleSelect(`/shipments/${shipment.id}`)}
                  className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <FontAwesomeIcon icon={faBox} className="mr-2 h-4 w-4 text-muted-foreground" />
                  {shipment.shipmentNumber}
                  <span className="ml-2 text-xs text-muted-foreground">{shipment.clientName}</span>
                </button>
              ))}
            </div>
          )}

          {filteredEmployees.length > 0 && (
            <div className="mb-4">
              <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Employees</h3>
              {filteredEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => handleSelect(`/employees/${emp.id}`)}
                  className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <FontAwesomeIcon icon={faBriefcase} className="mr-2 h-4 w-4 text-muted-foreground" />
                  {emp.fullName}
                  <span className="ml-2 text-xs text-muted-foreground">{emp.department}</span>
                </button>
              ))}
            </div>
          )}
          
          {filteredBOEs.length > 0 && (
            <div className="mb-4">
              <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Bills of Entry</h3>
              {filteredBOEs.map(boe => (
                <button
                  key={boe.id}
                  onClick={() => handleSelect(`/boe/${boe.id}`)}
                  className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <FontAwesomeIcon icon={faFileExcel} className="mr-2 h-4 w-4 text-muted-foreground" />
                  {boe.id}
                  <span className="ml-2 text-xs text-muted-foreground">{boe.status}</span>
                </button>
              ))}
            </div>
          )}
          
          {search && filteredPages.length === 0 && filteredClients.length === 0 && filteredShipments.length === 0 && filteredEmployees.length === 0 && filteredBOEs.length === 0 && (
            <div className="px-2 py-14 text-center text-sm text-muted-foreground">
              No results found for &quot;{search}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
