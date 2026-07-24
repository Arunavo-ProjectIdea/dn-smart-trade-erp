"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBriefcase, faEnvelope, faCircleUser } from "@fortawesome/free-solid-svg-icons";

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
      header: "Employee",
      accessorKey: "fullName",
      sortable: true,
      cell: (item) => (
        <div className="flex flex-col justify-center py-1">
          <Link href={`/employees/${item.id}`} className="font-semibold text-foreground hover:underline hover:text-primary transition-colors">
            {item.fullName}
          </Link>
          <span className="font-mono text-xs text-muted-foreground mt-0.5">{item.id}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[200px] lg:max-w-[250px]">{item.email}</span>
        </div>
      )
    },
    {
      header: "Department",
      accessorKey: "department",
      sortable: true,
      cell: (item) => (
        <div className="flex h-full items-center">
          <span className="max-w-[100px] lg:max-w-[120px] truncate" title={item.department}>
            {item.department}
          </span>
        </div>
      )
    },
    {
      header: "Role",
      accessorKey: "role",
      sortable: true,
      cell: (item) => (
        <div className="flex h-full items-center">
          <span className={`font-medium ${item.role === 'Admin' ? 'text-primary' : 'text-muted-foreground'}`}>{item.role}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => (
        <div className="flex h-full items-center">
          <StatusBadge status={item.status} />
        </div>
      )
    },
    {
      header: "Manage",
      cell: (item) => (
        <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap flex-nowrap w-[260px]">
          <Link 
            href={`/employees/${item.id}`}
            className={buttonVariants({ variant: "ghost", size: "xs" })}
          >
            View
          </Link>
          <Link 
            href={`/employees/${item.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "xs" })}
          >
            Edit
          </Link>
          <Button 
            variant="secondary" 
            size="xs" 
            onClick={() => setResetId(item.id)}
          >
            Reset
          </Button>
          <Button 
            variant="destructive" 
            size="xs" 
            disabled={item.status === 'Inactive'}
            onClick={() => setDeactivateId(item.id)}
          >
            {item.status === 'Active' ? "Deactivate" : "Inactive"}
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
                <div className="flex items-center gap-2">
                  <Link href={`/employees/${emp.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Edit
                  </Link>
                  <Link href={`/employees/${emp.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    View
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
