"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Building2, Mail, Phone, MapPin, Truck, FileText, Activity } from "lucide-react"

import { PageHeader } from "@/components/erp/page-header"
import { StatusBadge } from "@/components/erp/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/erp/data-table"
import { mockClients } from "@/lib/mock-data/clients"
import { mockDocumentsList } from "@/lib/mock-data/document"
import { mockBOEList } from "@/lib/mock-data/boe"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const client = mockClients.find((c) => c.id === id)
  
  if (!client) {
    notFound()
  }

  // Mock shipments for this specific client
  const mockShipments = Array.from({ length: client.totalShipments > 5 ? 5 : client.totalShipments }).map((_, i) => ({
    id: `SHP-${1000 + i}`,
    origin: "Shanghai, CN",
    destination: "Los Angeles, US",
    status: i === 0 && client.activeShipments > 0 ? "In Transit" : "Delivered",
    date: `2026-10-${10 - i}`
  }))

  const shipmentColumns = [
    { 
      header: "Tracking ID", 
      accessorKey: "id" as keyof typeof mockShipments[0],
      cell: (item: typeof mockShipments[0]) => (
        <Link href={`/shipments/${item.id}`} className="font-medium text-primary hover:underline">
          {item.id}
        </Link>
      )
    },
    { header: "Origin", accessorKey: "origin" as keyof typeof mockShipments[0] },
    { header: "Destination", accessorKey: "destination" as keyof typeof mockShipments[0] },
    { header: "Date", accessorKey: "date" as keyof typeof mockShipments[0] },
    { 
      header: "Status", 
      accessorKey: "status" as keyof typeof mockShipments[0],
      cell: (item: typeof mockShipments[0]) => (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          item.status === 'In Transit' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
        }`}>
          {item.status}
        </span>
      )
    }
  ]

  const clientBoes = mockBOEList.filter(b => b.importer.clientName === client.companyName)
  
  const boeColumns = [
    { 
      header: "BOE Number", 
      accessorKey: "boeNumber" as keyof typeof clientBoes[0],
      cell: (item: typeof clientBoes[0]) => (
        <Link href={`/boe/${item.id}`} className="font-medium text-primary hover:underline">
          {item.boeNumber}
        </Link>
      )
    },
    { header: "Status", accessorKey: "status" as keyof typeof clientBoes[0],
      cell: (item: typeof clientBoes[0]) => (
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
      accessorKey: "createdAt" as keyof typeof clientBoes[0],
      cell: (item: typeof clientBoes[0]) => new Date(item.createdAt).toLocaleDateString()
    }
  ]

  const clientDocs = mockDocumentsList.filter(d => d.clientId === client.id || d.clientName === client.companyName)
  
  const documentColumns = [
    { 
      header: "Name", 
      accessorKey: "name" as keyof typeof clientDocs[0],
      cell: (item: typeof clientDocs[0]) => (
        <Link href={`/documents/${item.id}`} className="font-medium text-primary hover:underline max-w-[200px] truncate block">
          {item.name}
        </Link>
      )
    },
    { header: "Type", accessorKey: "type" as keyof typeof clientDocs[0] },
    { 
      header: "Status", 
      accessorKey: "status" as keyof typeof clientDocs[0],
      cell: (item: typeof clientDocs[0]) => (
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
      accessorKey: "uploadedAt" as keyof typeof clientDocs[0],
      cell: (item: typeof clientDocs[0]) => new Date(item.uploadedAt).toLocaleDateString()
    }
  ]

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title={client.companyName}
        description={`Client ID: ${client.id} • ${client.clientType}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={client.status} className="text-sm px-3 py-1 shadow-sm" />
            <Link href={`/clients/${client.id}/edit`} className={buttonVariants({ variant: "outline", className: "shadow-sm" })}>
              Edit Client
            </Link>
            <Link href={`/shipments/create?clientId=${client.id}`} className={buttonVariants({ variant: "default", className: "shadow-sm" })}>
              New Shipment
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact Info Card */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50 mb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-medium">Registered Address</p>
                  <p className="text-sm text-muted-foreground">{client.address}</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Business Credentials</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                  <span><strong className="text-foreground">License:</strong> {client.tradeLicenseNumber}</span>
                  <span><strong className="text-foreground">BIN:</strong> {client.binNumber}</span>
                  <span><strong className="text-foreground">TIN:</strong> {client.tinNumber}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Metrics */}
        <div className="grid gap-4">
          <Link href={`/shipments?client=${client.companyName}&status=In Transit`} className="block group">
            <Card className="transition-all duration-300 shadow-sm hover:shadow-md hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Active Shipments</CardTitle>
                <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
                  <Truck className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{client.activeShipments}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently in transit</p>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/shipments?client=${client.companyName}`} className="block group">
            <Card className="transition-all duration-300 shadow-sm hover:shadow-md hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Total Shipments</CardTitle>
                <div className="size-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
                  <Truck className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{client.totalShipments}</div>
                <p className="text-xs text-muted-foreground mt-1">Historical records</p>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/documents?client=${client.id}`} className="block group">
            <Card className="transition-all duration-300 shadow-sm hover:shadow-md hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Total Documents</CardTitle>
                <div className="size-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
                  <FileText className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{client.totalDocuments}</div>
                <p className="text-xs text-muted-foreground mt-1">Invoices & Certificates</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="shipments" className="w-full">
        <TabsList className="w-full justify-start border-b border-border/50 rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto">
          <TabsTrigger value="shipments" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
            Shipments
          </TabsTrigger>
          <TabsTrigger value="boe" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
            BOE
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
            Documents
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none px-6 py-3 font-medium transition-colors">
            Recent Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="shipments" className="mt-0 animate-in fade-in duration-300">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 mb-4">
              <CardTitle>Shipment History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={shipmentColumns} 
                data={mockShipments} 
                emptyStateTitle="No shipments"
                emptyStateDescription="This client has no active or historical shipments."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="boe" className="mt-0 animate-in fade-in duration-300">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 mb-4">
              <CardTitle>Bill of Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={boeColumns} 
                data={clientBoes} 
                emptyStateTitle="No BOE"
                emptyStateDescription="This client has no Bill of Entry records."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="mt-0 animate-in fade-in duration-300">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 mb-4">
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={documentColumns} 
                data={clientDocs} 
                emptyStateTitle="No documents"
                emptyStateDescription="This client has no uploaded documents."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-0 animate-in fade-in duration-300">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 mb-4">
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm pt-2">
              <div className="flex gap-4 items-center bg-muted/20 p-3 rounded-lg border border-border/50">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center shadow-inner shrink-0"><Activity className="size-5 text-primary" /></div>
                <div>
                  <p className="font-medium text-foreground">Client Profile Updated</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Oct 20, 2026 by Admin User</p>
                </div>
              </div>
              <div className="flex gap-4 items-center bg-muted/20 p-3 rounded-lg border border-border/50">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center shadow-inner shrink-0"><FileText className="size-5 text-primary" /></div>
                <div>
                  <p className="font-medium text-foreground">Commercial Invoice Uploaded</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Oct 15, 2026 by Jane Smith</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
