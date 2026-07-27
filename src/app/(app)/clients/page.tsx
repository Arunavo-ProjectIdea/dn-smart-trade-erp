"use client"

import { useState } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faBuilding, faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { ViewToggle } from "@/components/erp/view-toggle"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { mockClients, Client } from "@/lib/mock-data/clients"

export default function ClientsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null)
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  
  // In a real app, this would use React Query or SWR and a mutation
  const [data, setData] = useState<Client[]>(mockClients)

  // Computed filtered data
  const filteredData = data.filter((client) => {
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    const matchesType = typeFilter === "all" || client.clientType === typeFilter
    return matchesStatus && matchesType
  })

  const handleDelete = () => {
    if (deleteDialogId) {
      const index = mockClients.findIndex(c => c.id === deleteDialogId);
      if (index > -1) {
        mockClients.splice(index, 1);
        setData([...mockClients]);
      }
      setDeleteDialogId(null);
    }
  }

  const columns: ColumnDef<Client>[] = [
    {
      header: "Client ID",
      accessorKey: "id",
      sortable: true,
      cell: (item) => (
        <Link href={`/clients/${item.id}`} className="font-mono text-sm text-primary hover:underline">
          {item.id}
        </Link>
      )
    },
    {
      header: "Company Name",
      accessorKey: "companyName",
      sortable: true,
      cell: (item) => (
        <Link href={`/clients/${item.id}`} className="font-medium hover:underline">
          {item.companyName}
        </Link>
      )
    },
    {
      header: "Contact Person",
      accessorKey: "contactPerson",
      sortable: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
    },
    {
      header: "Type",
      accessorKey: "clientType",
      sortable: true,
      cell: (item) => <span className="text-muted-foreground">{item.clientType}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => <StatusBadge status={item.status} />
    },
    {
      header: "Manage",
      cell: (item) => (
        <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap flex-nowrap w-[200px]">
          <Link 
            href={`/clients/${item.id}`}
            className={buttonVariants({ variant: "ghost", size: "xs" })}
          >
            View
          </Link>
          <Link 
            href={`/clients/${item.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "xs" })}
          >
            Edit
          </Link>
          <Button 
            variant="destructive" 
            size="xs" 
            onClick={() => setDeleteDialogId(item.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ]

  const filters = (
    <>
      <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
        <SelectTrigger className="w-auto min-w-[140px] bg-background shadow-sm border-dashed rounded-full px-4 h-9">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
            <div className="h-4 w-px bg-border mx-1"></div>
            <SelectValue placeholder="All" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
        <SelectTrigger className="w-auto min-w-[140px] bg-background shadow-sm border-dashed rounded-full px-4 h-9">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</span>
            <div className="h-4 w-px bg-border mx-1"></div>
            <SelectValue placeholder="All" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Importer">Importer</SelectItem>
          <SelectItem value="Exporter">Exporter</SelectItem>
          <SelectItem value="Both">Both</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Clients" 
        description="Manage your client accounts and their details."
        action={
          <Link href="/clients/new" className={buttonVariants({ variant: "default", className: "shadow-sm" })}>
            <FontAwesomeIcon icon={faPlus} className="mr-2 size-4" /> Add Client
          </Link>
        }
      />
      
      <div className="flex justify-end -mt-4 mb-2">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>
      
      {viewMode === "table" ? (
        <DataTable 
          columns={columns} 
          data={filteredData} 
          searchKey="companyName"
          searchPlaceholder="Search clients..."
          filters={filters}
          emptyStateTitle="No clients found"
          emptyStateDescription="Get started by adding a new client to the system."
        />
      ) : (
        <div className="flex flex-col gap-6 mt-2">
          {/* Custom Grid Filters */}
          {(statusFilter !== "all" || typeFilter !== "all" || true) && (
            <div className="col-span-full flex flex-nowrap overflow-x-auto items-center gap-3 bg-muted/20 p-4 rounded-xl border border-border/50">
              {filters}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((client) => (
            <Card key={client.id} className="group relative transition-all duration-300 hover:shadow-card hover:border-border/80">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
                  </div>
                  <StatusBadge status={client.status} />
                </div>
                <CardTitle className="mt-4 truncate">
                  <Link href={`/clients/${client.id}`} className="hover:underline hover:text-primary transition-colors">
                    {client.companyName}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="font-mono text-xs">{client.id}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{client.clientType}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FontAwesomeIcon icon={faPhone} className="h-4 w-4 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{client.address}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-between border-t border-border/40 bg-muted/10 p-4 rounded-b-[14px]">
                <div className="text-xs font-medium text-muted-foreground">
                  Contact: <span className="text-foreground">{client.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/clients/${client.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Edit
                  </Link>
                  <Link href={`/clients/${client.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    View
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
          </div>
        </div>
      )}

      <ConfirmationDialog 
        open={!!deleteDialogId}
        onOpenChange={(open) => !open && setDeleteDialogId(null)}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone and will permanently remove the client's records from our servers."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogId(null)}
      />
    </div>
  )
}
