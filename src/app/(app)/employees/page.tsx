"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, Pencil, UserX, Plus, KeyRound } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { StatusBadge } from "@/components/erp/status-badge"
import { ConfirmationDialog } from "@/components/erp/confirmation-dialog"
import { mockEmployees, Employee } from "@/lib/mock-data/employees"
import { AuthService } from "@/lib/auth"

export default function EmployeesPage() {
  const router = useRouter()
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
      alert(`Password reset link sent to employee ID: ${resetId}`)
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
        <div className="flex items-center justify-end gap-1">
          <Link 
            href={`/employees/${item.id}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="View Employee"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
          <Link 
            href={`/employees/${item.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="Edit Employee"
          >
            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Edit</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-warning"
            title="Reset Password"
            onClick={() => setResetId(item.id)}
          >
            <KeyRound className="h-4 w-4" />
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
            <UserX className="h-4 w-4" />
            <span className="sr-only">Deactivate</span>
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Employee Management" 
        description="Manage system access, roles, and profiles for all internal staff."
        action={
          <Link href="/employees/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="fullName"
        searchPlaceholder="Search by employee name..."
        emptyStateTitle="No employees found"
        emptyStateDescription="Get started by adding a new employee to the system."
      />

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
