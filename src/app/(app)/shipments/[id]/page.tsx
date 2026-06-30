"use client"

import { use } from "react"
import { MapPin, Truck, Calendar, Package, FileText, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

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
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-[-1rem]">
        <Link href="/shipments" className="hover:underline">Shipments</Link>
        <ChevronRight className="h-4 w-4" />
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
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Carrier</p>
              <p className="font-medium">{shipment.shippingLine}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Route</p>
              <p className="font-medium truncate max-w-[150px]" title={`${shipment.loadingPort} → ${shipment.dischargePort}`}>
                {shipment.loadingPort} → {shipment.dischargePort}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ETA</p>
              <p className="font-medium">{new Date(shipment.eta).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Container</p>
              <p className="font-medium">{shipment.containerNumber || "Pending"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="cargo" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
                Cargo Details
              </TabsTrigger>
              <TabsTrigger value="customs" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
                Customs
              </TabsTrigger>
              <TabsTrigger value="boe" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
                BOE ({shipmentBoes.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">
                Documents ({shipmentDocs.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vessel Name / Voyage</p>
                    <p className="font-medium">{shipment.vesselName} / {shipment.voyageNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transport Type</p>
                    <p className="font-medium">{shipment.transportType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Incoterms</p>
                    <p className="font-medium">{shipment.incoterms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Container Type</p>
                    <p className="font-medium">{shipment.containerSize} {shipment.containerType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departure Date (ETD)</p>
                    <p className="font-medium">{new Date(shipment.etd).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Arrival Date (ETA)</p>
                    <p className="font-medium">{new Date(shipment.eta).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Client Entity</p>
                    <Link href={`/clients/${shipment.clientId}`} className="font-medium text-primary hover:underline flex items-center mt-1">
                      {shipment.clientName} <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Importer</p>
                    <p className="font-medium">{shipment.importer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exporter</p>
                    <p className="font-medium">{shipment.exporter}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Consignee</p>
                    <p className="font-medium">{shipment.consignee}</p>
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
                        <FileText className="h-5 w-5 mr-2" /> {shipment.boeNumber}
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
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
              <CardDescription>Lifecycle of the shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <TrackingTimeline events={shipment.timeline} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                  {shipment.assignedEmployeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium">
                    <Link href={`/employees/${shipment.assignedEmployeeId}`} className="hover:underline text-primary">
                      {shipment.assignedEmployeeName}
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">Logistics Coordinator</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
