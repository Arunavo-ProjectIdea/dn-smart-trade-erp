"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2, Plus, FileSpreadsheet, Calendar, Filter } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBOEs, deleteBOE, BillOfEntry, BOEStatus } from "@/lib/mock-data/boe"

export default function BillOfEntryPage() {
  const [data, setData] = useState<BillOfEntry[]>([])
  const [filteredData, setFilteredData] = useState<BillOfEntry[]>([])
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [dateFilter, setDateFilter] = useState<string>("")

  // Load BOEs on mount and when changed
  useEffect(() => {
    const initData = async () => {
      const list = getBOEs()
      setData(list)
    }
    initData()
  }, [])

  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      let result = data
      
      if (statusFilter !== "ALL") {
        result = result.filter(item => item.status === statusFilter)
      }
      
      if (dateFilter) {
        result = result.filter(item => item.boeDate === dateFilter)
      }
      
      setFilteredData(result)
    }
    applyFilters()
  }, [data, statusFilter, dateFilter])

  const handleDelete = () => {
    if (deleteDialogId) {
      deleteBOE(deleteDialogId)
      setData(getBOEs())
      setDeleteDialogId(null)
    }
  }

  const getStatusBadge = (status: BOEStatus) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20 font-medium" variant="outline">Approved</Badge>
      case "Submitted":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border-warning/20 font-medium" variant="outline">Submitted</Badge>
      case "Under Verification":
        return <Badge className="bg-info/10 text-info hover:bg-info/20 border-info/20 font-medium" variant="outline">Under Verification</Badge>
      case "Rejected":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 font-medium" variant="outline">Rejected</Badge>
      case "Draft":
      default:
        return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 font-medium" variant="outline">Draft</Badge>
    }
  }

  const columns: ColumnDef<BillOfEntry>[] = [
    {
      header: "BOE Number",
      accessorKey: "boeNumber",
      sortable: true,
      cell: (item) => (
        <Link 
          href={`/boe/${item.id}`}
          className="font-medium flex items-center gap-2 text-primary hover:underline"
        >
          <FileSpreadsheet className="h-4 w-4 shrink-0" />
          {item.boeNumber}
        </Link>
      )
    },
    {
      header: "Importer",
      accessorKey: "importerName",
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-medium text-sm">{item.importerName}</div>
          <div className="text-xs text-muted-foreground">BIN: {item.binNumber}</div>
        </div>
      )
    },
    {
      header: "Filing Date",
      accessorKey: "boeDate",
      sortable: true,
      cell: (item) => {
        const dateObj = new Date(item.boeDate)
        return (
          <span className="text-sm">
            {dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )
      }
    },
    {
      header: "Invoice No",
      accessorKey: "invoiceNumber",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-sm">{item.invoiceNumber}</span>
      )
    },
    {
      header: "Value (CIF)",
      accessorKey: "cifValue",
      sortable: true,
      cell: (item) => (
        <span className="text-sm font-semibold">
          {item.currency} {item.cifValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => getStatusBadge(item.status)
    },
    {
      header: "Actions",
      cell: (item) => {
        const isEditable = item.status === "Draft" || item.status === "Rejected"
        return (
          <div className="flex items-center justify-end gap-1">
            <Link 
              href={`/boe/${item.id}`}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
            <Link 
              href={isEditable ? `/boe/${item.id}/edit` : "#"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                !isEditable && "opacity-30 cursor-not-allowed pointer-events-none text-muted-foreground"
              )}
              title={isEditable ? "Edit BOE" : "Only Draft or Rejected BOE can be edited"}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Delete BOE"
              onClick={() => setDeleteDialogId(item.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="Bill of Entry" 
        description="Manage and track customs declarations, invoices, and duties."
        action={
          <Link href="/boe/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> Create BOE
          </Link>
        }
      />
      
      {/* Search and Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20 border p-4 rounded-lg items-end">
        <div className="space-y-2">
          <Label className="text-xs font-semibold flex items-center gap-1">
            <Filter className="h-3 w-3" /> Status Filter
          </Label>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Under Verification">Under Verification</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Filing Date
          </Label>
          <Input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)} 
            className="bg-card cursor-pointer"
          />
        </div>

        <div className="flex justify-end">
          {(statusFilter !== "ALL" || dateFilter) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setStatusFilter("ALL")
                setDateFilter("")
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        searchKey="boeNumber"
        searchPlaceholder="Search by BOE number..."
        emptyStateTitle="No Bill of Entries found"
        emptyStateDescription="Get started by creating a new BOE document, or adjust your filters."
      />

      <ConfirmationDialog 
        open={!!deleteDialogId}
        onOpenChange={(open) => !open && setDeleteDialogId(null)}
        title="Delete Bill of Entry"
        description="Are you sure you want to delete this Bill of Entry record? This will permanently remove the document details and itemizations from LocalStorage."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogId(null)}
      />
    </div>
  )
}
