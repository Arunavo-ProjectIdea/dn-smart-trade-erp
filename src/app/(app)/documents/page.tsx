"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2, Plus, Download } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { mockDocuments, Document } from "@/lib/mock-data/documents"

export default function DocumentsPage() {
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null)
  
  // In a real app, this would use React Query or SWR and a mutation
  const [data, setData] = useState<Document[]>(mockDocuments)

  const handleDelete = () => {
    if (deleteDialogId) {
      setData(data.filter(d => d.id !== deleteDialogId))
      setDeleteDialogId(null)
    }
  }

  const columns: ColumnDef<Document>[] = [
    {
      header: "Doc ID",
      accessorKey: "id",
      sortable: true,
      cell: (item) => <span className="font-mono text-xs">{item.id}</span>
    },
    {
      header: "Document Name",
      accessorKey: "name",
      sortable: true,
      cell: (item) => (
        <div className="font-medium">
          {item.name}
        </div>
      )
    },
    {
      header: "Type",
      accessorKey: "type",
      sortable: true,
      cell: (item) => <span className="text-muted-foreground text-sm">{item.type}</span>
    },
    {
      header: "Client",
      accessorKey: "clientName",
      sortable: true,
    },
    {
      header: "Shipment ID",
      accessorKey: "shipmentId",
      sortable: true,
      cell: (item) => <span className="font-mono text-xs">{item.shipmentId}</span>
    },
    {
      header: "Upload Date",
      accessorKey: "uploadDate",
      sortable: true,
    },
    {
      header: "Size",
      accessorKey: "fileSize",
      sortable: false,
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
            href={`/documents/${item.id}`}
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
            title="Edit Metadata"
            onClick={() => alert("Edit metadata mode mock")}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete Document"
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
        title="Documents" 
        description="Manage, upload, and review all documents across clients and shipments."
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export List
            </Button>
            <Link href="/documents/upload" className={buttonVariants({ variant: "default" })}>
              <Plus className="mr-2 h-4 w-4" /> Upload Document
            </Link>
          </div>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name"
        searchPlaceholder="Search by document name..."
        emptyStateTitle="No documents found"
        emptyStateDescription="Get started by uploading a new document to the system."
      />

      <ConfirmationDialog 
        open={!!deleteDialogId}
        onOpenChange={(open) => !open && setDeleteDialogId(null)}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogId(null)}
      />
    </div>
  )
}
