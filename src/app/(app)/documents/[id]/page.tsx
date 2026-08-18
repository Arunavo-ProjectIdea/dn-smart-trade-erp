import { getDocumentById } from "@/actions/document.actions"
import { mapDocumentToUI } from "@/lib/mappers/document.mapper"
import { DocumentDetailsClient } from "./document-details-client"
import { DocumentNotFoundClient } from "./document-not-found-client"

export default async function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const documentId = resolvedParams.id
  
  const { data, success } = await getDocumentById(documentId)

  if (!success || !data) {
    return <DocumentNotFoundClient documentId={documentId} />
  }

  const document = mapDocumentToUI(data)

  return <DocumentDetailsClient document={document} />
}
