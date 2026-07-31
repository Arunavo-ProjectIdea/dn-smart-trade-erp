import { getClients } from "./actions"
import ClientsClient from "./clients-client"

export default async function ClientsPage() {
  const { data: clients, error } = await getClients()

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        Error loading clients. Please try again later.
      </div>
    )
  }

  return <ClientsClient initialClients={clients || []} />
}
