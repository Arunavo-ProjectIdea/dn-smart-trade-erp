"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

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
import { createClientAction } from "../actions"
import { toast } from "sonner"

export default function AddClientPage() {
  const router = useRouter()
  

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    clientType: "Importer",
    tradeLicenseNumber: "",
    binNumber: "",
    tinNumber: "",
    notes: ""
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const { error } = await createClientAction({
      ...formData,
      status: "Active", // Defaulting new clients to Active
      clientType: formData.clientType as "Importer" | "Exporter" | "Both"
    })

    setIsSubmitting(false)
    if (error) {
      toast.error(typeof error === 'string' ? error : "Failed to create client")
    } else {
      toast.success("Client created successfully")
      router.push("/clients")
    }
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
            <Input id="companyName" value={formData.companyName} onChange={e => setFormData(p => ({...p, companyName: e.target.value}))} placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="companyName" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Company Name *</Label>
          </div>
          
          <div className="relative mt-2">
            <Input id="contactPerson" value={formData.contactPerson} onChange={e => setFormData(p => ({...p, contactPerson: e.target.value}))} placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="contactPerson" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Contact Person *</Label>
          </div>
          
          <div className="relative mt-2">
            <Input id="email" type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="email" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Email Address *</Label>
          </div>
          
          <div className="relative mt-2">
            <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} placeholder=" " className="peer pt-5 pb-1 h-12" required />
            <Label htmlFor="phone" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Phone Number *</Label>
          </div>

          <div className="relative mt-2 md:col-span-2">
            <Input id="address" value={formData.address} onChange={e => setFormData(p => ({...p, address: e.target.value}))} placeholder=" " className="peer pt-5 pb-1 h-12" />
            <Label htmlFor="address" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">Registered Address</Label>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type *</Label>
            <Select required value={formData.clientType} onValueChange={(v) => v && setFormData(p => ({...p, clientType: v}))}>
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
            <Input id="tradeLicense" value={formData.tradeLicenseNumber} onChange={e => setFormData(p => ({...p, tradeLicenseNumber: e.target.value}))} placeholder="TL-XXXXXXXX" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="binNumber">BIN Number</Label>
            <Input id="binNumber" value={formData.binNumber} onChange={e => setFormData(p => ({...p, binNumber: e.target.value}))} placeholder="BIN-XXXXXXX" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tinNumber">TIN Number</Label>
            <Input id="tinNumber" value={formData.tinNumber} onChange={e => setFormData(p => ({...p, tinNumber: e.target.value}))} placeholder="TIN-XXXXXXX" />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="space-y-2">
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea 
            id="notes" 
            value={formData.notes}
            onChange={e => setFormData(p => ({...p, notes: e.target.value}))}
            placeholder="Add any special instructions or negotiated terms here..." 
            className="min-h-[100px]"
          />
        </div>
      </FormLayout>
    </div>
  )
}
