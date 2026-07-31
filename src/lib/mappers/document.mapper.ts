import { Database } from "@/types/database.types"
import { Document, DocumentStatus, DocumentCategory } from "@/lib/mock-data/documents"

type DBDocument = Database["public"]["Tables"]["documents"]["Row"]
type DBClient = Pick<Database["public"]["Tables"]["clients"]["Row"], "company_name">
type DBProfile = Pick<Database["public"]["Tables"]["profiles"]["Row"], "full_name">
type DBDocumentVersion = Database["public"]["Tables"]["document_versions"]["Row"] & {
  uploaded_by?: DBProfile | null
}
type DBDocumentActivity = Database["public"]["Tables"]["document_activities"]["Row"] & {
  actor?: DBProfile | null
}

export type SupabaseDocumentResponse = DBDocument & {
  client?: DBClient | null
  uploaded_by?: DBProfile | null
  document_versions?: DBDocumentVersion[] | null
  document_activities?: DBDocumentActivity[] | null
}

const formatBytes = (bytes: number | null) => {
  if (!bytes) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const mapDocumentToUI = (doc: SupabaseDocumentResponse): Document => {
  // Sort versions to get the latest
  const versions = doc.document_versions || []
  const sortedVersions = [...versions].sort((a, b) => b.version_number - a.version_number)
  const latestVersion = sortedVersions[0]

  return {
    id: doc.id,
    name: doc.name,
    type: doc.type || "PDF",
    category: doc.category as DocumentCategory,
    clientId: doc.client_id || "",
    clientName: doc.client?.company_name || "Unknown Client",
    shipmentId: doc.shipment_id || "",
    uploadedBy: doc.uploaded_by?.full_name || "Unknown User",
    uploadDate: doc.upload_date ? new Date(doc.upload_date).toISOString().split('T')[0] : "",
    lastModified: doc.last_modified ? new Date(doc.last_modified).toISOString().split('T')[0] : "",
    fileSize: formatBytes(doc.file_size),
    status: (doc.status as DocumentStatus) || "Pending Review",
    description: doc.description || "",
    version: latestVersion ? `v${latestVersion.version_number}.0` : "v1.0",
    tags: doc.tags || [],
    versions: sortedVersions.map(v => ({
      id: v.id,
      versionNumber: `v${v.version_number}.0`,
      uploadedAt: v.uploaded_at ? new Date(v.uploaded_at).toISOString().split('T')[0] : "",
      uploadedBy: v.uploaded_by?.full_name || "Unknown User",
      fileSize: formatBytes(v.file_size),
      fileUrl: v.file_url || undefined,
      changesNote: v.changes_note || undefined,
    })),
    activities: (doc.document_activities || []).map(a => ({
      id: a.id,
      action: a.action,
      actor: a.actor?.full_name || "Unknown User",
      date: a.date ? new Date(a.date).toISOString().split('T')[0] : "",
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}
