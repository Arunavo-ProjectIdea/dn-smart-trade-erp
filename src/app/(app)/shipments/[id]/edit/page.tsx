"use client"

import { useState } from "react"
import { notFound, useRouter, useParams } from "next/navigation"

import { FormLayout } from "@/components/erp/form-layout"
import { PageHeader } from "@/components/erp/page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockClients } from "@/lib/mock-data/clients"
import { mockShipments } from "@/lib/mock-data/shipments"

export default function EditShipmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const shipment = mockShipments.find((s) => s.id === id)

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!shipment && id) {
    notFound()
  }

  if (!shipment) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Shipment updated successfully!")
      router.push(`/shipments/${shipment.id}`)
    }, 800)
  }

  const handleCancel = () => {
    router.push(`/shipments/${shipment.id}`)
  }

  // Format dates for input[type="date"]
  const formatForDateInput = (isoString: string) => {
    return new Date(isoString).toISOString().split('T')[0]
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title={`Edit Shipment ${shipment.id}`} 
        description={`Update logistics record for ${shipment.clientName}`}
      />
      
      <FormLayout
        title="Shipment Details"
        description="Update the core logistics and tracking information."
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        saveText="Save Changes"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="shipmentId">Shipment ID</Label>
            <Input 
              id="shipmentId" 
              defaultValue={shipment.id} 
              readOnly 
              className="bg-muted font-mono text-muted-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select required defaultValue={shipment.clientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Shipment Type *</Label>
            <Select required defaultValue={shipment.type}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Import">Import</SelectItem>
                <SelectItem value="Export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Current Status *</Label>
            <Select required defaultValue={shipment.status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="containerNumber">Container Number *</Label>
            <Input id="containerNumber" defaultValue={shipment.containerNumber} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billOfLading">Bill of Lading (BOL) *</Label>
            <Input id="billOfLading" defaultValue={shipment.billOfLading} required />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Routing & Carrier</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="originCountry">Origin Country *</Label>
            <Input id="originCountry" defaultValue={shipment.originCountry} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationCountry">Destination Country *</Label>
            <Input id="destinationCountry" defaultValue={shipment.destinationCountry} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfLoading">Port of Loading *</Label>
            <Input id="portOfLoading" defaultValue={shipment.portOfLoading} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfDestination">Port of Destination *</Label>
            <Input id="portOfDestination" defaultValue={shipment.portOfDestination} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier / Vessel *</Label>
            <Input id="carrier" defaultValue={shipment.carrier} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingLine">Shipping Line</Label>
            <Input id="shippingLine" defaultValue={shipment.shippingLine} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureDate">Departure Date *</Label>
            <Input id="departureDate" type="date" defaultValue={formatForDateInput(shipment.departureDate)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedArrivalDate">Expected Arrival Date (ETA) *</Label>
            <Input id="expectedArrivalDate" type="date" defaultValue={formatForDateInput(shipment.expectedArrivalDate)} required />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Cargo Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cargoDescription">Cargo Description *</Label>
            <Textarea id="cargoDescription" defaultValue={shipment.cargoDescription} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalWeight">Total Weight (kg) *</Label>
            <Input id="totalWeight" type="number" min="0" defaultValue={shipment.totalWeight} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfPackages">Number of Packages *</Label>
            <Input id="numberOfPackages" type="number" min="1" defaultValue={shipment.numberOfPackages} required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea id="notes" defaultValue={shipment.notes} />
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
