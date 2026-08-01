import { Employee, UserRole } from "@/types/employee"
import { StatusType } from "@/components/erp/status-badge"

type ProfileLike = {
  id: string
  full_name?: string | null
  email?: string | null
  phone?: string | null
  department?: string | null
  designation?: string | null
  role?: string | null
  status?: string | null
  username?: string | null
  last_login?: string | null
  created_at?: string | null
}

export function mapProfileToEmployee(profile: ProfileLike): Employee {
  return {
    id: profile.id,
    fullName: profile.full_name || "Unknown",
    email: profile.email || "",
    phone: profile.phone || "",
    department: profile.department || "",
    designation: profile.designation || "",
    role: (profile.role as UserRole) || "Employee",
    status: (profile.status as StatusType) || "Active",
    username: profile.username || profile.email?.split('@')[0] || "",
    lastLogin: profile.last_login || profile.created_at || new Date().toISOString(),
    createdAt: profile.created_at || new Date().toISOString(),
    // Live data not implemented yet, so we return 0 for now
    assignedClients: 0,
    activeShipments: 0,
    documentsProcessed: 0,
  }
}
