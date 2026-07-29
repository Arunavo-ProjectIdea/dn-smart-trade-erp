import { notFound } from "next/navigation"
import { getClientById } from "../actions"
import ClientDetailsClient from "./client-details-client"

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { data: client, error } = await getClientById(id)
  
  if (error || !client) {
    notFound()
  }

  return <ClientDetailsClient client={client} />
}
