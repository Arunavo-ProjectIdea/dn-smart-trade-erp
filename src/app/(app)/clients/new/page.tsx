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
          <div className="relative mt-2">
            <Input id="companyName" placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="companyName" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Company Name *</Label>
          </div>
          
          <div className="relative mt-2">
            <Input id="contactPerson" placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="contactPerson" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Contact Person *</Label>
          </div>
          
          <div className="relative mt-2">
            <Input id="email" type="email" placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="email" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Email Address *</Label>
          </div>
          
          <div className="relative mt-2">
            <Input id="phone" type="tel" placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="phone" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Phone Number *</Label>
          </div>

          <div className="relative mt-2 md:col-span-2">
            <Input id="address" placeholder=" " className="peer pt-5 pb-1 h-12" />
            <Label htmlFor="address" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Registered Address</Label>
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
