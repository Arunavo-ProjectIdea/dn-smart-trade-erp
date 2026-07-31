import { mockClients } from "./clients"

export type DocumentCategory = "Shipment Documents" | "BOE Documents" | "Client Documents" | "Financial Documents" | "Compliance Documents"
export type DocumentStatus = "Pending Review" | "Approved" | "Rejected" | "Archived"

export interface DocumentActivity {
  id: string
  action: string
  actor: string
  date: string
}

export interface DocumentVersion {
  id: string
  versionNumber: string
  uploadedAt: string
  uploadedBy: string
  fileSize: string
  fileUrl?: string
  changesNote?: string
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
  tags: string[]
  versions: DocumentVersion[]
  activities: DocumentActivity[]
}

const documentTypes = ["PDF", "XLSX", "DOCX", "JPG", "PNG"]
const categories: DocumentCategory[] = ["Shipment Documents", "BOE Documents", "Client Documents", "Financial Documents", "Compliance Documents"]
const statuses: DocumentStatus[] = ["Pending Review", "Approved", "Rejected", "Archived"]
const employeeNames = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Wilson", "Sarah Brown"]

const sampleTagsMap: Record<string, string[]> = {
  "PDF": ["Invoice", "Official", "Signed", "Urgent"],
  "XLSX": ["Financials", "Packing List", "Quantities", "Audit"],
  "DOCX": ["Contract", "Agreement", "Terms", "Legal"],
  "JPG": ["Receipt", "Photo ID", "Inspection", "Proof"],
  "PNG": ["Scan", "Customs Seal", "Verification"]
}

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

const generateVersions = (uploadDate: string, employee: string, fileSize: string): DocumentVersion[] => {
  return [
    {
      id: Math.random().toString(36).substring(2, 9),
      versionNumber: "v1.1",
      uploadedAt: uploadDate,
      uploadedBy: employee,
      fileSize: fileSize,
      changesNote: "Updated formatting and verified values."
    },
    {
      id: Math.random().toString(36).substring(2, 9),
      versionNumber: "v1.0",
      uploadedAt: "2025-11-15",
      uploadedBy: "Jane Smith",
      fileSize: "0.8 MB",
      changesNote: "Initial document upload."
    }
  ]
}

export const mockDocuments: Document[] = Array.from({ length: 40 }).map((_, i) => {
  const client = mockClients[Math.floor(Math.random() * mockClients.length)] || { id: "CL-001", companyName: "Default Client" }
  const employee = employeeNames[Math.floor(Math.random() * employeeNames.length)]
  const uploadDate = randomDate(new Date(2023, 0, 1), new Date())
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const type = documentTypes[Math.floor(Math.random() * documentTypes.length)]
  const fileSize = `${(Math.random() * 10 + 0.1).toFixed(1)} MB`

  return {
    id: `DOC-${1001 + i}`,
    name: `Trade_Document_${1001 + i}`,
    type: type,
    category: categories[Math.floor(Math.random() * categories.length)],
    clientId: client.id,
    clientName: client.companyName,
    shipmentId: `#TRK-${98230 + i}`,
    uploadedBy: employee,
    uploadDate: uploadDate,
    lastModified: uploadDate,
    fileSize: fileSize,
    status: status,
    description: `Auto-generated mock document for testing purposes. Associated with ${client.companyName} and shipment #TRK-${98230 + i}.`,
    version: "v1.1",
    tags: sampleTagsMap[type] || ["Document", "Trade"],
    versions: generateVersions(uploadDate, employee, fileSize),
    activities: generateActivities(status, uploadDate)
  }
})
