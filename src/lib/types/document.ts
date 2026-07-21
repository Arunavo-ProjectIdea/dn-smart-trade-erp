export type DocumentType = 
  | 'Commercial Invoice'
  | 'Packing List'
  | 'Bill of Lading'
  | 'Certificate of Origin'
  | 'Insurance Certificate'
  | 'Import Permit'
  | 'Export Permit'
  | 'LC Documents'
  | 'BOE Documents'
  | 'Customs Documents'
  | 'Other';

export type DocumentStatus = 'Uploaded' | 'Pending Review' | 'Approved' | 'Rejected' | 'Archived' | 'Expired';

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: number;
  fileUrl: string;
}

export interface DocumentAudit {
  id: string;
  date: string;
  action: string;
  user: string;
  details?: string;
}

export interface DocumentEntity {
  id: string;
  name: string;
  type: DocumentType;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'PNG' | 'JPG' | 'JPEG';
  status: DocumentStatus;
  description?: string;
  tags: string[];
  
  // Relations
  clientId?: string;
  clientName?: string;
  shipmentId?: string;
  boeId?: string;
  
  // Metadata
  currentVersion: number;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: number; // in bytes
  fileUrl: string;
  
  // History
  versions: DocumentVersion[];
  auditTrail: DocumentAudit[];
}
