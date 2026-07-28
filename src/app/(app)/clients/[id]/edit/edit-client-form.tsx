"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatClientId } from "@/lib/utils"

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
import { Client } from "@/lib/mock-data/clients"
import { updateClientAction } from "../../actions"
import { toast } from "sonner"

export function EditClientForm({ client }: { client: Client }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    companyName: client.companyName || "",
    contactPerson: client.contactPerson || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    clientType: client.clientType || "Importer",
    tradeLicenseNumber: client.tradeLicenseNumber || "",
    binNumber: client.binNumber || "",
    tinNumber: client.tinNumber || "",
    notes: client.notes || "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await updateClientAction(client.id, {
      ...formData,
      clientType: formData.clientType as "Importer" | "Exporter" | "Both"
    })

    setIsSubmitting(false)
    
    if (error) {
      toast.error("Failed to update client")
    } else {
      toast.success("Client updated successfully")
      router.push(`/clients/${client.id}`)
      router.refresh()
    }
  }

  const handleCancel = () => {
    router.push(`/clients/${client.id}`)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader
        title={`Edit ${client.companyName}`}
        description={`Client ID: ${formatClientId(client.id)} — Update client information below.`}
      />

      <FormLayout
        title="Client Information"
        description="Update the business and contact details for this client."
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        saveText="Save Changes"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative mt-2">
            <Input
              id="companyName"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              required
            />
            <Label htmlFor="companyName" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              Company Name *
            </Label>
          </div>

          <div className="relative mt-2">
            <Input
              id="contactPerson"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              required
            />
            <Label htmlFor="contactPerson" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              Contact Person *
            </Label>
          </div>

          <div className="relative mt-2">
            <Input
              id="email"
              type="email"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
            <Label htmlFor="email" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              Email Address *
            </Label>
          </div>

          <div className="relative mt-2">
            <Input
              id="phone"
              type="tel"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
            <Label htmlFor="phone" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              Phone Number *
            </Label>
          </div>

          <div className="relative mt-2 md:col-span-2">
            <Input
              id="address"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <Label htmlFor="address" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              Registered Address
            </Label>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type *</Label>
            <Select
              value={formData.clientType}
              onValueChange={(val) => val && handleChange("clientType", val)}
            >
              <SelectTrigger id="clientType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Importer">Importer</SelectItem>
                <SelectItem value="Exporter">Exporter</SelectItem>
                <SelectItem value="Both">Both (Importer &amp; Exporter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mt-2">
            <Input
              id="tradeLicense"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.tradeLicenseNumber}
              onChange={(e) => handleChange("tradeLicenseNumber", e.target.value)}
            />
            <Label htmlFor="tradeLicense" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              Trade License Number
            </Label>
          </div>

          <div className="relative mt-2">
            <Input
              id="binNumber"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.binNumber}
              onChange={(e) => handleChange("binNumber", e.target.value)}
            />
            <Label htmlFor="binNumber" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              BIN Number
            </Label>
          </div>

          <div className="relative mt-2">
            <Input
              id="tinNumber"
              placeholder=" "
              className="peer pt-5 pb-1 h-12"
              value={formData.tinNumber}
              onChange={(e) => handleChange("tinNumber", e.target.value)}
            />
            <Label htmlFor="tinNumber" className="absolute left-3 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary">
              TIN Number
            </Label>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="space-y-2">
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any special instructions or negotiated terms here..."
            className="min-h-[100px]"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>
      </FormLayout>
    </div>
  )
}
