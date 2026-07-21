"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2, Plus } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { mockClients, Client } from "@/lib/mock-data/clients"

export default function ClientsPage() {
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
            <Eye className="size-4" />
            <span className="sr-only">View</span>
          </Link>
          <Link 
            href={`/clients/${item.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground" })}
            title="Edit Client"
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete Client"
            onClick={() => setDeleteDialogId(item.id)}
          >
            <Trash2 className="size-4" />
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
            <Plus className="mr-2 size-4" /> Add Client
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="companyName"
        searchPlaceholder="Search clients..."
        emptyStateTitle="No clients found"
        emptyStateDescription="Get started by adding a new client to the system."
      />

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
