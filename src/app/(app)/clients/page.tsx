"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
      setData(data.filter(c => c.id !== deleteDialogId))
      setDeleteDialogId(null)
    }
  }

  const columns: ColumnDef<Client>[] = [
    {
      header: "Client ID",
      accessorKey: "id",
      sortable: true,
      cell: (item) => <span className="font-mono text-sm">{item.id}</span>
    },
    {
      header: "Company Name",
      accessorKey: "companyName",
      sortable: true,
      cell: (item) => (
        <div className="font-medium">
          {item.companyName}
        </div>
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
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/clients/${item.id}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            title="Edit Client"
            onClick={() => alert("Edit mode mock")}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete Client"
            onClick={() => setDeleteDialogId(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Clients" 
        description="Manage your client accounts and their details."
        action={
          <Link href="/clients/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="companyName"
        searchPlaceholder="Search by company name..."
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
