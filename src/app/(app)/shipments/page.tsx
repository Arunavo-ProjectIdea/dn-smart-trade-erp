"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin, Download, FileText, ChevronDown, ChevronUp, Package } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { mockShipmentsList } from "@/lib/mock-data/shipment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, StatusType } from "@/components/erp/status-badge";
import { useToast } from "@/components/ui/use-toast";

function ShipmentsContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [portFilter, setPortFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>(searchParams.get("client") || "all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  // We use this to force re-render when a shipment is deleted
  const [, setForceUpdate] = useState(0);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this shipment?")) {
      const index = mockShipmentsList.findIndex(s => s.id === id);
      if (index > -1) {
        mockShipmentsList.splice(index, 1);
        setForceUpdate(prev => prev + 1);
        toast({
          title: "Shipment Deleted",
          description: "The shipment has been successfully removed.",
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

  const uniquePorts = Array.from(new Set(mockShipmentsList.flatMap(s => [s.loadingPort, s.dischargePort]))).filter(Boolean);
  const uniqueClients = Array.from(new Set(mockShipmentsList.map(s => s.clientName))).filter(Boolean);

  const filteredShipments = mockShipmentsList.filter((shipment) => {
    const matchesSearch = 
      shipment.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      shipment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.containerNumber && shipment.containerNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    const matchesPort = portFilter === "all" || shipment.loadingPort === portFilter || shipment.dischargePort === portFilter;
    const matchesClient = clientFilter === "all" || shipment.clientName === clientFilter;
    
    return matchesSearch && matchesStatus && matchesPort && matchesClient;
  });

  if (sortConfig) {
    filteredShipments.sort((a, b) => {
      let aValue: string | number | Date = "";
      let bValue: string | number | Date = "";
      
      switch (sortConfig.key) {
        case 'shipment': 
          aValue = a.shipmentNumber; 
          bValue = b.shipmentNumber; 
          break;
        case 'client': 
          aValue = a.clientName; 
          bValue = b.clientName; 
          break;
        case 'origin': 
          aValue = a.loadingPort; 
          bValue = b.loadingPort; 
          break;
        case 'destination': 
          aValue = a.dischargePort; 
          bValue = b.dischargePort; 
          break;
        case 'eta': 
          aValue = new Date(a.eta).getTime(); 
          bValue = new Date(b.eta).getTime(); 
          break;
        case 'status': 
          aValue = a.status; 
          bValue = b.status; 
          break;
        default: return 0;
      }
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Shipments</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track and manage active shipments globally.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Export CSV", description: "Exporting data..." })}>
            <Download className="mr-2 size-4" /> Export CSV
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Export PDF", description: "Exporting data..." })}>
            <FileText className="mr-2 size-4" /> Export PDF
          </Button>
          <Link href="/shipments/create" className={buttonVariants({ variant: "default", className: "w-full sm:w-auto shadow-sm" })}>
            <Plus className="mr-2 size-4" /> New Shipment
          </Link>
        </div>
      </div>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>Overview of all shipments and their current statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-muted/20 p-4 rounded-[14px] border border-border/50">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by ID, Client, Container..." 
                className="pl-9 bg-background shadow-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                  <SelectTrigger className="w-[140px] bg-background shadow-sm">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Booked">Booked</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Select value={clientFilter} onValueChange={(val) => setClientFilter(val || "all")}>
                  <SelectTrigger className="w-[150px] bg-background shadow-sm">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {uniqueClients.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={portFilter} onValueChange={(val) => setPortFilter(val || "all")}>
                  <SelectTrigger className="w-[140px] bg-background shadow-sm">
                    <SelectValue placeholder="All Ports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ports</SelectItem>
                    {uniquePorts.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort('shipment')}>
                  <div className="flex items-center gap-1.5">Shipment {getSortIcon('shipment')}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort('client')}>
                  <div className="flex items-center gap-1.5">Client {getSortIcon('client')}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort('origin')}>
                  <div className="flex items-center gap-1.5">Origin {getSortIcon('origin')}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort('destination')}>
                  <div className="flex items-center gap-1.5">Destination {getSortIcon('destination')}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort('eta')}>
                  <div className="flex items-center gap-1.5">ETA {getSortIcon('eta')}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1.5">Status {getSortIcon('status')}</div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-48">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="size-10 mb-4 opacity-20" />
                      <p className="text-lg font-medium text-foreground">No shipments found</p>
                      <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id} className="group">
                    <TableCell className="font-medium">
                      <Link href={`/shipments/${shipment.id}`} className="text-primary hover:underline font-semibold flex flex-col gap-0.5">
                        {shipment.shipmentNumber}
                        {shipment.containerNumber && (
                          <span className="text-xs text-muted-foreground font-normal">
                            {shipment.containerNumber}
                          </span>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/clients/${shipment.clientId}`} className="hover:underline font-medium hover:text-primary transition-colors">
                        {shipment.clientName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" /> <span className="text-foreground font-medium">{shipment.loadingPort}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" /> <span className="text-foreground font-medium">{shipment.dischargePort}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {new Date(shipment.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status as StatusType} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/shipments/${shipment.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>View</Link>
                        <Link href={`/shipments/${shipment.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(shipment.id)}>Delete</Button>
                      </div>
                      <div className="flex justify-end gap-2 group-hover:hidden text-muted-foreground">
                        <Button variant="ghost" size="icon" className="size-8 pointer-events-none" tabIndex={-1}>
                          <ChevronDown className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ShipmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading shipments...</div>}>
      <ShipmentsContent />
    </Suspense>
  );
}
