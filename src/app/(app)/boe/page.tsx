"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/erp/page-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, FileSpreadsheet, MoreHorizontal, Download, Printer, Archive, Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { mockBOEList } from "@/lib/mock-data/boe";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, type StatusType } from "@/components/erp/status-badge";

function BOEContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [clientFilter, setClientFilter] = useState<string>(searchParams.get("client") || "all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [, setForceUpdate] = useState(0);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this BOE?")) {
      const index = mockBOEList.findIndex(b => b.id === id);
      if (index > -1) {
        mockBOEList.splice(index, 1);
        setForceUpdate(prev => prev + 1);
        toast({
          title: "BOE Deleted",
          description: "The BOE has been successfully removed.",
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

  const filteredBOEList = mockBOEList.filter((boe) => {
    const matchesSearch = 
      boe.boeNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      boe.importer.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || boe.status === statusFilter;
    const matchesClient = clientFilter === "all" || boe.importer.clientName === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  if (sortConfig) {
    filteredBOEList.sort((a, b) => {
      let aValue: string | number | Date = "";
      let bValue: string | number | Date = "";
      
      switch (sortConfig.key) {
        case 'boeNumber':
          aValue = a.boeNumber;
          bValue = b.boeNumber;
          break;
        case 'client':
          aValue = a.importer.clientName;
          bValue = b.importer.clientName;
          break;
        case 'port':
          aValue = a.shipment.port;
          bValue = b.shipment.port;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'dutyAmount':
          aValue = a.duties.grandTotal;
          bValue = b.duties.grandTotal;
          break;
        case 'createdDate':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title="Bill of Entry" 
        description="Manage customs declarations and bill of entry records."
        action={
          <Link href="/boe/create" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" /> Create BOE
          </Link>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Recent BOE Documents</CardTitle>
          <CardDescription>A list of recently filed Bill of Entry records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search BOE number or client..." 
                className="pl-9 bg-background shadow-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2">
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
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 hidden md:flex">
                <Select value={clientFilter} onValueChange={(val) => setClientFilter(val || "all")}>
                  <SelectTrigger className="w-auto min-w-[140px] bg-background shadow-sm border-dashed rounded-full px-4 h-9">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</span>
                      <div className="h-4 w-px bg-border mx-1"></div>
                      <SelectValue placeholder="All" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {Array.from(new Set(mockBOEList.map(b => b.importer.clientName))).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Export", description: "Exporting BOE data..." })}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('boeNumber')}>
                    <div className="flex items-center gap-1">BOE Number {getSortIcon('boeNumber')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('client')}>
                    <div className="flex items-center gap-1">Client {getSortIcon('client')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('port')}>
                    <div className="flex items-center gap-1">Port {getSortIcon('port')}</div>
                  </TableHead>
                  <TableHead>HS Code (Primary)</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('dutyAmount')}>
                    <div className="flex items-center gap-1">Duty Amount {getSortIcon('dutyAmount')}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('createdDate')}>
                    <div className="flex items-center gap-1">Created Date {getSortIcon('createdDate')}</div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBOEList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No Bill of Entry records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBOEList.map((boe) => (
                    <TableRow key={boe.id}>
                    <TableCell className="font-medium">
                      <Link href={`/boe/${boe.id}`} className="flex items-center gap-2 hover:underline text-primary">
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        {boe.boeNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{boe.importer.clientName}</div>
                        <div className="text-xs text-muted-foreground">{boe.importer.companyName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{boe.shipment.port}</TableCell>
                    <TableCell>{boe.products[0]?.hsCode || 'N/A'}</TableCell>
                    <TableCell>
                      <StatusBadge status={boe.status as StatusType} />
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(boe.duties.grandTotal)}
                    </TableCell>
                    <TableCell>
                      {new Date(boe.createdAt).toLocaleDateString()}
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
                             <Link href={`/boe/${boe.id}`} className="flex w-full cursor-pointer">View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                             <Link href={`/boe/${boe.id}/edit`} className="flex w-full cursor-pointer items-center">
                               <Edit className="mr-2 h-4 w-4" /> Edit
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast({ title: "Download PDF", description: "Generating PDF..." })}>
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Print", description: "Sending to printer..." })}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Archive", description: "This feature is coming soon." })}>
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(boe.id)}>
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

export default function BOEListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading records...</div>}>
      <BOEContent />
    </Suspense>
  );
}
