"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCircle, faPlus, faBriefcase, faEnvelope, faCircleUser } from "@fortawesome/free-solid-svg-icons";

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { ViewToggle } from "@/components/erp/view-toggle"
import { mockEmployees, Employee } from "@/lib/mock-data/employees"
import { useToast } from "@/components/ui/use-toast"
import { AuthService } from "@/lib/auth"

export default function EmployeesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [data, setData] = useState<Employee[]>(mockEmployees)
  
  // Dialog States
  const [deactivateId, setDeactivateId] = useState<string | null>(null)
  const [resetId, setResetId] = useState<string | null>(null)

  // Client-side role protection
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.role !== "Admin") {
      router.push("/dashboard")
    }
  }, [router])

  const handleDeactivate = () => {
    if (deactivateId) {
      setData(data.map(emp => emp.id === deactivateId ? { ...emp, status: "Inactive" } : emp))
      setDeactivateId(null)
    }
  }

  const handleResetPassword = () => {
    if (resetId) {
      toast({ title: "Password Reset", description: `Password reset link sent to employee ID: ${resetId}` })
      setResetId(null)
    }
  }

  const columns: ColumnDef<Employee>[] = [
    {
      header: "Employee ID",
      accessorKey: "id",
      sortable: true,
      cell: (item) => <span className="font-mono text-sm">{item.id}</span>
    },
    {
      header: "Full Name",
      accessorKey: "fullName",
      sortable: true,
      cell: (item) => (
        <div className="font-medium">
          {item.fullName}
        </div>
      )
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
    },
    {
      header: "Department",
      accessorKey: "department",
      sortable: true,
    },
    {
      header: "Role",
      accessorKey: "role",
      sortable: true,
      cell: (item) => <span className={`font-medium ${item.role === 'Admin' ? 'text-primary' : 'text-muted-foreground'}`}>{item.role}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => <StatusBadge status={item.status} />
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link 
            href={`/employees/${item.id}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="View Employee"
          >
            <FontAwesomeIcon icon={faEye} className="size-4" />
            <span className="sr-only">View</span>
          </Link>
          <Link 
            href={`/employees/${item.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground" })}
            title="Edit Employee"
          >
            <FontAwesomeIcon icon={faCircle} className="size-4" />
            <span className="sr-only">Edit</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-warning"
            title="Reset Password"
            onClick={() => setResetId(item.id)}
          >
            <FontAwesomeIcon icon={faCircle} className="size-4" />
            <span className="sr-only">Reset Password</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title={item.status === 'Active' ? "Deactivate Employee" : "Already Inactive"}
            disabled={item.status === 'Inactive'}
            onClick={() => setDeactivateId(item.id)}
          >
            <FontAwesomeIcon icon={faCircle} className="size-4" />
            <span className="sr-only">Deactivate</span>
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Employee Management" 
        description="Manage system access, roles, and profiles for all internal staff."
        action={
          <Link href="/employees/new" className={buttonVariants({ variant: "default", className: "shadow-sm" })}>
            <FontAwesomeIcon icon={faPlus} className="mr-2 size-4" /> Add Employee
          </Link>
        }
      />
      
      <div className="flex justify-end -mt-4 mb-2">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {viewMode === "table" ? (
        <DataTable 
          columns={columns} 
          data={data} 
          searchKey="fullName"
          searchPlaceholder="Search employees..."
          emptyStateTitle="No employees found"
          emptyStateDescription="Get started by adding a new employee to the system."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((emp) => (
            <Card key={emp.id} className="group relative transition-all duration-300 hover:shadow-card hover:border-border/80">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={faCircleUser} className="h-5 w-5" />
                  </div>
                  <StatusBadge status={emp.status} />
                </div>
                <CardTitle className="mt-4 truncate">
                  <Link href={`/employees/${emp.id}`} className="hover:underline hover:text-primary transition-colors">
                    {emp.fullName}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="font-mono text-xs">{emp.id}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className={emp.role === 'Admin' ? 'text-primary font-medium' : ''}>{emp.role}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FontAwesomeIcon icon={faBriefcase} className="h-4 w-4 shrink-0" />
                    <span>{emp.department}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-end border-t border-border/40 bg-muted/10 p-4 rounded-b-[14px]">
                <div className="flex items-center gap-1">
                  <Link href={`/employees/${emp.id}`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-foreground" })}>
                    <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                  </Link>
                  <Link href={`/employees/${emp.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-foreground" })}>
                    <FontAwesomeIcon icon={faCircle} className="h-4 w-4" />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ConfirmationDialog 
        open={!!deactivateId}
        onOpenChange={(open) => !open && setDeactivateId(null)}
        title="Deactivate Account"
        description="Are you sure you want to deactivate this employee's account? They will lose all access to the system immediately."
        confirmText="Deactivate"
        variant="destructive"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateId(null)}
      />

      <ConfirmationDialog 
        open={!!resetId}
        onOpenChange={(open) => !open && setResetId(null)}
        title="Reset Password"
        description="This will send a secure password reset link to the employee's registered email address."
        confirmText="Send Reset Link"
        variant="default"
        onConfirm={handleResetPassword}
        onCancel={() => setResetId(null)}
      />
    </div>
  )
}
