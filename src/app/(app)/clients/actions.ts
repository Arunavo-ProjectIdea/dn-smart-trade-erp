"use server"

import { createClient } from "@/lib/supabase/server"
import { Client } from "@/lib/mock-data/clients"
import { mapClient, mapClientToInsert, mapClientToUpdate } from "./mappers"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { notifyUsersByRoles } from "@/actions/notifications.actions"

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

export async function createClientAction(clientData: Partial<Client>, tempPassword?: string): Promise<{ data: Client | null; error: unknown, tempPassword?: string }> {
  const supabase = await createClient()
  const insertData = mapClientToInsert(clientData)
  
  const { data: sessionData } = await supabase.auth.getSession()
  const { data: user } = await supabase.auth.getUser()
  const { data: profile } = user?.user ? await supabase.from('profiles').select('*').eq('id', user.user.id).single() : { data: null }

  // 1. Create the Client Record
  const { data, error } = await supabase.from('clients').insert(insertData).select().single()

  if (error || !data) {
    console.error('Error creating client:', error)
    return { data: null, error: "Failed to create client. Please try again." }
  }

  // 2. Create the Auth User if requested
  if (tempPassword && clientData.email) {
    const adminAuthClient = createAdminClient()
    const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
      email: clientData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: clientData.contactPerson || clientData.companyName || 'Client',
      }
    })
    
    if (!authError && authData.user) {
      // Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update the profile to link to the client and set role
      await supabase.from('profiles').update({
        client_id: data.id,
        role: 'Client',
        status: 'Active',
        force_password_change: true,
        phone: clientData.phone
      }).eq('id', authData.user.id)
    } else {
      console.error('Error creating auth user for client:', authError)
    }
  }

  // Notify Admins and Employees
  await notifyUsersByRoles(['Admin', 'Employee'], {
    type: 'system',
    priority: 'low',
    title: 'New Client Added',
    message: `Client ${data.company_name} has been added.`,
    entityId: data.id,
    entityType: 'client',
  })

  revalidatePath('/clients')
  return { data: mapClient(data), error: null, tempPassword }
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

export async function activateClientAction(id: string): Promise<{ data: Client | null; error: unknown }> {
  const supabase = await createClient()

  const { data, error } = await supabase.from('clients').update({ status: 'Active' }).eq('id', id).select().single()

  if (error) {
    console.error('Error activating client:', error)
    return { data: null, error }
  }

  revalidatePath('/clients')
  return { data: mapClient(data), error: null }
}
