import { StatusType } from "@/components/erp/status-badge"
import { UserRole } from "@/lib/auth"

export interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  department: string
  role: UserRole
  status: StatusType
  username: string
  lastLogin: string
  createdAt: string
  assignedClients: number
  activeShipments: number
  documentsProcessed: number
}

export const mockEmployees: Employee[] = [
  {
    id: "EMP-1001",
    fullName: "Jane Doe",
    email: "jane.doe@dnsmarttrade.com",
    phone: "+1 (555) 102-3921",
    department: "Logistics",
    role: "Employee",
    status: "Active",
    username: "jdoe",
    lastLogin: "2026-06-24T08:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    assignedClients: 12,
    activeShipments: 45,
    documentsProcessed: 890,
  },
  {
    id: "EMP-1002",
    fullName: "System Administrator",
    email: "admin@dnsmarttrade.com",
    phone: "+1 (555) 000-0001",
    department: "IT & Systems",
    role: "Admin",
    status: "Active",
    username: "admin",
    lastLogin: "2026-06-24T09:15:00Z",
    createdAt: "2023-11-01T09:00:00Z",
    assignedClients: 0,
    activeShipments: 0,
    documentsProcessed: 0,
  },
  {
    id: "EMP-1003",
    fullName: "Michael Chen",
    email: "m.chen@dnsmarttrade.com",
    phone: "+1 (555) 839-2019",
    department: "Customs Clearance",
    role: "Employee",
    status: "Active",
    username: "mchen",
    lastLogin: "2026-06-23T16:45:00Z",
    createdAt: "2024-03-20T11:30:00Z",
    assignedClients: 8,
    activeShipments: 22,
    documentsProcessed: 432,
  },
  {
    id: "EMP-1004",
    fullName: "Sarah Johnson",
    email: "s.johnson@dnsmarttrade.com",
    phone: "+44 20 7123 9988",
    department: "Client Relations",
    role: "Admin",
    status: "Active",
    username: "sjohnson",
    lastLogin: "2026-06-24T07:20:00Z",
    createdAt: "2025-02-10T14:15:00Z",
    assignedClients: 35,
    activeShipments: 120,
    documentsProcessed: 1205,
  },
  {
    id: "EMP-1005",
    fullName: "David Wilson",
    email: "dwilson@dnsmarttrade.com",
    phone: "+1 (555) 443-2910",
    department: "Logistics",
    role: "Employee",
    status: "Inactive",
    username: "dwilson",
    lastLogin: "2026-01-10T10:20:00Z",
    createdAt: "2024-08-05T09:45:00Z",
    assignedClients: 0,
    activeShipments: 0,
    documentsProcessed: 310,
  },
]

// Generate additional generic employees for pagination testing
const departments = ["Logistics", "Customs Clearance", "Client Relations", "Finance", "IT & Systems"]

for (let i = 6; i <= 30; i++) {
  const isInactive = i % 8 === 0
  mockEmployees.push({
    id: `EMP-10${i.toString().padStart(2, '0')}`,
    fullName: `Employee User ${i}`,
    email: `emp${i}@dnsmarttrade.com`,
    phone: `+1 (555) 100-${2000 + i}`,
    department: departments[i % departments.length],
    role: i % 10 === 0 ? "Admin" : "Employee",
    status: isInactive ? "Inactive" : "Active",
    username: `empuser${i}`,
    lastLogin: `2026-06-${Math.max(1, 24 - (i % 10)).toString().padStart(2, '0')}T09:00:00Z`,
    createdAt: `2025-0${Math.max(1, 9 - (i % 9))}T10:00:00Z`,
    assignedClients: isInactive ? 0 : (i % 5) + 2,
    activeShipments: isInactive ? 0 : i * 3,
    documentsProcessed: i * 45,
  })
}
