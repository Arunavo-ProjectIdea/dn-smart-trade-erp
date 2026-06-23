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

export default function AddClientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/clients")
    }, 800)
  }

  const handleCancel = () => {
    router.push("/clients")
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="Add New Client" 
        description="Enter the details of the new client to add them to the system."
      />
      
      <FormLayout
        title="Client Information"
        description="Please provide accurate business and contact details."
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        saveText="Create Client"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input id="companyName" placeholder="e.g. Acme Corp" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input id="contactPerson" placeholder="Full Name" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" placeholder="contact@company.com" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Registered Address</Label>
            <Input id="address" placeholder="123 Business St, City, Country" />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type *</Label>
            <Select required defaultValue="Importer">
              <SelectTrigger id="clientType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Importer">Importer</SelectItem>
                <SelectItem value="Exporter">Exporter</SelectItem>
                <SelectItem value="Both">Both (Importer & Exporter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tradeLicense">Trade License Number</Label>
            <Input id="tradeLicense" placeholder="TL-XXXXXXXX" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="binNumber">BIN Number</Label>
            <Input id="binNumber" placeholder="BIN-XXXXXXX" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tinNumber">TIN Number</Label>
            <Input id="tinNumber" placeholder="TIN-XXXXXXX" />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="space-y-2">
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Add any special instructions or negotiated terms here..." 
            className="min-h-[100px]"
          />
        </div>
      </FormLayout>
    </div>
  )
}
