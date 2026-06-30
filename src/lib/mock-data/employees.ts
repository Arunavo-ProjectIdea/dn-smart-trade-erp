import { StatusType } from "@/components/erp/status-badge"
import { UserRole } from "@/lib/auth"

export interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  department: string
  designation: string
  joiningDate: string
  address: string
  emergencyContact: string
  role: UserRole
  status: StatusType
  username: string
  lastLogin: string
  createdAt: string
  assignedClients: number
  activeShipments: number
  completedShipments: number
  pendingTasks: number
  documentsProcessed: number
}

export const mockEmployees: Employee[] = [
  {
    id: "EMP-1001",
    fullName: "Jane Doe",
    email: "jane.doe@dnsmarttrade.com",
    phone: "+1 (555) 102-3921",
    department: "Logistics",
    designation: "Senior Logistics Coordinator",
    joiningDate: "2024-01-15",
    address: "123 Port Authority Way, Suite 400, New York, NY 10001",
    emergencyContact: "John Doe: +1 (555) 982-1122",
    role: "Employee",
    status: "Active",
    username: "jdoe",
    lastLogin: "2026-06-24T08:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    assignedClients: 12,
    activeShipments: 45,
    completedShipments: 340,
    pendingTasks: 8,
    documentsProcessed: 890,
  },
  {
    id: "EMP-1002",
    fullName: "System Administrator",
    email: "admin@dnsmarttrade.com",
    phone: "+1 (555) 000-0001",
    department: "IT & Systems",
    designation: "Lead Systems Architect",
    joiningDate: "2023-11-01",
    address: "Server Room 1, HQ",
    emergencyContact: "IT Support: +1 (555) 000-9999",
    role: "Admin",
    status: "Active",
    username: "admin",
    lastLogin: "2026-06-24T09:15:00Z",
    createdAt: "2023-11-01T09:00:00Z",
    assignedClients: 0,
    activeShipments: 0,
    completedShipments: 0,
    pendingTasks: 2,
    documentsProcessed: 0,
  },
  {
    id: "EMP-1003",
    fullName: "Michael Chen",
    email: "m.chen@dnsmarttrade.com",
    phone: "+1 (555) 839-2019",
    department: "Customs Clearance",
    designation: "Customs Broker",
    joiningDate: "2024-03-20",
    address: "456 Trade Center Blvd, San Francisco, CA 94105",
    emergencyContact: "Sarah Chen: +1 (555) 112-9938",
    role: "Employee",
    status: "Probation",
    username: "mchen",
    lastLogin: "2026-06-23T16:45:00Z",
    createdAt: "2024-03-20T11:30:00Z",
    assignedClients: 8,
    activeShipments: 22,
    completedShipments: 45,
    pendingTasks: 12,
    documentsProcessed: 432,
  },
  {
    id: "EMP-1004",
    fullName: "Sarah Johnson",
    email: "s.johnson@dnsmarttrade.com",
    phone: "+44 20 7123 9988",
    department: "Client Relations",
    designation: "VP of Client Relations",
    joiningDate: "2025-02-10",
    address: "789 Enterprise Lane, London, UK EC1A 1BB",
    emergencyContact: "Mark Johnson: +44 7700 900077",
    role: "Admin",
    status: "Active",
    username: "sjohnson",
    lastLogin: "2026-06-24T07:20:00Z",
    createdAt: "2025-02-10T14:15:00Z",
    assignedClients: 35,
    activeShipments: 120,
    completedShipments: 890,
    pendingTasks: 4,
    documentsProcessed: 1205,
  },
  {
    id: "EMP-1005",
    fullName: "David Wilson",
    email: "dwilson@dnsmarttrade.com",
    phone: "+1 (555) 443-2910",
    department: "Logistics",
    designation: "Logistics Analyst",
    joiningDate: "2024-08-05",
    address: "321 Supply Chain Rd, Chicago, IL 60601",
    emergencyContact: "Emily Wilson: +1 (555) 887-3321",
    role: "Employee",
    status: "On Leave",
    username: "dwilson",
    lastLogin: "2026-01-10T10:20:00Z",
    createdAt: "2024-08-05T09:45:00Z",
    assignedClients: 0,
    activeShipments: 0,
    completedShipments: 120,
    pendingTasks: 0,
    documentsProcessed: 310,
  },
]

// Generate additional generic employees for pagination testing
const departments = ["Logistics", "Customs Clearance", "Client Relations", "Finance", "IT & Systems"]
const designations = ["Coordinator", "Specialist", "Analyst", "Manager", "Director"]

for (let i = 6; i <= 30; i++) {
  const isInactive = i % 8 === 0
  const isProbation = i % 11 === 0
  const isOnLeave = i % 14 === 0
  
  let status: StatusType = "Active"
  if (isInactive) status = "Inactive"
  else if (isProbation) status = "Probation"
  else if (isOnLeave) status = "On Leave"

  mockEmployees.push({
    id: `EMP-10${i.toString().padStart(2, '0')}`,
    fullName: `Employee User ${i}`,
    email: `emp${i}@dnsmarttrade.com`,
    phone: `+1 (555) 100-${2000 + i}`,
    department: departments[i % departments.length],
    designation: `${departments[i % departments.length]} ${designations[i % designations.length]}`,
    joiningDate: `2025-0${Math.max(1, 9 - (i % 9))}-15`,
    address: `${1000 + i} Corporate Blvd, Metropolis`,
    emergencyContact: `Contact ${i}: +1 (555) 999-000${i}`,
    role: i % 10 === 0 ? "Admin" : "Employee",
    status,
    username: `empuser${i}`,
    lastLogin: `2026-06-${Math.max(1, 24 - (i % 10)).toString().padStart(2, '0')}T09:00:00Z`,
    createdAt: `2025-0${Math.max(1, 9 - (i % 9))}T10:00:00Z`,
    assignedClients: isInactive ? 0 : (i % 5) + 2,
    activeShipments: isInactive ? 0 : i * 3,
    completedShipments: isInactive ? 0 : i * 15,
    pendingTasks: isInactive ? 0 : (i % 4),
    documentsProcessed: i * 45,
  })
}
