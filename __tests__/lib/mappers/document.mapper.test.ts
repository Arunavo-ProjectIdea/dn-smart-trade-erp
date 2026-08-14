import { describe, it, expect } from "vitest"
import { mapDocumentToUI, SupabaseDocumentResponse } from "../../../src/lib/mappers/document.mapper"

describe("document.mapper", () => {
  describe("mapDocumentToUI", () => {
    it("maps a full database document to the UI format", () => {
      const dbDoc: SupabaseDocumentResponse = {
        id: "doc-123",
        name: "Test Document.pdf",
        type: "PDF",
        category: "Shipment Documents",
        client_id: "client-1",
        shipment_id: "shipment-1",
        boe_id: null,
        status: "Approved",
        uploaded_by_id: "user-1",
        upload_date: "2026-08-14T10:00:00Z",
        last_modified: "2026-08-14T12:00:00Z",
        expiry_date: "2027-08-14T00:00:00Z",
        description: "A test doc",
        tags: ["test", "important"],
        current_file_url: "url",
        file_size: 1048576, // 1 MB
        file_type: "application/pdf",
        client: { company_name: "Acme Corp" },
        uploaded_by: { full_name: "John Doe" },
        shipment: { container_number: "CONT-123", destination_country: "USA" },
        document_versions: [
          {
            id: "v1",
            document_id: "doc-123",
            version_number: 1,
            file_url: "url-v1",
            file_size: 500000,
            file_type: "application/pdf",
            uploaded_by_id: "user-1",
            uploaded_at: "2026-08-13T10:00:00Z",
            changes_note: "Initial version",
            uploaded_by: { full_name: "John Doe" }
          },
          {
            id: "v2",
            document_id: "doc-123",
            version_number: 2,
            file_url: "url-v2",
            file_size: 1048576,
            file_type: "application/pdf",
            uploaded_by_id: "user-1",
            uploaded_at: "2026-08-14T10:00:00Z",
            changes_note: "Updated version",
            uploaded_by: { full_name: "John Doe" }
          }
        ],
        document_activities: [
          {
            id: "act1",
            document_id: "doc-123",
            action: "Created",
            actor_id: "user-1",
            date: "2026-08-13T10:00:00Z",
            details: "Created document",
            actor: { full_name: "John Doe" }
          }
        ]
      }

      const uiDoc = mapDocumentToUI(dbDoc)

      expect(uiDoc.id).toBe("doc-123")
      expect(uiDoc.name).toBe("Test Document.pdf")
      expect(uiDoc.clientName).toBe("Acme Corp")
      expect(uiDoc.shipmentRef).toBe("Container: CONT-123")
      expect(uiDoc.uploadedBy).toBe("John Doe")
      expect(uiDoc.uploadDate).toBe("2026-08-14")
      expect(uiDoc.fileSize).toBe("1.0 MB")
      expect(uiDoc.version).toBe("v2.0") // Should pick latest version
      expect(uiDoc.versions).toHaveLength(2)
      // Sorted descending by version number
      expect(uiDoc.versions[0].versionNumber).toBe("v2.0")
      expect(uiDoc.versions[1].versionNumber).toBe("v1.0")
      
      expect(uiDoc.activities).toHaveLength(1)
      expect(uiDoc.activities[0].actor).toBe("John Doe")
    })

    it("handles minimal/null data safely", () => {
      const minimalDoc: SupabaseDocumentResponse = {
        id: "doc-1",
        name: "Minimal",
        type: null,
        category: "Client Documents",
        client_id: null,
        shipment_id: null,
        boe_id: null,
        status: null,
        uploaded_by_id: "u1",
        upload_date: null,
        last_modified: null,
        current_file_url: null,
        file_size: null,
        file_type: null,
        tags: null,
        description: null,
      }

      const uiDoc = mapDocumentToUI(minimalDoc)
      
      expect(uiDoc.type).toBe("PDF") // fallback
      expect(uiDoc.clientName).toBe("Unknown Client")
      expect(uiDoc.uploadedBy).toBe("Unknown User")
      expect(uiDoc.status).toBe("Pending Review")
      expect(uiDoc.fileSize).toBe("0 MB")
      expect(uiDoc.version).toBe("v1.0")
      expect(uiDoc.tags).toEqual([])
      expect(uiDoc.versions).toEqual([])
      expect(uiDoc.activities).toEqual([])
    })
  })
})
