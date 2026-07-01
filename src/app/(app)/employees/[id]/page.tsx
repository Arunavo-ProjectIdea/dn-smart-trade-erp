"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { Building, Mail, Phone, Calendar, Clock, KeyRound, UserX, Pencil, Briefcase } from "lucide-react"

import { PageHeader } from "@/components/erp/page-header"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mockEmployees } from "@/lib/mock-data/employees"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { AuthService } from "@/lib/auth"
import { use } from "react"

interface EmployeeDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EmployeeDetailsPage({ params }: EmployeeDetailsPageProps) {
  const unwrappedParams = use(params)
  const id = decodeURIComponent(unwrappedParams.id)
  const { toast } = useToast()
  const router = useRouter()
  const employee = mockEmployees.find((e) => e.id === id)
  
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)


  // Client-side role protection
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.role !== "Admin") {
      router.push("/dashboard")
    }
  }, [router])

  if (!employee) {
    notFound()
  }

  const handleDeactivate = () => {
    setTimeout(() => {
      setDeactivateOpen(false)
      toast({ title: "Employee deactivated", description: "Employee deactivated successfully." })
      // In a real app we'd redirect or mutate the data
      router.push("/employees")
    }, 800)
  }

  const handleResetPassword = () => {
    toast({ title: "Password Reset", description: `Password reset link sent to ${employee.email}` })
    setResetOpen(false)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title={employee.fullName} 
        description={`Employee ID: ${employee.id}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={employee.status} />
            <Link href={`/employees/${employee.id}/edit`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Personal and departmental details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Work Email</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{employee.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-muted-foreground">{employee.department}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">System Role</p>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>System access and credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium">Username</p>
              <p className="text-sm text-muted-foreground font-mono">{employee.username}</p>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(employee.lastLogin).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href={`/clients?employee=${employee.id}`} className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                Assigned Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.assignedClients}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/shipments?employee=${employee.id}`} className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                Active Shipments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.activeShipments}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/documents?employee=${employee.id}`} className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                Documents Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.documentsProcessed}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="my-2 border-t border-border" />

      <div className="flex flex-wrap gap-4">
        <Button variant="default" onClick={() => setResetOpen(true)}>
          <KeyRound className="mr-2 h-4 w-4" /> Reset Password
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => setDeactivateOpen(true)}
          disabled={employee.status === "Inactive"}
        >
          <UserX className="mr-2 h-4 w-4" /> Deactivate Account
        </Button>
      </div>

      {/* Action Dialogs */}
      <ConfirmationDialog 
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate Account"
        description={`Are you sure you want to deactivate ${employee.fullName}'s account? They will lose all system access immediately.`}
        confirmText="Deactivate Employee"
        variant="destructive"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateOpen(false)}
      />

      <ConfirmationDialog 
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset Password"
        description={`This will send a secure password reset link to ${employee.email}. They will be forced to choose a new password upon login.`}
        confirmText="Send Link"
        variant="default"
        onConfirm={handleResetPassword}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  )
}
