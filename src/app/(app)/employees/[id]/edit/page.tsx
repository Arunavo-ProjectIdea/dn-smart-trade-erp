"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

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
import { useToast } from "@/components/ui/use-toast"
import { AuthService } from "@/lib/auth"

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const id = decodeURIComponent(unwrappedParams.id)
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Client-side role protection
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.role !== "Admin") {
      router.push("/dashboard")
    }
  }, [router])

  const employee = mockEmployees.find((e) => e.id === id)

  if (!employee) {
    notFound()
  }

  const [formData, setFormData] = useState({
    fullName: employee.fullName,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    role: employee.role,
    status: employee.status,
    username: employee.username,
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Update mock data in place
    const index = mockEmployees.findIndex((e) => e.id === id)
    if (index !== -1) {
      Object.assign(mockEmployees[index], formData)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Employee Updated",
        description: `${formData.fullName}'s profile has been updated.`,
      })
      router.push(`/employees/${id}`)
      router.refresh()
    }, 600)
  }

  const handleCancel = () => {
    router.push(`/employees/${id}`)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader
        title={`Edit ${employee.fullName}`}
        description={`Employee ID: ${employee.id} — Update employee information below.`}
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
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Work Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(val) => val && handleChange("department", val)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                <SelectItem value="Client Relations">Client Relations</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="IT & Systems">IT &amp; Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <h3 className="font-medium text-lg mb-4">Role &amp; Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role">System Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => val && handleChange("role", val)}
            >
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
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => val && handleChange("status", val)}
            >
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

        <h3 className="font-medium text-lg mb-4">Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
