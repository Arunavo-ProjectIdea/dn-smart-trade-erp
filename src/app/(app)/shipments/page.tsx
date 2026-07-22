"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faLocationDot, faDownload, faFileLines, faChevronDown, faChevronUp, faBox, faCircle, faCalendar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { mockShipmentsList } from "@/lib/mock-data/shipment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, StatusType } from "@/components/erp/status-badge";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/erp/page-header";
import { ViewToggle } from "@/components/erp/view-toggle";

function ShipmentsContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
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
    if (sortConfig?.key !== key) return <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 opacity-20" />;
    return sortConfig.direction === "asc" ? <FontAwesomeIcon icon={faChevronUp} className="h-4 w-4" /> : <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4" />;
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
      <PageHeader 
        title="Shipments" 
        description="Track and manage active shipments globally."
        action={
          <>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Export CSV", description: "Exporting data..." })}>
              <FontAwesomeIcon icon={faDownload} className="mr-2 size-4" /> Export CSV
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Export PDF", description: "Exporting data..." })}>
              <FontAwesomeIcon icon={faFileLines} className="mr-2 size-4" /> Export PDF
            </Button>
            <Link href="/shipments/create" className={buttonVariants({ variant: "default", className: "w-full sm:w-auto shadow-sm" })}>
              <FontAwesomeIcon icon={faPlus} className="mr-2 size-4" /> New Shipment
            </Link>
          </>
        }
      />
      
      <div className="flex justify-end -mt-4 mb-2">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
            <div className="relative w-full md:max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
          
          {viewMode === "table" ? (
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
              <div className="relative w-full overflow-auto">
                <Table className="min-w-[1000px]">
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
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
                      <FontAwesomeIcon icon={faBox} className="size-10 mb-4 opacity-20" />
                      <p className="text-lg font-medium text-foreground">No shipments found</p>
                      <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id} className="group hover:bg-muted/50 transition-colors duration-200">
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
                        <FontAwesomeIcon icon={faLocationDot} className="size-3.5" /> <span className="text-foreground font-medium">{shipment.loadingPort}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FontAwesomeIcon icon={faLocationDot} className="size-3.5" /> <span className="text-foreground font-medium">{shipment.dischargePort}</span>
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
                          <FontAwesomeIcon icon={faChevronDown} className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="group relative transition-all duration-300 hover:shadow-card hover:border-border/80 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FontAwesomeIcon icon={faCircle} className="size-5" />
                      </div>
                      <StatusBadge status={shipment.status as StatusType} />
                    </div>
                    <CardTitle className="mt-4 truncate">
                      <Link href={`/shipments/${shipment.id}`} className="hover:underline hover:text-primary transition-colors flex flex-col">
                        <span>{shipment.shipmentNumber}</span>
                        {shipment.containerNumber && (
                          <span className="text-xs text-muted-foreground font-normal mt-1">
                            Container: {shipment.containerNumber}
                          </span>
                        )}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{shipment.clientName}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6 flex-1">
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Origin</span>
                          <div className="flex items-center gap-2 font-medium">
                            <FontAwesomeIcon icon={faLocationDot} className="size-3.5 text-muted-foreground" />
                            <span className="truncate">{shipment.loadingPort}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Destination</span>
                          <div className="flex items-center gap-2 font-medium">
                            <FontAwesomeIcon icon={faLocationDot} className="size-3.5 text-muted-foreground" />
                            <span className="truncate">{shipment.dischargePort}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/50 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ETA:</span>
                        <span className="font-medium text-foreground">
                          {new Date(shipment.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex items-center justify-end border-t border-border/40 bg-muted/10 p-4 rounded-b-[14px]">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(shipment.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">Delete</Button>
                      <Link href={`/shipments/${shipment.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                      <Link href={`/shipments/${shipment.id}`} className={buttonVariants({ variant: "default", size: "sm", className: "shadow-sm" })}>View</Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
      </div>
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
