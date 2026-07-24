"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faPlus, faDownload, faFileExcel, faBuilding, faBox, faCalendar, faFile, faFileLines, faCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

import { Button, buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { EmptyState } from "@/components/erp/empty-state"
import { ViewToggle } from "@/components/erp/view-toggle"
import { AuthService } from "@/lib/auth"
import { mockDocuments, Document } from "@/lib/mock-data/documents"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function DocumentsPage() {
  const { toast } = useToast()
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null)
  const [data, setData] = useState<Document[]>(mockDocuments)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  
  const [userRole, setUserRole] = useState<string>("Admin")
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) setUserRole(user.role)
  }, [])

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleDelete = () => {
    if (deleteDialogId) {
      setData(data.filter(d => d.id !== deleteDialogId))
      setDeleteDialogId(null)
      toast({
        title: "Document Deleted",
        description: "The document has been permanently removed.",
        variant: "destructive"
      })
    }
  }

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name} (${doc.fileSize})...`,
    })
  }

  // Filter logic
  const filteredDocuments = useMemo(() => {
    return data.filter(doc => {
      // Search text filter
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || (
        doc.name.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q) ||
        doc.clientName.toLowerCase().includes(q) ||
        doc.shipmentId.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q) ||
        (doc.tags && doc.tags.some(t => t.toLowerCase().includes(q)))
      )

      // Category filter
      const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter

      // File type filter
      const matchesType = typeFilter === "all" || doc.type.toUpperCase() === typeFilter.toUpperCase()

      // Status filter
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter

      return matchesSearch && matchesCategory && matchesType && matchesStatus
    })
  }, [data, searchQuery, categoryFilter, typeFilter, statusFilter])

  const hasActiveFilters = searchQuery !== "" || categoryFilter !== "all" || typeFilter !== "all" || statusFilter !== "all"

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setTypeFilter("all")
    setStatusFilter("all")
  }

  // File type styling helper
  const getFileTypeIconAndStyle = (type: string) => {
    const t = type.toUpperCase()
    if (t === "PDF") {
      return {
        icon: faFileLines,
        badgeStyle: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/50",
        cardBorderStyle: "hover:border-red-500/30"
      }
    }
    if (t === "XLSX" || t === "EXCEL") {
      return {
        icon: faFileExcel,
        badgeStyle: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50",
        cardBorderStyle: "hover:border-emerald-500/30"
      }
    }
    if (t === "DOCX" || t === "WORD") {
      return {
        icon: faFileLines,
        badgeStyle: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50",
        cardBorderStyle: "hover:border-blue-500/30"
      }
    }
    if (["JPG", "JPEG", "PNG"].includes(t)) {
      return {
        icon: faFileLines,
        badgeStyle: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900/50",
        cardBorderStyle: "hover:border-purple-500/30"
      }
    }
    return {
      icon: faFile,
      badgeStyle: "bg-muted text-muted-foreground border-border",
      cardBorderStyle: "hover:border-primary/30"
    }
  }

  const columns: ColumnDef<Document>[] = [
    {
      header: "Document",
      accessorKey: "name",
      sortable: true,
      cell: (item) => {
        const { icon: faFileIcon, badgeStyle } = getFileTypeIconAndStyle(item.type)
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${badgeStyle} shrink-0`}>
              <FontAwesomeIcon icon={faFileIcon} className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <Link href={`/documents/${item.id}`} className="font-medium hover:text-primary hover:underline block truncate max-w-[240px]">
                {item.name}
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{item.id}</span>
                <span className="text-muted-foreground text-[10px]">•</span>
                <span className="text-[10px] text-muted-foreground">{item.category}</span>
                <span className="text-muted-foreground text-[10px]">•</span>
                <span className="text-[10px] font-mono text-muted-foreground">{item.type}</span>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      header: "Client",
      accessorKey: "clientName",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-sm">
          <FontAwesomeIcon icon={faBuilding} className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate max-w-[150px]">{item.clientName}</span>
        </div>
      )
    },
    {
      header: "Shipment ID",
      accessorKey: "shipmentId",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs text-muted-foreground">{item.shipmentId}</span>
      )
    },
    {
      header: "File Info",
      accessorKey: "uploadDate",
      sortable: true,
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-sm">{item.uploadDate}</span>
          <span className="text-xs text-muted-foreground">{item.fileSize}</span>
        </div>
      )
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
        <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap flex-nowrap w-[160px]">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toast({ title: "Preview", description: "Loading document preview..." })}
          >
            Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDownload(item)}
          >
            Download
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title="Documents Hub" 
        description="Securely manage, preview, filter, and share all trade and shipment documents."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => toast({ title: "Export Started", description: "Exporting documents directory listing..." })}>
              <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" /> Export List
            </Button>
            <Link href="/documents/upload" className={buttonVariants({ variant: "default" })}>
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Upload Document
            </Link>
          </div>
        }
      />
      
      <div className="flex justify-end -mt-4 mb-2">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 bg-card p-5 rounded-xl border border-border/60 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 group">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Search by doc name, ID, client, shipment, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 bg-muted/40 border-muted-foreground/20 focus-visible:bg-background rounded-xl transition-all duration-300"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "all")}>
              <SelectTrigger className="w-[170px] rounded-xl bg-muted/40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Shipment Documents">Shipment Docs</SelectItem>
                <SelectItem value="BOE Documents">BOE Docs</SelectItem>
                <SelectItem value="Client Documents">Client Docs</SelectItem>
                <SelectItem value="Financial Documents">Financial Docs</SelectItem>
                <SelectItem value="Compliance Documents">Compliance Docs</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
              <SelectTrigger className="w-[130px] rounded-xl bg-muted/40">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="XLSX">Excel (XLSX)</SelectItem>
                <SelectItem value="DOCX">Word (DOCX)</SelectItem>
                <SelectItem value="JPG">Image (JPG/PNG)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
              <SelectTrigger className="w-[150px] rounded-xl bg-muted/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t text-xs">
            <span className="text-muted-foreground flex items-center gap-1 font-medium">
              <FontAwesomeIcon icon={faFilter} className="h-3 w-3" /> Active Filters:
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg">
                Search: &quot;{searchQuery}&quot;
                <FontAwesomeIcon icon={faXmark} className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg">
                Category: {categoryFilter}
                <FontAwesomeIcon icon={faXmark} className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter("all")} />
              </Badge>
            )}
            {typeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg">
                Type: {typeFilter}
                <FontAwesomeIcon icon={faXmark} className="h-3 w-3 cursor-pointer" onClick={() => setTypeFilter("all")} />
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg">
                Status: {statusFilter}
                <FontAwesomeIcon icon={faXmark} className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
              </Badge>
            )}
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary ml-1" onClick={clearFilters}>
              Reset all
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area: Grid or Table */}
      {filteredDocuments.length === 0 ? (
        <EmptyState 
          title="No documents found"
          description={hasActiveFilters ? "No documents match your current filter settings. Try adjusting or clearing your filters." : "Get started by uploading a new document to the system."}
          action={
            hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Link href="/documents/upload" className={buttonVariants({ variant: "default" })}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Upload Document
              </Link>
            )
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) => {
            const { icon: faFileIcon, badgeStyle, cardBorderStyle } = getFileTypeIconAndStyle(doc.type)

            return (
              <Card 
                key={doc.id}
                className={`group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-md border-border/60 shadow-sm ${cardBorderStyle}`}
              >
                {/* Header info */}
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className={`p-2.5 rounded-xl border ${badgeStyle} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                      <FontAwesomeIcon icon={faFileIcon} className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="font-mono text-[10px] font-semibold bg-muted/30">
                        {doc.version || "v1.0"}
                      </Badge>
                      <StatusBadge status={doc.status} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link 
                      href={`/documents/${doc.id}`}
                      className="font-semibold text-base tracking-tight hover:text-primary transition-colors line-clamp-1 block"
                      title={doc.name}
                    >
                      {doc.name}
                    </Link>
                    <p className="text-xs text-muted-foreground font-mono">{doc.id}</p>
                  </div>
                </CardHeader>

                {/* Card details body */}
                <CardContent className="p-5 pt-0 space-y-3 text-xs flex-1">
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faBuilding} className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        Client:
                      </span>
                      <span className="font-medium text-foreground truncate max-w-[130px]">{doc.clientName}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faBox} className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        Shipment:
                      </span>
                      <span className="font-mono font-medium text-foreground">{doc.shipmentId}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendar} className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        Uploaded:
                      </span>
                      <span className="font-medium text-foreground">{doc.uploadDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCircle} className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        Size:
                      </span>
                      <span className="font-medium text-foreground">{doc.fileSize}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-[10px] text-muted-foreground">
                          <FontAwesomeIcon icon={faCircle} className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                {/* Footer action bar */}
                <CardFooter className="p-4 bg-muted/10 border-t flex items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Link
                      href={`/documents/${doc.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      View
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      Download
                    </Button>
                    {userRole !== "Client" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteDialogId(doc.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredDocuments} 
          searchKey="name"
          searchPlaceholder="Search by document name..."
          emptyStateTitle="No documents found"
          emptyStateDescription="Try refining your search or filters."
        />
      )}

      {/* Delete Confirmation Modal */}
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
