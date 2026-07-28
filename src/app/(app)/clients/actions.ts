"use server"

import { createClient } from "@/lib/supabase/server"
import { Client } from "@/lib/mock-data/clients"
import { mapClient, mapClientToInsert, mapClientToUpdate } from "./mappers"
import { revalidatePath } from "next/cache"

export async function getClients(): Promise<{ data: Client[] | null; error: unknown }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching clients:', error)
    return { data: null, error }
  }

  return { data: data.map(mapClient), error: null }
}

export async function getClientById(id: string): Promise<{ data: Client | null; error: unknown }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching client by id:', error)
    return { data: null, error }
  }

  return { data: mapClient(data), error: null }
}

export async function createClientAction(clientData: Partial<Client>): Promise<{ data: Client | null; error: unknown }> {
  const supabase = await createClient()
  const insertData = mapClientToInsert(clientData)
  
  const { data: sessionData } = await supabase.auth.getSession()
  const { data: user } = await supabase.auth.getUser()
  const { data: profile } = user?.user ? await supabase.from('profiles').select('*').eq('id', user.user.id).single() : { data: null }

  console.log("=== PHASE 4.1 DEBUG ===")
  console.log("Current Session Exists:", sessionData.session ? "Yes" : "No")
  console.log("Authenticated User ID:", user?.user?.id || "undefined")
  console.log("Authenticated Email:", user?.user?.email || "undefined")
  console.log("Profile ID:", profile?.id || "undefined")
  console.log("Resolved Role:", profile?.role || "undefined")
  console.log("=======================")

  const { data, error } = await supabase.from('clients').insert(insertData).select().single()

  if (error) {
    console.error('Error creating client:', error)
    return { data: null, error: `[Session: ${sessionData.session ? 'Active' : 'None'}, User: ${sessionData.session?.user?.id}] ${error.message}` }
  }

  revalidatePath('/clients')
  return { data: mapClient(data), error: null }
}

export async function updateClientAction(id: string, clientData: Partial<Client>): Promise<{ data: Client | null; error: unknown }> {
  const supabase = await createClient()
  const updateData = mapClientToUpdate(clientData)

  const { data, error } = await supabase.from('clients').update(updateData).eq('id', id).select().single()

  if (error) {
    console.error('Error updating client:', error)
    return { data: null, error }
  }

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  return { data: mapClient(data), error: null }
}

export async function deactivateClientAction(id: string): Promise<{ data: Client | null; error: unknown }> {
  const supabase = await createClient()

  const { data, error } = await supabase.from('clients').update({ status: 'Inactive' }).eq('id', id).select().single()

  if (error) {
    console.error('Error deactivating client:', error)
    return { data: null, error }
  }

  revalidatePath('/clients')
  return { data: mapClient(data), error: null }
}
