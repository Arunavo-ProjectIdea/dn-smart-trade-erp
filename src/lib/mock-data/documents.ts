import { mockClients } from "./clients"

export type DocumentCategory = "Shipment Documents" | "BOE Documents" | "Client Documents" | "Financial Documents" | "Compliance Documents"
export type DocumentStatus = "Pending Review" | "Approved" | "Rejected" | "Archived"

export interface DocumentActivity {
  id: string
  action: string
  actor: string
  date: string
}

export interface Document {
  id: string
  name: string
  type: string
  category: DocumentCategory
  clientId: string
  clientName: string
  shipmentId: string
  uploadedBy: string
  uploadDate: string
  lastModified: string
  fileSize: string
  status: DocumentStatus
  description: string
  version: string
  activities: DocumentActivity[]
}

const documentTypes = ["PDF", "XLSX", "DOCX", "JPG", "PNG"]
const categories: DocumentCategory[] = ["Shipment Documents", "BOE Documents", "Client Documents", "Financial Documents", "Compliance Documents"]
const statuses: DocumentStatus[] = ["Pending Review", "Approved", "Rejected", "Archived"]
const employeeNames = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Wilson", "Sarah Brown"]

const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0]

const generateActivities = (status: DocumentStatus, uploadDate: string): DocumentActivity[] => {
  const activities: DocumentActivity[] = [
    { id: Math.random().toString(36).substring(2, 9), action: "Uploaded", actor: employeeNames[Math.floor(Math.random() * employeeNames.length)], date: uploadDate }
  ]
  if (status === "Approved") {
    activities.push({ id: Math.random().toString(36).substring(2, 9), action: "Reviewed", actor: "System Admin", date: uploadDate })
    activities.push({ id: Math.random().toString(36).substring(2, 9), action: "Approved", actor: "System Admin", date: uploadDate })
  }
  if (status === "Rejected") {
    activities.push({ id: Math.random().toString(36).substring(2, 9), action: "Reviewed", actor: "System Admin", date: uploadDate })
    activities.push({ id: Math.random().toString(36).substring(2, 9), action: "Rejected", actor: "System Admin", date: uploadDate })
  }
  if (status === "Archived") {
    activities.push({ id: Math.random().toString(36).substring(2, 9), action: "Archived", actor: "System Automator", date: uploadDate })
  }
  return activities
}

export const mockDocuments: Document[] = Array.from({ length: 40 }).map((_, i) => {
  const client = mockClients[Math.floor(Math.random() * mockClients.length)] || { id: "CL-001", companyName: "Default Client" }
  const employee = employeeNames[Math.floor(Math.random() * employeeNames.length)]
  const uploadDate = randomDate(new Date(2023, 0, 1), new Date())
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    id: `DOC-${1001 + i}`,
    name: `Trade_Document_${1001 + i}`,
    type: documentTypes[Math.floor(Math.random() * documentTypes.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    clientId: client.id,
    clientName: client.companyName,
    shipmentId: `#TRK-${98230 + i}`,
    uploadedBy: employee,
    uploadDate: uploadDate,
    lastModified: uploadDate,
    fileSize: `${(Math.random() * 10 + 0.1).toFixed(1)} MB`,
    status: status,
    description: `Auto-generated mock document for testing purposes. Associated with ${client.companyName} and shipment #TRK-${98230 + i}.`,
    version: "v1.0",
    activities: generateActivities(status, uploadDate)
  }
})
