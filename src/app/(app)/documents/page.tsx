"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Download, Archive, Trash2, Upload, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { mockDocumentsList } from "@/lib/mock-data/document";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentStatus } from "@/lib/types/document";

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case 'Uploaded': return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
    case 'Pending Review': return 'bg-amber-100 text-amber-800 hover:bg-amber-100/80';
    case 'Approved': return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80';
    case 'Rejected': return 'bg-red-100 text-red-800 hover:bg-red-100/80';
    case 'Archived': return 'bg-gray-200 text-gray-800 hover:bg-gray-200/80';
    case 'Expired': return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80';
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
  }
};

const getFileIconColor = (fileType: string) => {
  switch (fileType) {
    case 'PDF': return 'text-red-500 bg-red-50 border-red-200';
    case 'XLSX': return 'text-green-600 bg-green-50 border-green-200';
    case 'DOCX': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'JPG':
    case 'JPEG':
    case 'PNG': return 'text-purple-500 bg-purple-50 border-purple-200';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

function DocumentsContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get("type") || "all");
  const shipmentFilter = searchParams.get("shipment") || "all";
  const clientFilter = searchParams.get("client") || "all";
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [, setForceUpdate] = useState(0);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const index = mockDocumentsList.findIndex(d => d.id === id);
      if (index > -1) {
        mockDocumentsList.splice(index, 1);
        setForceUpdate(prev => prev + 1);
        toast({
          title: "Document Deleted",
          description: "The document has been successfully removed.",
        });
      }
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ChevronDown className="h-4 w-4 opacity-20" />;
    return sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const filteredDocuments = mockDocumentsList.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.shipmentId && doc.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesShipment = shipmentFilter === "all" || doc.shipmentId === shipmentFilter;
    const matchesClient = clientFilter === "all" || doc.clientId === clientFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesShipment && matchesClient;
  });

  if (sortConfig) {
    filteredDocuments.sort((a, b) => {
      let aValue: string | number | Date = "";
      let bValue: string | number | Date = "";
      
      switch (sortConfig.key) {
        case 'document':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'client':
          aValue = a.clientName || '';
          bValue = b.clientName || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'size':
          aValue = a.fileSize;
          bValue = b.fileSize;
          break;
        case 'uploadDate':
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-2">
            Centralized management for all trade and shipment files.
          </p>
        </div>
        <Link href="/documents/upload" className={buttonVariants()}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>Browse, filter, and manage uploaded files.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 justify-between">
            <div className="relative w-full sm:max-w-md flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by name, client, or tags..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-background">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Type:</span>
                <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
                  <SelectTrigger className="w-[130px] h-7 border-0 p-0 focus:ring-0">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Commercial Invoice">Commercial Invoice</SelectItem>
                    <SelectItem value="Packing List">Packing List</SelectItem>
                    <SelectItem value="Bill of Lading">Bill of Lading</SelectItem>
                    <SelectItem value="Customs Documents">Customs Documents</SelectItem>
                    <SelectItem value="Import Permit">Import Permit</SelectItem>
                    <SelectItem value="Export Permit">Export Permit</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-background">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                  <SelectTrigger className="w-[130px] h-7 border-0 p-0 focus:ring-0">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Uploaded">Uploaded</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px] cursor-pointer hover:bg-muted/50" onClick={() => handleSort('document')}>
                    <div className="flex items-center gap-1">Document {getSortIcon('document')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('type')}>
                    <div className="flex items-center gap-1">Type {getSortIcon('type')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('client')}>
                    <div className="flex items-center gap-1">Client / Entity {getSortIcon('client')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('size')}>
                    <div className="flex items-center gap-1">Size {getSortIcon('size')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('uploadDate')}>
                    <div className="flex items-center gap-1">Upload Date {getSortIcon('uploadDate')}</div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No documents found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 shrink-0 rounded border flex items-center justify-center font-bold text-xs ${getFileIconColor(doc.fileType)}`}>
                          {doc.fileType}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <Link href={`/documents/${doc.id}`} className="font-medium hover:underline text-primary truncate max-w-[220px]">
                             {doc.name}
                           </Link>
                           <span className="text-xs text-muted-foreground truncate">v{doc.currentVersion} • By {doc.uploadedBy}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{doc.clientName || 'N/A'}</span>
                        {doc.shipmentId && <span className="text-xs text-muted-foreground">Ship: {doc.shipmentId}</span>}
                        {doc.boeId && <span className="text-xs text-muted-foreground">BOE: {doc.boeId}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(doc.status)} variant="outline">
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatBytes(doc.fileSize)}
                    </TableCell>
                    <TableCell>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem>
                             <Link href={`/documents/${doc.id}`} className="flex w-full cursor-pointer items-center">
                               <Eye className="mr-2 h-4 w-4" /> Preview & Details
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Download", description: "Downloading document..." })}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast({ title: "Archive", description: "Archive feature coming soon." })}>
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DocumentListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading documents...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
