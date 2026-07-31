import { StatusType } from "@/components/erp/status-badge"

export type UserRole = "Admin" | "Employee" | "Client"

export interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  department: string
  designation: string
  role: UserRole
  status: StatusType
  username: string
  lastLogin: string
  createdAt: string
  assignedClients: number
  activeShipments: number
  documentsProcessed: number
}
