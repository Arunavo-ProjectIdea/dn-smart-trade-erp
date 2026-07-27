"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/erp/page-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileExcel, faDownload, faCircle, faTrash, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { mockBOEList } from "@/lib/mock-data/boe";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, type StatusType } from "@/components/erp/status-badge";
import { ViewToggle } from "@/components/erp/view-toggle";
import { DataTable, ColumnDef } from "@/components/erp/data-table";
import { type BillOfEntry } from "@/lib/types/boe";
import { AuthService } from "@/lib/auth";

function BOEContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [clientFilter, setClientFilter] = useState<string>(searchParams.get("client") || "all");
  const [userRole, setUserRole] = useState<string>("Admin");
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) setUserRole(user.role);
  }, []);

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

  const columns: ColumnDef<BillOfEntry>[] = [
    {
      header: "BOE Number",
      accessorKey: "boeNumber",
      sortable: true,
      cell: (boe) => (
        <Link href={`/boe/${boe.id}`} className="flex items-center gap-2 hover:underline text-primary font-medium">
          <FontAwesomeIcon icon={faFileExcel} className="h-4 w-4 text-muted-foreground" />
          {boe.boeNumber}
        </Link>
      ),
    },
    {
      header: "Client",
      sortable: true,
      accessorKey: "id", 
      cell: (boe) => (
        <div>
          <div className="font-medium">{boe.importer.clientName}</div>
          <div className="text-xs text-muted-foreground">{boe.importer.companyName}</div>
        </div>
      ),
    },
    {
      header: "Port",
      cell: (boe) => boe.shipment.port,
    },
    {
      header: "HS Code (Primary)",
      cell: (boe) => boe.products[0]?.hsCode || 'N/A',
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (boe) => <StatusBadge status={boe.status as StatusType} />,
    },
    {
      header: "Duty Amount",
      cell: (boe) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(boe.duties.grandTotal),
    },
    {
      header: "Created Date",
      accessorKey: "createdAt",
      sortable: true,
      cell: (boe) => new Date(boe.createdAt).toLocaleDateString(),
    },
    {
      header: "Manage",
      cell: (boe) => (
        <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap flex-nowrap w-[200px]">
          {userRole !== "Client" && (
            <Link href={`/boe/${boe.id}/edit`} className={buttonVariants({ variant: "ghost", size: "xs" })}>
              Edit
            </Link>
          )}
          <Button variant="outline" size="xs" onClick={() => toast({ title: "Download PDF", description: "Generating PDF..." })}>
            PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "xs" })}>
              More <FontAwesomeIcon icon={faChevronDown} className="ml-1 h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast({ title: "Print", description: "Sending to printer..." })}>
                <FontAwesomeIcon icon={faCircle} className="mr-2 h-4 w-4" /> Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "History", description: "Loading history..." })}>
                <FontAwesomeIcon icon={faCircle} className="mr-2 h-4 w-4" /> History
              </DropdownMenuItem>
              {userRole !== "Client" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(boe.id)}>
                    <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const flattenedData = useMemo(() => {
    return mockBOEList.map(boe => ({
      ...boe,
      clientName: boe.importer.clientName,
      portName: boe.shipment.port,
      dutyTotal: boe.duties.grandTotal
    }));
  }, []);

  const columnsForFlat: ColumnDef<typeof flattenedData[0]>[] = columns.map(c => {
    if (c.header === "Client") return { ...c, accessorKey: "clientName", sortable: true };
    if (c.header === "Port") return { ...c, accessorKey: "portName", sortable: true };
    if (c.header === "Duty Amount") return { ...c, accessorKey: "dutyTotal", sortable: true };
    return c;
  }) as ColumnDef<typeof flattenedData[0]>[];

  const filteredData = flattenedData.filter((boe) => {
    const matchesStatus = statusFilter === "all" || boe.status === statusFilter;
    const matchesClient = clientFilter === "all" || boe.importer.clientName === clientFilter;
    return matchesStatus && matchesClient;
  });

  const filters = (
    <>
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
    </>
  );

  const actions = (
    <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => toast({ title: "Export", description: "Exporting BOE data..." })}>
      <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" /> Export
    </Button>
  );

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title="Bill of Entry" 
        description="Manage customs declarations and bill of entry records."
        action={
          userRole !== "Client" ? (
            <Link href="/boe/create" className={buttonVariants()}>
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Create BOE
            </Link>
          ) : undefined
        }
      />
      
      <div className="flex justify-end -mt-4 mb-2">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent BOE Documents</CardTitle>
            <CardDescription>A list of recently filed Bill of Entry records.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <DataTable 
              columns={columnsForFlat} 
              data={filteredData} 
              searchKey="boeNumber"
              searchPlaceholder="Search BOE number..."
              filters={filters}
              actions={actions}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
              {filteredData.map((boe) => (
                <Card key={boe.id} className="group relative transition-all duration-300 hover:shadow-card hover:border-border/80 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FontAwesomeIcon icon={faFileExcel} className="size-5" />
                      </div>
                      <StatusBadge status={boe.status as StatusType} />
                    </div>
                    <CardTitle className="mt-4 truncate">
                      <Link href={`/boe/${boe.id}`} className="hover:underline hover:text-primary transition-colors flex flex-col">
                        <span>{boe.boeNumber}</span>
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1 mt-1">
                      <span className="font-medium text-foreground">{boe.importer.clientName}</span>
                      <span className="text-xs">{boe.importer.companyName}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6 flex-1">
                    <div className="space-y-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Duty Amount</span>
                        <span className="font-medium text-lg text-foreground">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(boe.duties.grandTotal)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-border/50 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Port & Date</span>
                        <div className="flex justify-between items-center text-muted-foreground font-medium">
                          <span>{boe.shipment.port}</span>
                          <span>{new Date(boe.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
