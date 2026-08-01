import { getDocuments } from "@/actions/document.actions"
import { mapDocumentToUI } from "@/lib/mappers/document.mapper"
import { DocumentsClientView } from "./documents-client-view"

export default async function DocumentsPage() {
  const { data, success } = await getDocuments()
  
  const documents = success && data ? data.map(mapDocumentToUI) : []

  return <DocumentsClientView initialDocuments={documents} />
}
