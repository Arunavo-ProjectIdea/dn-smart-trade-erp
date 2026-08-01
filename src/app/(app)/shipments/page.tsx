"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faLocationDot, faCircle, faCalendar, faFileLines } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Shipment } from "@/lib/types/shipment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, StatusType } from "@/components/erp/status-badge";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/erp/page-header";
import { ViewToggle } from "@/components/erp/view-toggle";
import { DataTable, ColumnDef } from "@/components/erp/data-table";
import { getUserProfile } from "@/actions/auth.actions";
import { getShipments, deleteShipmentAction } from "./actions";

// Helper to parse port strings into City and Facility for a two-tiered display
function parsePortName(port: string) {
  if (!port) return { main: "-", sub: "" };
  
  const lower = port.toLowerCase();
  
  // Specific long strings from mock data
  if (lower.includes("hazrat shahjalal")) {
    return { main: "Dhaka, BD", sub: "Hazrat Shahjalal Int. Airport" };
  }
  if (lower.includes("kl international") || lower.includes("kuala lumpur")) {
    return { main: "Kuala Lumpur, MY", sub: "KL International Airport" };
  }
  
  // Generic splitting if comma exists
  if (port.includes(",")) {
    return { main: port, sub: "Port Facility" };
  }

  // Fallback
  return { main: port, sub: "Terminal" };
}

function ShipmentsContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [portFilter, setPortFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>(searchParams.get("client") || "all");
  const [userRole, setUserRole] = useState<string>("Admin");

  useEffect(() => {
    getUserProfile().then((res) => {
      if (res.success && res.data?.role) setUserRole(res.data.role as string);
    });

    async function loadShipments() {
      setLoading(true);
      setError(null);
      const res = await getShipments();
      if (res.error) {
        setError(res.error);
        toast({
          title: "Error Loading Shipments",
          description: res.error,
          variant: "destructive",
        });
      } else {
        setShipments(res.data || []);
      }
      setLoading(false);
    }

    loadShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this shipment?")) {
      const res = await deleteShipmentAction(id);
      if (!res.success) {
        toast({
          title: "Delete Failed",
          description: res.error || "Failed to delete shipment from Supabase.",
          variant: "destructive",
        });
        return;
      }
      setShipments((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Shipment Deleted",
        description: "The shipment has been successfully removed from Supabase.",
      });
    }
  };

  const uniquePorts = Array.from(
    new Set(shipments.flatMap((s) => [s.loadingPort, s.dischargePort]))
  ).filter(Boolean);

  const uniqueClients = Array.from(
    new Set(shipments.map((s) => s.clientName))
  ).filter(Boolean);

  const filteredShipments = shipments.filter((shipment) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      shipment.shipmentNumber.toLowerCase().includes(query) ||
      shipment.clientName.toLowerCase().includes(query) ||
      shipment.loadingPort.toLowerCase().includes(query) ||
      shipment.dischargePort.toLowerCase().includes(query) ||
      shipment.transportType.toLowerCase().includes(query) ||
      (shipment.containerNumber && shipment.containerNumber.toLowerCase().includes(query));

    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    const matchesPort =
      portFilter === "all" ||
      shipment.loadingPort === portFilter ||
      shipment.dischargePort === portFilter;
    const matchesClient = clientFilter === "all" || shipment.clientName === clientFilter;

    return matchesSearch && matchesStatus && matchesPort && matchesClient;
  });

  const columns: ColumnDef<Shipment>[] = [
    {
      header: "Shipment",
      accessorKey: "shipmentNumber",
      sortable: true,
      cell: (item) => (
        <Link href={`/shipments/${item.id}`} className="text-primary hover:underline font-semibold flex flex-col gap-0.5">
          {item.shipmentNumber}
          {item.containerNumber && (
            <span className="text-xs text-muted-foreground font-normal">
              {item.containerNumber}
            </span>
          )}
        </Link>
      ),
    },
    {
      header: "Client",
      accessorKey: "clientName",
      sortable: true,
      cell: (item) => (
        <Link href={`/clients/${item.clientId}`} className="hover:underline font-medium hover:text-primary transition-colors">
          {item.clientName}
        </Link>
      ),
    },
    {
      header: "Origin",
      accessorKey: "loadingPort",
      sortable: true,
      cell: (item) => {
        const port = parsePortName(item.loadingPort);
        return (
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faLocationDot} className="size-3.5 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-foreground font-medium">{port.main}</span>
              <span className="text-[11px] leading-tight text-muted-foreground max-w-[150px] truncate">{port.sub}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Destination",
      accessorKey: "dischargePort",
      sortable: true,
      cell: (item) => {
        const port = parsePortName(item.dischargePort);
        return (
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faLocationDot} className="size-3.5 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-foreground font-medium">{port.main}</span>
              <span className="text-[11px] leading-tight text-muted-foreground max-w-[150px] truncate">{port.sub}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "ETA",
      accessorKey: "eta",
      sortable: true,
      cell: (item) => (
        <span className="text-muted-foreground font-medium">
          {new Date(item.eta).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => <StatusBadge status={item.status as StatusType} />,
    },
    {
      header: "Manage",
      cell: (item) => (
        <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap flex-nowrap w-[130px]">
          {userRole !== "Client" && (
            <>
              <Link href={`/shipments/${item.id}/edit`} className={buttonVariants({ variant: "outline", size: "xs" })}>
                Edit
              </Link>
              <Button variant="destructive" size="xs" onClick={() => handleDelete(item.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const customFilters = (
    <>
      <div className="relative w-full sm:max-w-xs group">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input 
          type="search" 
          placeholder="Search by ID, Client, Port, Container..." 
          className="pl-9 bg-muted/30 border-muted/50 focus-visible:bg-background rounded-full transition-all duration-300 focus-visible:ring-2 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
        <SelectTrigger className="w-auto min-w-[140px] max-w-[240px] bg-background shadow-sm border-dashed rounded-full px-4 h-9 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">Status</span>
            <div className="h-4 w-px bg-border mx-1 shrink-0"></div>
            <div className="truncate"><SelectValue placeholder="All" /></div>
          </div>
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
      <Select value={clientFilter} onValueChange={(val) => setClientFilter(val || "all")}>
        <SelectTrigger className="w-auto min-w-[140px] max-w-[240px] bg-background shadow-sm border-dashed rounded-full px-4 h-9 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">Client</span>
            <div className="h-4 w-px bg-border mx-1 shrink-0"></div>
            <div className="truncate"><SelectValue placeholder="All" /></div>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {uniqueClients.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={portFilter} onValueChange={(val) => setPortFilter(val || "all")}>
        <SelectTrigger className="w-auto min-w-[140px] max-w-[240px] bg-background shadow-sm border-dashed rounded-full px-4 h-9 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">Port</span>
            <div className="h-4 w-px bg-border mx-1 shrink-0"></div>
            <div className="truncate"><SelectValue placeholder="All" /></div>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ports</SelectItem>
          {uniquePorts.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Shipments" 
        description="Track and manage active shipments globally."
        action={
          userRole !== "Client" ? (
            <Link href="/shipments/create" className={buttonVariants({ variant: "default", className: "w-full sm:w-auto shadow-sm" })}>
              <FontAwesomeIcon icon={faPlus} className="mr-2 size-4" /> New Shipment
            </Link>
          ) : undefined
        }
      />
      
      <div className="flex justify-end -mt-4 mb-2">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground font-medium">
          Loading shipments from Supabase...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/30">
          <p className="font-semibold">Failed to load shipments</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {viewMode === "table" ? (
            <DataTable 
              columns={columns} 
              data={filteredShipments} 
              emptyStateTitle="No shipments found"
              emptyStateDescription="Try adjusting your filters or search terms."
              filters={customFilters}
              actions={
                <>
                  <Button variant="outline" size="sm" className="bg-card" onClick={() => toast({ title: "Export CSV", description: "Exporting data..." })}>
                    <FontAwesomeIcon icon={faFileLines} className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" className="bg-card" onClick={() => toast({ title: "Export PDF", description: "Exporting data..." })}>
                    <FontAwesomeIcon icon={faFileLines} className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
              {customFilters && (
                <div className="col-span-full flex flex-nowrap overflow-x-auto items-center gap-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                  {customFilters}
                </div>
              )}
              {filteredShipments.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No shipments found. Try adjusting your filters.
                </div>
              ) : (
                filteredShipments.map((shipment) => (
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
                            <div className="flex items-start gap-2 font-medium">
                              <FontAwesomeIcon icon={faLocationDot} className="size-3.5 text-muted-foreground mt-0.5" />
                              <div className="flex flex-col">
                                <span className="text-foreground">{parsePortName(shipment.loadingPort).main}</span>
                                <span className="text-[11px] text-muted-foreground font-normal leading-tight truncate">{parsePortName(shipment.loadingPort).sub}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Destination</span>
                            <div className="flex items-start gap-2 font-medium">
                              <FontAwesomeIcon icon={faLocationDot} className="size-3.5 text-muted-foreground mt-0.5" />
                              <div className="flex flex-col">
                                <span className="text-foreground">{parsePortName(shipment.dischargePort).main}</span>
                                <span className="text-[11px] text-muted-foreground font-normal leading-tight truncate">{parsePortName(shipment.dischargePort).sub}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border/50 flex items-center gap-2">
                          <FontAwesomeIcon icon={faCalendar} className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">ETA:</span>
                          <span className="font-medium text-foreground">
                            {new Date(shipment.eta).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex items-center justify-end border-t border-border/40 bg-muted/10 p-4 rounded-b-[14px]">
                      <div className="flex items-center gap-2">
                        {userRole !== "Client" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(shipment.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">Delete</Button>
                            <Link href={`/shipments/${shipment.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                          </>
                        )}
                        <Link href={`/shipments/${shipment.id}`} className={buttonVariants({ variant: "default", size: "sm", className: "shadow-sm" })}>View</Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      )}
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
