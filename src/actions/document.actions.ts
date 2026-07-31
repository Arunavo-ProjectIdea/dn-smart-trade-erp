"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"
import { SupabaseDocumentResponse } from "@/lib/mappers/document.mapper"

export async function getDocuments() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("documents")
    .select(`
      *,
      client:clients(company_name),
      uploaded_by:profiles(full_name),
      document_versions(*, uploaded_by:profiles(full_name)),
      document_activities(*, actor:profiles(full_name))
    `)
    .order("upload_date", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as SupabaseDocumentResponse[] }
}

export async function getDocumentById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("documents")
    .select(`
      *,
      client:clients(company_name),
      uploaded_by:profiles(full_name),
      document_versions(*, uploaded_by:profiles(full_name)),
      document_activities(*, actor:profiles(full_name))
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching document:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as SupabaseDocumentResponse }
}

export async function createDocument(formData: {
  name: string
  category: Database["public"]["Enums"]["document_category"]
  client_id?: string
  shipment_id?: string
  boe_id?: string
  description?: string
  tags?: string[]
  type: string
}) {
  const supabase = await createClient()
  
  // Helper to prevent invalid UUID errors for mock data
  const isValidUuid = (id: string | undefined | null) => 
    id ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) : false;
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  // 1. Insert Document (Storage fields mapped to empty strings to satisfy schema constraints without breaking types)
  const { data: document, error: insertError } = await supabase
    .from("documents")
    .insert({
      name: formData.name,
      category: formData.category,
      client_id: isValidUuid(formData.client_id) ? formData.client_id : null,
      shipment_id: isValidUuid(formData.shipment_id) ? formData.shipment_id : null,
      boe_id: isValidUuid(formData.boe_id) ? formData.boe_id : null,
      description: formData.description || null,
      tags: formData.tags || [],
      type: formData.type || "Unknown",
      status: "Pending Review",
      uploaded_by_id: user.id,
      upload_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      // Dummy storage fields
      current_file_url: "",
      file_type: "",
      file_size: null,
    })
    .select()
    .single()

  if (insertError) {
    console.error("Error creating document:", insertError)
    return { success: false, error: insertError.message }
  }

  // 2. Insert Activity Logging
  const { error: activityError } = await supabase
    .from("document_activities")
    .insert({
      document_id: document.id,
      action: "Created",
      actor_id: user.id,
      date: new Date().toISOString(),
      details: "Document uploaded and metadata created."
    })

  if (activityError) {
    console.error("Error logging document creation activity:", activityError)
    // Non-fatal, we still created the document
  }

  revalidatePath("/documents")
  return { success: true, data: document }
}

export async function archiveDocument(id: string) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  // 1. Update Document Status (Soft Delete)
  const { error: updateError } = await supabase
    .from("documents")
    .update({ 
      status: "Archived",
      last_modified: new Date().toISOString()
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error archiving document:", updateError)
    return { success: false, error: updateError.message }
  }

  // 2. Insert Activity Logging
  const { error: activityError } = await supabase
    .from("document_activities")
    .insert({
      document_id: id,
      action: "Archived",
      actor_id: user.id,
      date: new Date().toISOString(),
      details: "Document archived by user."
    })

  if (activityError) {
    console.error("Error logging archive activity:", activityError)
  }

  revalidatePath("/documents")
  return { success: true }
}

export async function restoreDocument(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error: updateError } = await supabase
    .from("documents")
    .update({ 
      status: "Pending Review",
      last_modified: new Date().toISOString()
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error restoring document:", updateError)
    return { success: false, error: updateError.message }
  }

  // Insert Activity Logging
  await supabase
    .from("document_activities")
    .insert({
      document_id: id,
      action: "Restored",
      actor_id: user.id,
      date: new Date().toISOString(),
      details: "Document restored from recycle bin."
    })

  revalidatePath("/documents")
  return { success: true }
}

export async function permanentlyDeleteDocument(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)

  if (deleteError) {
    console.error("Error permanently deleting document:", deleteError)
    return { success: false, error: deleteError.message }
  }

  revalidatePath("/documents")
  return { success: true }
}

export async function updateDocumentStatus(id: string, newStatus: Database["public"]["Enums"]["document_status"]) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error: updateError } = await supabase
    .from("documents")
    .update({ 
      status: newStatus,
      last_modified: new Date().toISOString()
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error updating document status:", updateError)
    return { success: false, error: updateError.message }
  }

  // Insert Activity Logging
  const { error: activityError } = await supabase
    .from("document_activities")
    .insert({
      document_id: id,
      action: newStatus === "Approved" ? "Approved" : "Rejected",
      actor_id: user.id,
      date: new Date().toISOString(),
      details: `Document status updated to ${newStatus}.`
    })

  if (activityError) {
    console.error("Error logging status update activity:", activityError)
  }

  revalidatePath(`/documents/${id}`)
  revalidatePath("/documents")
  return { success: true }
}

export async function getUploadOptions() {
  const supabase = await createClient()

  const [clientsRes, shipmentsRes, boesRes] = await Promise.all([
    supabase.from("clients").select("id, company_name").order("company_name"),
    supabase.from("shipments").select("id, destination_country, container_number, departure_date").order("created_at", { ascending: false }).limit(50),
    supabase.from("bills_of_entry").select("id, boe_number").order("created_at", { ascending: false }).limit(50)
  ])

  return {
    clients: clientsRes.data || [],
    shipments: shipmentsRes.data || [],
    billsOfEntry: boesRes.data || []
  }
}

export async function updateDocument(id: string, formData: {
  name?: string
  category?: Database["public"]["Enums"]["document_category"]
  client_id?: string
  shipment_id?: string
  boe_id?: string
  description?: string
  tags?: string[]
  type?: string
}) {
  const supabase = await createClient()
  
  const isValidUuid = (uuid: string | undefined | null) => 
    uuid ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid) : false;
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error: updateError } = await supabase
    .from("documents")
    .update({
      ...(formData.name && { name: formData.name }),
      ...(formData.category && { category: formData.category }),
      ...(formData.client_id !== undefined && { client_id: isValidUuid(formData.client_id) ? formData.client_id : null }),
      ...(formData.shipment_id !== undefined && { shipment_id: isValidUuid(formData.shipment_id) ? formData.shipment_id : null }),
      ...(formData.boe_id !== undefined && { boe_id: isValidUuid(formData.boe_id) ? formData.boe_id : null }),
      ...(formData.description !== undefined && { description: formData.description || null }),
      ...(formData.tags !== undefined && { tags: formData.tags || [] }),
      ...(formData.type && { type: formData.type }),
      last_modified: new Date().toISOString()
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error updating document:", updateError)
    return { success: false, error: updateError.message }
  }

  // Insert Activity Logging
  await supabase
    .from("document_activities")
    .insert({
      document_id: id,
      action: "Updated",
      actor_id: user.id,
      date: new Date().toISOString(),
      details: "Document metadata updated."
    })

  revalidatePath(`/documents/${id}`)
  revalidatePath("/documents")
  return { success: true }
}
