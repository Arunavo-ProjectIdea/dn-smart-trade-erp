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
    { header: "Tracking ID", accessorKey: "id" as keyof typeof mockShipments[0] },
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

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title={client.companyName}
        description={`Client ID: ${client.id} • ${client.clientType}`}
        action={<StatusBadge status={client.status} className="text-sm px-3 py-1" />}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              <Truck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.activeShipments}</div>
              <p className="text-xs text-muted-foreground">Currently in transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.totalShipments}</div>
              <p className="text-xs text-muted-foreground">Historical records</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">Invoices & Certificates</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="shipments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="shipments" className="mt-6">
          <Card>
            <CardHeader>
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
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent className="h-40 flex items-center justify-center text-muted-foreground text-sm border-t">
              Document storage integration pending.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="h-40 flex flex-col justify-center gap-4 text-sm border-t pt-6">
              <div className="flex gap-4 items-center">
                <div className="p-2 bg-primary/10 rounded-full"><Activity className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="font-medium">Client Profile Updated</p>
                  <p className="text-muted-foreground text-xs">Oct 20, 2026 by Admin User</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="p-2 bg-primary/10 rounded-full"><FileText className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="font-medium">Commercial Invoice Uploaded</p>
                  <p className="text-muted-foreground text-xs">Oct 15, 2026 by Jane Smith</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
