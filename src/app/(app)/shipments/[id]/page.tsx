"use client"

import { useState } from "react"
import { notFound, useRouter, useParams } from "next/navigation"
import { 
  Building, MapPin, Calendar, Clock, Package, 
  FileText, Anchor, Truck, FileCheck, CheckCircle2, AlertCircle, Edit, Ship, UploadCloud, RefreshCw
} from "lucide-react"

import { PageHeader } from "@/components/erp/page-header"
import { StatusBadge } from "@/components/erp/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timeline, TimelineStep } from "@/components/erp/timeline"
import { mockShipments } from "@/lib/mock-data/shipments"

export default function ShipmentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const shipment = mockShipments.find((s) => s.id === id)
  
  if (!shipment && id) {
    notFound()
  }

  if (!shipment) return null

  // Generate Timeline based on status
  const generateTimelineSteps = (): TimelineStep[] => {
    const statuses = [
      "Created", 
      "Container Booked", 
      "Departed", 
      "Arrived", 
      "Customs Clearance", 
      "Delivered", 
      "Completed"
    ]
    
    let currentIndex = 0
    switch (shipment.status) {
      case "Pending": currentIndex = 1; break;
      case "In Transit": currentIndex = 3; break;
      case "Customs Clearance": currentIndex = 4; break;
      case "Delivered": currentIndex = 6; break;
      case "Completed": currentIndex = 7; break;
      case "Delayed": currentIndex = 3; break; // In Transit but delayed
      case "Cancelled": currentIndex = -1; break;
    }

    if (shipment.status === "Cancelled") {
      return [
        { label: "Created", date: new Date(shipment.createdAt).toLocaleDateString(), status: "completed" },
        { label: "Cancelled", description: "Shipment was cancelled.", status: "error" }
      ]
    }

    return statuses.map((label, index) => {
      let status: TimelineStep["status"] = "pending"
      if (index < currentIndex) status = "completed"
      else if (index === currentIndex) status = shipment.status === "Delayed" ? "error" : "current"

      let date = undefined
      if (label === "Created") date = new Date(shipment.createdAt).toLocaleDateString()
      if (label === "Departed" && index <= currentIndex) date = new Date(shipment.departureDate).toLocaleDateString()
      if (label === "Arrived" && index <= currentIndex) date = new Date(shipment.expectedArrivalDate).toLocaleDateString()

      return { label, status, date }
    })
  }

  const daysRemaining = Math.max(0, Math.ceil((new Date(shipment.expectedArrivalDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title={`Shipment ${shipment.id}`}
        description={`Manage tracking, documents, and customs for ${shipment.clientName}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={shipment.status} className="text-sm px-3 py-1" />
            <Button variant="default" onClick={() => router.push(`/shipments/${shipment.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Shipment
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Summary & Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Shipment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Client</p>
                <p className="text-lg font-semibold">{shipment.clientName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">{shipment.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Container No.</p>
                  <p className="text-sm font-mono">{shipment.containerNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Carrier</p>
                  <p className="text-sm font-medium flex items-center gap-1"><Ship className="h-3 w-3" /> {shipment.carrier}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">BOL No.</p>
                  <p className="text-sm font-mono">{shipment.billOfLading}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{shipment.originCountry}</span>
                  <span className="text-sm font-medium text-muted-foreground">→</span>
                  <span className="text-sm font-medium">{shipment.destinationCountry}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(shipment.departureDate).toLocaleDateString()}</span>
                  <span>{new Date(shipment.expectedArrivalDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline steps={generateTimelineSteps()} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats, Details, Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">ETA</p>
                <h3 className="text-xl font-bold">{daysRemaining} Days</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Documents</p>
                <h3 className="text-xl font-bold text-primary">4 / 4</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">BOE Status</p>
                <h3 className="text-xl font-bold text-success">Cleared</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Invoices</p>
                <h3 className="text-xl font-bold text-warning">Pending</h3>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cargo Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/90">{shipment.cargoDescription}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Weight</p>
                  <p className="text-sm font-medium">{shipment.totalWeight.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Packages</p>
                  <p className="text-sm font-medium">{shipment.numberOfPackages}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Port of Loading</p>
                  <p className="text-sm font-medium truncate" title={shipment.portOfLoading}>{shipment.portOfLoading}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Port of Discharge</p>
                  <p className="text-sm font-medium truncate" title={shipment.portOfDestination}>{shipment.portOfDestination}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="bg-card">
              <RefreshCw className="mr-2 h-4 w-4" /> Update Status
            </Button>
            <Button variant="outline" className="bg-card">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
            </Button>
            <Button variant="outline" className="bg-card text-primary border-primary/20 hover:bg-primary/10">
              <FileCheck className="mr-2 h-4 w-4" /> Generate BOE
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium mb-2">Internal Notes</h4>
                  <p className="text-sm text-muted-foreground">{shipment.notes}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {["Commercial Invoice", "Packing List", "Bill of Lading", "Certificate of Origin"].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc}</p>
                            <p className="text-xs text-muted-foreground">Uploaded {i + 1} days ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>No invoices generated yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>Activity log is empty.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  )
}
