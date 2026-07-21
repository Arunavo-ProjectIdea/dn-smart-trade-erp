"use client"

import { use } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircle, faCalendar, faBox, faFileLines, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { PageHeader } from "@/components/erp/page-header"
import { StatusBadge, StatusType } from "@/components/erp/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/erp/data-table"
import { useToast } from "@/components/ui/use-toast"
import { mockDocumentsList } from "@/lib/mock-data/document"
import { mockBOEList } from "@/lib/mock-data/boe"
import { mockShipmentsList } from "@/lib/mock-data/shipment"
import { TrackingTimeline } from "@/components/erp/tracking-timeline"
import Link from "next/link"
import { buttonVariants, Button } from "@/components/ui/button"

export default function ShipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  
  const shipment = mockShipmentsList.find(s => s.id === id) || mockShipmentsList[0];
  
  // Find related BOEs
  const shipmentBoes = mockBOEList.filter(b => b.shipment.shipmentId === shipment.id)
  
  const boeColumns = [
    { 
      header: "BOE Number", 
      accessorKey: "boeNumber" as keyof typeof shipmentBoes[0],
      cell: (item: typeof shipmentBoes[0]) => (
        <Link href={`/boe/${item.id}`} className="font-medium text-primary hover:underline">
          {item.boeNumber}
        </Link>
      )
    },
    { header: "Status", accessorKey: "status" as keyof typeof shipmentBoes[0],
      cell: (item: typeof shipmentBoes[0]) => (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          item.status === 'Completed' ? 'bg-success/10 text-success' : 
          item.status === 'Under Review' ? 'bg-warning/10 text-warning' : 
          'bg-muted text-muted-foreground'
        }`}>
          {item.status}
        </span>
      )
    },
    { 
      header: "Date", 
      accessorKey: "createdAt" as keyof typeof shipmentBoes[0],
      cell: (item: typeof shipmentBoes[0]) => new Date(item.createdAt).toLocaleDateString()
    }
  ]

  // Find related documents
  const shipmentDocs = mockDocumentsList.filter(d => d.shipmentId === shipment.id)
  
  const documentColumns = [
    { 
      header: "Name", 
      accessorKey: "name" as keyof typeof shipmentDocs[0],
      cell: (item: typeof shipmentDocs[0]) => (
        <Link href={`/documents/${item.id}`} className="font-medium text-primary hover:underline max-w-[200px] truncate block">
          {item.name}
        </Link>
      )
    },
    { header: "Type", accessorKey: "type" as keyof typeof shipmentDocs[0] },
    { 
      header: "Status", 
      accessorKey: "status" as keyof typeof shipmentDocs[0],
      cell: (item: typeof shipmentDocs[0]) => (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          item.status === 'Approved' ? 'bg-success/10 text-success' : 
          item.status === 'Pending Review' ? 'bg-warning/10 text-warning' : 
          'bg-muted text-muted-foreground'
        }`}>
          {item.status}
        </span>
      )
    },
    { 
      header: "Date", 
      accessorKey: "uploadedAt" as keyof typeof shipmentDocs[0],
      cell: (item: typeof shipmentDocs[0]) => new Date(item.uploadedAt).toLocaleDateString()
    }
  ]

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-[-1rem]">
        <Link href="/shipments" className="hover:underline">Shipments</Link>
        <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
        <span className="text-foreground font-medium">{shipment.shipmentNumber}</span>
      </div>

      <PageHeader 
        title={`Shipment ${shipment.shipmentNumber}`}
        description={`Manage and track shipment details.`}
        action={
          <div className="flex gap-2">
            <Link href={`/shipments/${shipment.id}/edit`} className={buttonVariants({ variant: "outline" })}>
              Edit Shipment
            </Link>
            <Link href={`/documents/upload?shipmentId=${shipment.id}`} className={buttonVariants({ variant: "outline" })}>
              Add Document
            </Link>
            {shipment.boeId ? (
              <Link href={`/boe/${shipment.boeId}`} className={buttonVariants({ variant: "default" })}>
                View BOE
              </Link>
            ) : (
              <Link href={`/boe/create?shipmentId=${shipment.id}`} className={buttonVariants({ variant: "default" })}>
                Generate BOE
              </Link>
            )}
            <Button variant="outline" onClick={() => toast({ title: "Print", description: "Sending to printer..." })}>Print</Button>
            <Button variant="outline" onClick={() => toast({ title: "Download PDF", description: "Generating PDF..." })}>Download PDF</Button>
            <Button variant="outline" onClick={() => toast({ title: "Track Shipment", description: "Tracking feature coming soon." })}>Track Shipment</Button>
          </div>
        }
      >
        <StatusBadge status={shipment.status as StatusType} />
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
              <FontAwesomeIcon icon={faCircle} className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Carrier</p>
              <p className="font-semibold text-foreground text-lg">{shipment.shippingLine}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
              <FontAwesomeIcon icon={faLocationDot} className="size-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-muted-foreground font-medium">Route</p>
              <p className="font-semibold text-foreground truncate max-w-[150px]" title={`${shipment.loadingPort} → ${shipment.dischargePort}`}>
                {shipment.loadingPort} <span className="text-muted-foreground font-normal mx-1">→</span> {shipment.dischargePort}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
              <FontAwesomeIcon icon={faCalendar} className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">ETA</p>
              <p className="font-semibold text-foreground">{new Date(shipment.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
              <FontAwesomeIcon icon={faBox} className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Container</p>
              <p className="font-semibold text-foreground">{shipment.containerNumber || "Pending"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b border-border/50 rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
                Overview
              </TabsTrigger>
              <TabsTrigger value="cargo" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
                Cargo Details
              </TabsTrigger>
              <TabsTrigger value="customs" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
                Customs
              </TabsTrigger>
              <TabsTrigger value="boe" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
                BOE ({shipmentBoes.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
                Documents ({shipmentDocs.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-0 animate-in fade-in duration-300">
              <Card className="shadow-sm">
                <CardHeader className="pb-4 border-b border-border/50 mb-4">
                  <CardTitle>Shipment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Vessel Name / Voyage</p>
                    <p className="font-medium text-foreground">{shipment.vesselName} / {shipment.voyageNumber}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Transport Type</p>
                    <p className="font-medium text-foreground">{shipment.transportType}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Incoterms</p>
                    <p className="font-medium text-foreground">{shipment.incoterms}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Container Type</p>
                    <p className="font-medium text-foreground">{shipment.containerSize} {shipment.containerType}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Departure Date (ETD)</p>
                    <p className="font-medium text-foreground">{new Date(shipment.etd).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Arrival Date (ETA)</p>
                    <p className="font-medium text-foreground">{new Date(shipment.eta).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-4 border-b border-border/50 mb-4">
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Client Entity</p>
                    <Link href={`/clients/${shipment.clientId}`} className="font-medium text-primary hover:underline flex items-center w-fit">
                      {shipment.clientName} <FontAwesomeIcon icon={faChevronRight} className="size-4 ml-1" />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Importer</p>
                    <p className="font-medium text-foreground">{shipment.importer}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Exporter</p>
                    <p className="font-medium text-foreground">{shipment.exporter}</p>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Consignee</p>
                    <p className="font-medium text-foreground">{shipment.consignee}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cargo" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cargo Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                  <div className="md:col-span-3">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{shipment.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gross Weight</p>
                    <p className="font-medium">{shipment.grossWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Weight</p>
                    <p className="font-medium">{shipment.netWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Package Count / Type</p>
                    <p className="font-medium">{shipment.packageCount} {shipment.packageType}</p>
                  </div>
                  <div className="md:col-span-3 mt-4">
                    <p className="text-sm font-semibold mb-2 border-b pb-2">Products Included</p>
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Name</th>
                            <th className="px-3 py-2 text-left font-medium">HS Code</th>
                            <th className="px-3 py-2 text-right font-medium">Quantity</th>
                            <th className="px-3 py-2 text-right font-medium">Weight (kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shipment.products.map(p => (
                            <tr key={p.id} className="border-t">
                              <td className="px-3 py-2">{p.name}</td>
                              <td className="px-3 py-2">
                                <Link href={`/hs-codes?search=${p.hsCode}`} className="text-primary hover:underline">{p.hsCode}</Link>
                              </td>
                              <td className="px-3 py-2 text-right">{p.quantity.toLocaleString()}</td>
                              <td className="px-3 py-2 text-right">{p.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customs" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customs Status</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customs Status</p>
                    <div className="mt-1">
                      <StatusBadge status={shipment.customsStatus === 'Cleared' ? 'Active' : 'Pending'} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clearance Status</p>
                    <p className="font-medium">{shipment.clearanceStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Duty Amount</p>
                    <p className="font-medium text-lg">${shipment.dutyAmount?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center">
                    <Link href={`/duty-calculator?shipmentId=${shipment.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      Open Duty Calculator
                    </Link>
                  </div>
                  <div className="md:col-span-2 pt-4 border-t mt-2">
                    <p className="text-sm text-muted-foreground">Linked BOE</p>
                    {shipment.boeId ? (
                      <Link href={`/boe/${shipment.boeId}`} className="font-medium text-primary hover:underline text-lg flex items-center mt-1">
                        <FontAwesomeIcon icon={faFileLines} className="h-5 w-5 mr-2" /> {shipment.boeNumber}
                      </Link>
                    ) : (
                      <p className="font-medium text-muted-foreground italic">No BOE linked yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="boe" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Bills of Entry</CardTitle>
                    <CardDescription>Customs declarations associated with this shipment.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/boe?shipment=${shipment.id}`} className={buttonVariants({ variant: "ghost" })}>
                      View All
                    </Link>
                    <Link href={`/boe/create?shipmentId=${shipment.id}`} className={buttonVariants({ variant: "default" })}>
                      Create BOE
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable columns={boeColumns} data={shipmentBoes} searchKey="boeNumber" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>All shipping and customs documents.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/documents?shipment=${shipment.id}`} className={buttonVariants({ variant: "ghost" })}>
                      View All
                    </Link>
                    <Link href={`/documents/upload?shipmentId=${shipment.id}`} className={buttonVariants({ variant: "outline" })}>
                      Upload
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataTable columns={documentColumns} data={shipmentDocs} searchKey="name" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
        
        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 mb-4">
              <CardTitle>Tracking Timeline</CardTitle>
              <CardDescription>Lifecycle of the shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <TrackingTimeline events={shipment.timeline} />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 mb-4">
              <CardTitle>Assigned Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 bg-muted/20 p-3 rounded-lg border border-border/50">
                <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary shrink-0 shadow-inner">
                  {shipment.assignedEmployeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    <Link href={`/employees/${shipment.assignedEmployeeId}`} className="hover:underline hover:text-primary transition-colors">
                      {shipment.assignedEmployeeName}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Logistics Coordinator</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
