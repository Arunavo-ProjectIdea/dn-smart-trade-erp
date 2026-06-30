"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter, useParams } from "next/navigation"

import { FormLayout } from "@/components/erp/form-layout"
import { PageHeader } from "@/components/erp/page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockEmployees } from "@/lib/mock-data/employees"
import { AuthService } from "@/lib/auth"

export default function EditEmployeePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const employee = mockEmployees.find((e) => e.id === id)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Client-side role protection
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.role !== "Admin") {
      router.push("/dashboard")
    }
  }, [router])

  if (!employee && id) {
    notFound()
  }

  if (!employee) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Employee updated successfully!")
      router.push(`/employees/${employee.id}`)
    }, 800)
  }

  const handleCancel = () => {
    router.push(`/employees/${employee.id}`)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title={`Edit Employee: ${employee.fullName}`} 
        description={`Update system profile for ${employee.id}`}
      />
      
      <FormLayout
        title="Employee Profile"
        description="Update personal and departmental details."
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        saveText="Save Changes"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" defaultValue={employee.fullName} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Work Email *</Label>
            <Input id="email" type="email" defaultValue={employee.email} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" defaultValue={employee.phone} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select required defaultValue={employee.department}>
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

          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Input id="designation" defaultValue={employee.designation} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="joiningDate">Joining Date *</Label>
            <Input id="joiningDate" type="date" defaultValue={employee.joiningDate} required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Residential Address</Label>
            <Input id="address" defaultValue={employee.address} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="emergencyContact">Emergency Contact *</Label>
            <Input id="emergencyContact" defaultValue={employee.emergencyContact} required />
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Role & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role">System Role *</Label>
            <Select required defaultValue={employee.role}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Admins have unrestricted system access.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">System Status</Label>
            <Select required defaultValue={employee.status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Probation">Probation</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
