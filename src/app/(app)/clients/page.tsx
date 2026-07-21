"use client"

import { useState } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCircle, faTrash, faPlus, faBuilding, faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { mockClients, Client } from "@/lib/mock-data/clients"

export default function ClientsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null)
  
  // In a real app, this would use React Query or SWR and a mutation
  const [data, setData] = useState<Client[]>(mockClients)

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
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link 
            href={`/clients/${item.id}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} className="size-4" />
            <span className="sr-only">View</span>
          </Link>
          <Link 
            href={`/clients/${item.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground" })}
            title="Edit Client"
          >
            <FontAwesomeIcon icon={faCircle} className="size-4" />
            <span className="sr-only">Edit</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete Client"
            onClick={() => setDeleteDialogId(item.id)}
          >
            <FontAwesomeIcon icon={faTrash} className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    }
  ]

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
        <div className="flex items-center rounded-lg border border-border p-1 bg-muted/30">
          <Button variant="ghost" size="sm" className={viewMode === "table" ? "bg-background shadow-sm" : "hover:bg-transparent text-muted-foreground"} onClick={() => setViewMode("table")}>
            <FontAwesomeIcon icon={faCircle} className="h-4 w-4 mr-2" /> Table
          </Button>
          <Button variant="ghost" size="sm" className={viewMode === "grid" ? "bg-background shadow-sm" : "hover:bg-transparent text-muted-foreground"} onClick={() => setViewMode("grid")}>
            <FontAwesomeIcon icon={faCircle} className="h-4 w-4 mr-2" /> Grid
          </Button>
        </div>
      </div>
      
      {viewMode === "table" ? (
        <DataTable 
          columns={columns} 
          data={data} 
          searchKey="companyName"
          searchPlaceholder="Search clients..."
          emptyStateTitle="No clients found"
          emptyStateDescription="Get started by adding a new client to the system."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((client) => (
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
                <div className="flex items-center gap-1">
                  <Link href={`/clients/${client.id}`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}>
                    <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                  </Link>
                  <Link href={`/clients/${client.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-foreground" })}>
                    <FontAwesomeIcon icon={faCircle} className="h-4 w-4" />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
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
