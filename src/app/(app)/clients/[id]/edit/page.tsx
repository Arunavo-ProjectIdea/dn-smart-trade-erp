import { notFound } from "next/navigation"
import { getClientById } from "../../actions"
import { EditClientForm } from "./edit-client-form"

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: client, error } = await getClientById(id)

  if (error || !client) {
    notFound()
  }

  return <EditClientForm client={client} />
}
