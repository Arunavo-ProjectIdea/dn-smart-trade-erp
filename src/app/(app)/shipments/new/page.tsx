"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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

export default function CreateShipmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/shipments")
    }, 800)
  }

  const handleCancel = () => {
    router.push("/shipments")
  }

  // Pre-generated mock shipment ID
  const tempShipmentId = `SHP-${Math.floor(Math.random() * 9000) + 1000}`

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="Create New Shipment" 
        description="Initialize a new import or export logistics record."
      />
      
      <FormLayout
        title="Shipment Details"
        description="Enter the core logistics and tracking information."
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        saveText="Save Shipment"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="shipmentId">Shipment ID</Label>
            <Input 
              id="shipmentId" 
              defaultValue={tempShipmentId} 
              readOnly 
              className="bg-muted font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated system identifier.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select required>
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
            <Select required defaultValue="Import">
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
            <Select required defaultValue="Pending">
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
            <Input id="containerNumber" placeholder="e.g. CONT1234567" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billOfLading">Bill of Lading (BOL) *</Label>
            <Input id="billOfLading" placeholder="e.g. BOL-98765" required />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Routing & Carrier</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="originCountry">Origin Country *</Label>
            <Input id="originCountry" placeholder="e.g. China" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationCountry">Destination Country *</Label>
            <Input id="destinationCountry" placeholder="e.g. USA" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfLoading">Port of Loading *</Label>
            <Input id="portOfLoading" placeholder="e.g. Shanghai Port" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portOfDestination">Port of Destination *</Label>
            <Input id="portOfDestination" placeholder="e.g. Port of Los Angeles" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier / Vessel *</Label>
            <Input id="carrier" placeholder="e.g. MSC" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingLine">Shipping Line</Label>
            <Input id="shippingLine" placeholder="e.g. MSC Line" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureDate">Departure Date *</Label>
            <Input id="departureDate" type="date" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedArrivalDate">Expected Arrival Date (ETA) *</Label>
            <Input id="expectedArrivalDate" type="date" required />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Cargo Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cargoDescription">Cargo Description *</Label>
            <Textarea id="cargoDescription" placeholder="Detailed description of the goods..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalWeight">Total Weight (kg) *</Label>
            <Input id="totalWeight" type="number" min="0" placeholder="e.g. 15000" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfPackages">Number of Packages *</Label>
            <Input id="numberOfPackages" type="number" min="1" placeholder="e.g. 150" required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea id="notes" placeholder="Any special handling instructions or internal notes..." />
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
