"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Copy } from "lucide-react"

import { FormLayout } from "@/components/erp/form-layout"
import { PageHeader } from "@/components/erp/page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthService } from "@/lib/auth"

export default function AddEmployeePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Client-side role protection
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.role !== "Admin") {
      router.push("/dashboard")
    }
  }, [router])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/employees")
    }, 800)
  }

  const handleCancel = () => {
    router.push("/employees")
  }

  const copyToClipboard = (text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text)
      // Visual feedback could go here, omitting for simplicity
    }
  }

  // Pre-generated mock password
  const [tempPassword] = useState(() => "TEMP-" + Math.random().toString(36).substring(2, 8).toUpperCase());

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="Add New Employee" 
        description="Create a new staff account and generate their initial credentials."
      />
      
      <FormLayout
        title="Employee Profile"
        description="Enter the personal and departmental details."
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        saveText="Create Employee"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" placeholder="e.g. John Doe" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Work Email *</Label>
            <Input id="email" type="email" placeholder="john.doe@dnsmarttrade.com" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select required defaultValue="Logistics">
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                <SelectItem value="Client Relations">Client Relations</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="IT & Systems">IT & Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Role & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role">System Role *</Label>
            <Select required defaultValue="Employee">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Admins have unrestricted system access including employee management.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select required defaultValue="Active">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Account Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="jdoe" />
            <p className="text-xs text-muted-foreground mt-1">
              Auto-generated if left blank.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <div className="flex space-x-2">
              <Input 
                id="password" 
                value={tempPassword} 
                readOnly 
                className="bg-muted font-mono"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(tempPassword)}
                title="Copy password"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              The employee will be forced to reset this upon first login.
            </p>
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
