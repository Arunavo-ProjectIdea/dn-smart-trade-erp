"use client"

import { use, useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircle, faCalendar, faBox, faFileLines, faChevronRight, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { PageHeader } from "@/components/erp/page-header"
import { StatusBadge, StatusType } from "@/components/erp/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/erp/data-table"
import { useToast } from "@/components/ui/use-toast"
import { mockDocumentsList } from "@/lib/mock-data/document"
import { mockBOEList } from "@/lib/mock-data/boe"
import { Shipment } from "@/lib/types/shipment"
import { TrackingTimeline } from "@/components/erp/tracking-timeline"
import Link from "next/link"
import { buttonVariants, Button } from "@/components/ui/button"
import { getShipmentById } from "../actions"

export default function ShipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDetails() {
      setLoading(true)
      const res = await getShipmentById(id)
      if (res.error || !res.data) {
        setError(res.error || "Shipment not found")
      } else {
        setShipment(res.data)
      }
      setLoading(false)
    }

    loadDetails()
  }, [id])

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground font-medium">
        Loading shipment details from Supabase...
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
        <PageHeader title="Shipment Not Found" />
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FontAwesomeIcon icon={faCircleExclamation} className="size-12 text-destructive mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No shipment found with ID: {id}</h3>
            <Link href="/shipments" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              Back to Shipments
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              <p className="font-semibold text-foreground text-lg">{shipment.shippingLine || "N/A"}</p>
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

            <TabsContent value="overview" className="space-y-6 m-0">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Shipment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Client Name</span>
                    <Link href={`/clients/${shipment.clientId}`} className="font-semibold text-primary hover:underline text-base">
                      {shipment.clientName}
                    </Link>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Assigned Employee</span>
                    <span className="font-medium text-foreground">{shipment.assignedEmployeeName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Importer</span>
                    <span className="font-medium text-foreground">{shipment.importer}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Exporter</span>
                    <span className="font-medium text-foreground">{shipment.exporter}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Consignee</span>
                    <span className="font-medium text-foreground">{shipment.consignee}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Transport Type</span>
                    <span className="font-medium text-foreground">{shipment.transportType} Freight</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Incoterms</span>
                    <span className="font-medium text-foreground">{shipment.incoterms}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Vessel / Voyage</span>
                    <span className="font-medium text-foreground">{shipment.vesselName || "N/A"} {shipment.voyageNumber ? `(${shipment.voyageNumber})` : ""}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cargo" className="space-y-6 m-0">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Cargo Specification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Gross Weight</span>
                      <p className="font-semibold text-lg">{shipment.grossWeight} kg</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Net Weight</span>
                      <p className="font-semibold text-lg">{shipment.netWeight} kg</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Package Count</span>
                      <p className="font-semibold text-lg">{shipment.packageCount}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Package Type</span>
                      <p className="font-semibold text-lg">{shipment.packageType}</p>
                    </div>
                  </div>
                  {shipment.description && (
                    <div className="pt-2">
                      <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Description</span>
                      <p className="text-sm leading-relaxed">{shipment.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customs" className="space-y-6 m-0">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Customs Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Customs Status</span>
                    <span className="font-semibold text-foreground">{shipment.customsStatus}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Clearance Status</span>
                    <span className="font-semibold text-foreground">{shipment.clearanceStatus}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">BOE Number</span>
                    <span className="font-semibold text-foreground">{shipment.boeNumber || "Not Linked"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Duty Amount</span>
                    <span className="font-semibold text-foreground">${shipment.dutyAmount || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="boe" className="m-0">
              <DataTable columns={boeColumns} data={shipmentBoes} emptyStateTitle="No BOEs found" emptyStateDescription="No Bill of Entry has been generated for this shipment yet." />
            </TabsContent>

            <TabsContent value="documents" className="m-0">
              <DataTable columns={documentColumns} data={shipmentDocs} emptyStateTitle="No documents found" emptyStateDescription="No documents attached to this shipment." />
            </TabsContent>
          </Tabs>

        </div>

        {/* Sidebar Tracking Timeline */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tracking Timeline</CardTitle>
              <CardDescription>Lifecycle of the shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <TrackingTimeline events={shipment.timeline || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
