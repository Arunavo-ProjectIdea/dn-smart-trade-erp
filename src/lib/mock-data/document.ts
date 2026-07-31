import { DocumentEntity } from '../types/document';

export const mockDocumentsList: DocumentEntity[] = [
  {
    id: "doc-1",
    name: "Commercial_Invoice_INV-2026-089.pdf",
    type: "Commercial Invoice",
    fileType: "PDF",
    status: "Approved",
    description: "Final commercial invoice for Acme Corp machinery import.",
    tags: ["Invoice", "Machinery", "Acme"],
    clientId: "client-1",
    clientName: "Acme Corp",
    shipmentId: "SHP-1001",
    boeId: "BOE-2026-001",
    currentVersion: 1,
    uploadedAt: "2026-05-20T10:00:00Z",
    uploadedBy: "Jane Doe",
    fileSize: 1048576, // 1MB
    fileUrl: "/placeholder.pdf",
    versions: [
      {
        id: "v-1",
        versionNumber: 1,
        uploadedAt: "2026-05-20T10:00:00Z",
        uploadedBy: "Jane Doe",
        fileSize: 1048576,
        fileUrl: "/placeholder.pdf"
      }
    ],
    auditTrail: [
      {
        id: "au-1",
        date: "2026-05-20T10:00:00Z",
        action: "Uploaded Document",
        user: "Jane Doe"
      },
      {
        id: "au-2",
        date: "2026-05-21T09:30:00Z",
        action: "Status Changed",
        user: "System Admin",
        details: "Changed status from 'Uploaded' to 'Approved'"
      }
    ]
  },
  {
    id: "doc-2",
    name: "PackingList_Acme_Machinery.xlsx",
    type: "Packing List",
    fileType: "XLSX",
    status: "Pending Review",
    tags: ["Packing List", "Acme"],
    clientId: "client-1",
    clientName: "Acme Corp",
    shipmentId: "SHP-1001",
    boeId: "BOE-2026-001",
    currentVersion: 2,
    uploadedAt: "2026-05-22T14:15:00Z",
    uploadedBy: "John Smith",
    fileSize: 512000, // 500KB
    fileUrl: "/placeholder.xlsx",
    versions: [
      {
        id: "v-2",
        versionNumber: 1,
        uploadedAt: "2026-05-20T10:30:00Z",
        uploadedBy: "John Smith",
        fileSize: 490000,
        fileUrl: "/placeholder_v1.xlsx"
      },
      {
        id: "v-3",
        versionNumber: 2,
        uploadedAt: "2026-05-22T14:15:00Z",
        uploadedBy: "John Smith",
        fileSize: 512000,
        fileUrl: "/placeholder.xlsx"
      }
    ],
    auditTrail: [
      {
        id: "au-3",
        date: "2026-05-20T10:30:00Z",
        action: "Uploaded Document",
        user: "John Smith"
      },
      {
        id: "au-4",
        date: "2026-05-22T14:15:00Z",
        action: "Uploaded New Version",
        user: "John Smith",
        details: "Uploaded Version 2"
      }
    ]
  },
  {
    id: "doc-3",
    name: "BOL_Evergreen_Taiwan.pdf",
    type: "Bill of Lading",
    fileType: "PDF",
    status: "Uploaded",
    description: "Bill of Lading from Evergreen for TechNova",
    tags: ["BOL", "TechNova", "Taiwan"],
    clientId: "client-2",
    clientName: "TechNova",
    shipmentId: "SHP-1002",
    currentVersion: 1,
    uploadedAt: "2026-06-10T11:00:00Z",
    uploadedBy: "Alice Cooper",
    fileSize: 2097152, // 2MB
    fileUrl: "/placeholder.pdf",
    versions: [
      {
        id: "v-4",
        versionNumber: 1,
        uploadedAt: "2026-06-10T11:00:00Z",
        uploadedBy: "Alice Cooper",
        fileSize: 2097152,
        fileUrl: "/placeholder.pdf"
      }
    ],
    auditTrail: [
      {
        id: "au-5",
        date: "2026-06-10T11:00:00Z",
        action: "Uploaded Document",
        user: "Alice Cooper"
      }
    ]
  },
  {
    id: "doc-4",
    name: "Import_Permit_2026.jpg",
    type: "Import Permit",
    fileType: "JPG",
    status: "Expired",
    tags: ["Permit", "GlobalTrade"],
    clientId: "client-3",
    clientName: "Global Trade Co",
    currentVersion: 1,
    uploadedAt: "2025-12-01T09:00:00Z",
    uploadedBy: "Bob Jones",
    fileSize: 307200, // 300KB
    fileUrl: "/placeholder.jpg",
    versions: [
      {
        id: "v-5",
        versionNumber: 1,
        uploadedAt: "2025-12-01T09:00:00Z",
        uploadedBy: "Bob Jones",
        fileSize: 307200,
        fileUrl: "/placeholder.jpg"
      }
    ],
    auditTrail: [
      {
        id: "au-6",
        date: "2025-12-01T09:00:00Z",
        action: "Uploaded Document",
        user: "Bob Jones"
      },
      {
        id: "au-7",
        date: "2026-06-01T00:00:00Z",
        action: "Status Changed",
        user: "System",
        details: "Automatically marked as Expired"
      }
    ]
  }
];

export const getMockDocumentById = (id: string) => {
  return mockDocumentsList.find(doc => doc.id === id) || null;
};
