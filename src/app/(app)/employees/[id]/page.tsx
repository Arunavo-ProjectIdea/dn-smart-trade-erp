"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter, useParams } from "next/navigation"
import {
  Building, Mail, Phone, Calendar, Clock, KeyRound,
  UserX, Pencil, Briefcase, MapPin, User, Activity,
  Package, FileCheck, CheckCircle2, AlertCircle, Trash2
} from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockEmployees } from "@/lib/mock-data/employees"
import { AuthService } from "@/lib/auth"

export default function EmployeeDetailsPage() {
  const router = useRouter()
  const params = useParams()

  // Safely extract the ID from params
  const id = params?.id as string
  const employee = mockEmployees.find((e) => e.id === id)

  // Dialog States
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Client-side role protection
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.role !== "Admin") {
      router.push("/dashboard")
    }
  }, [router])

  // If no employee is found and ID exists, trigger 404
  if (!employee && id) {
    notFound()
  }

  // Prevent rendering if employee is still undefined
  if (!employee) return null

  const handleDeactivate = () => {
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setDeactivateOpen(false)
      alert("Employee deactivated successfully.")
      router.push("/employees")
    }, 800)
  }

  const handleDelete = () => {
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setDeleteOpen(false)
      alert("Employee deleted successfully.")
      router.push("/employees")
    }, 800)
  }

  const handleResetPassword = () => {
    alert(`Password reset link sent to ${employee.email}`)
    setResetOpen(false)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader
        title="Employee Details"
        description={`View and manage profile for ${employee.id}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={employee.status} />
            <Button variant="default" onClick={() => router.push(`/employees/${employee.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Employee
            </Button>
          </div>
        }
      />

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-secondary" />
        <CardContent className="relative pt-0 pb-6 px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-xl bg-primary flex items-center justify-center border-4 border-card text-primary-foreground shadow-sm shrink-0">
              <span className="text-3xl font-bold">{employee.fullName.charAt(0)}</span>
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{employee.fullName}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {employee.designation}</span>
                <span className="flex items-center gap-1.5"><Building className="h-4 w-4" /> {employee.department}</span>
                <span className="flex items-center gap-1.5 text-primary"><User className="h-4 w-4" /> Role: {employee.role}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-border">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Phone Number</p>
                <p className="text-sm font-medium">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Joining Date</p>
                <p className="text-sm font-medium">{new Date(employee.joiningDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Last Login</p>
                <p className="text-sm font-medium">{new Date(employee.lastLogin).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Shipments</p>
                <h3 className="text-2xl font-bold mt-1">{employee.activeShipments}</h3>
              </div>
              <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-xl">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Shipments</p>
                <h3 className="text-2xl font-bold mt-1">{employee.completedShipments}</h3>
              </div>
              <div className="h-10 w-10 bg-success/10 flex items-center justify-center rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                <h3 className="text-2xl font-bold mt-1">{employee.pendingTasks}</h3>
              </div>
              <div className="h-10 w-10 bg-warning/10 flex items-center justify-center rounded-xl">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uploaded Documents</p>
                <h3 className="text-2xl font-bold mt-1">{employee.documentsProcessed}</h3>
              </div>
              <div className="h-10 w-10 bg-secondary flex items-center justify-center rounded-xl">
                <FileCheck className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="shipments">Assigned Shipments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Contact and emergency details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Residential Address</p>
                      <p className="text-sm text-muted-foreground">{employee.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Emergency Contact</p>
                      <p className="text-sm text-muted-foreground">{employee.emergencyContact}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <KeyRound className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">System Username</p>
                      <p className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded inline-block mt-1">{employee.username}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">{new Date(employee.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Shipments</CardTitle>
              <CardDescription>Recent active shipments managed by this employee.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-muted/50">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>Mock Shipments Interface</p>
                <p className="text-sm">In a real application, a DataTable would render here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Files and clearance documents processed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-muted/50">
                <FileCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>Mock Documents Interface</p>
                <p className="text-sm">In a real application, a file browser would render here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent system actions and audits.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { action: "Logged in to the system", time: "2 hours ago", type: "auth" },
                  { action: "Approved Document #DOC-883", time: "5 hours ago", type: "system" },
                  { action: "Assigned to Shipment #SHP-1002", time: "1 day ago", type: "system" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="relative mt-1">
                      <div className={`h-3 w-3 rounded-full ${activity.type === 'auth' ? 'bg-success' : 'bg-primary'} ring-4 ring-background`} />
                      {i !== 2 && <div className="absolute top-3 left-1.5 h-full w-px bg-border -translate-x-1/2" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="my-2 border-t border-border" />

      {/* Action Area */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setResetOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" /> Reset Password
          </Button>
          <Button
            variant="outline"
            className="text-warning border-warning hover:bg-warning/10 hover:text-warning"
            onClick={() => setDeactivateOpen(true)}
            disabled={employee.status === "Inactive"}
          >
            <UserX className="mr-2 h-4 w-4" /> Deactivate Account
          </Button>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete Employee
        </Button>
      </div>

      {/* Action Dialogs */}
      <ConfirmationDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate Account"
        description={`Are you sure you want to deactivate ${employee.fullName}'s account? They will lose all system access immediately.`}
        confirmText={isProcessing ? "Deactivating..." : "Deactivate Employee"}
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

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Employee"
        description={`Are you absolutely sure you want to permanently delete ${employee.fullName}? This action cannot be undone and will permanently remove their data from our servers.`}
        confirmText={isProcessing ? "Deleting..." : "Delete Permanently"}
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
