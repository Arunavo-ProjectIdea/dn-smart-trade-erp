"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Pencil, Plus, List, LayoutGrid } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { KanbanBoard } from "@/components/erp/kanban-board"
import { StatusBadge } from "@/components/erp/status-badge"
import { mockShipments, Shipment } from "@/lib/mock-data/shipments"

export default function ShipmentsPage() {
  const [data] = useState<Shipment[]>(mockShipments)
  const [view, setView] = useState<'list' | 'kanban'>('kanban')

  const columns: ColumnDef<Shipment>[] = [
    {
      header: "Shipment ID",
      accessorKey: "id",
      sortable: true,
      cell: (item) => <span className="font-mono text-sm">{item.id}</span>
    },
    {
      header: "Client Name",
      accessorKey: "clientName",
      sortable: true,
      cell: (item) => <span className="font-medium">{item.clientName}</span>
    },
    {
      header: "Type",
      accessorKey: "type",
      sortable: true,
      cell: (item) => (
        <span className={item.type === "Import" ? "text-primary" : "text-blue-500 font-medium"}>
          {item.type}
        </span>
      )
    },
    {
      header: "Origin",
      accessorKey: "originCountry",
      sortable: true,
    },
    {
      header: "Destination",
      accessorKey: "destinationCountry",
      sortable: true,
    },
    {
      header: "Carrier",
      accessorKey: "carrier",
      sortable: true,
    },
    {
      header: "Container No.",
      accessorKey: "containerNumber",
      cell: (item) => <span className="font-mono text-xs">{item.containerNumber}</span>
    },
    {
      header: "Expected Arrival",
      accessorKey: "expectedArrivalDate",
      sortable: true,
      cell: (item) => <span>{new Date(item.expectedArrivalDate).toLocaleDateString()}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => <StatusBadge status={item.status} />
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Link 
            href={`/shipments/${item.id}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="View Shipment"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
          <Link 
            href={`/shipments/${item.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="Edit Shipment"
          >
            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Edit</span>
          </Link>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Shipment Management" 
        description="Track and manage all import and export logistics operations."
        action={
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-container-highest rounded-lg p-1 border border-border/20 hidden md:flex">
              <button 
                onClick={() => setView('kanban')}
                className={`px-3 py-1 rounded shadow-sm text-sm font-medium transition-colors flex items-center gap-2 ${view === 'kanban' ? 'bg-surface-variant text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Kanban
              </button>
              <button 
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded shadow-sm text-sm font-medium transition-colors flex items-center gap-2 ${view === 'list' ? 'bg-surface-variant text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
            <Link href="/shipments/new" className={buttonVariants({ variant: "default" })}>
              <Plus className="mr-2 h-4 w-4" /> Create Shipment
            </Link>
          </div>
        }
      />
      
      {view === 'list' ? (
        <DataTable 
          columns={columns} 
          data={data} 
          searchKey="id"
          searchPlaceholder="Search by Shipment ID..."
          emptyStateTitle="No shipments found"
          emptyStateDescription="Get started by creating a new shipment."
        />
      ) : (
        <KanbanBoard shipments={data} />
      )}
    </div>
  )
}
