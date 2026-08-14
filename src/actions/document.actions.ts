"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"
import { SupabaseDocumentResponse } from "@/lib/mappers/document.mapper"
import { notifyRolesAndClient } from "@/actions/notifications.actions"

export async function getDocuments() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("documents")
    .select(`
      *,
      client:clients(company_name),
      shipment:shipments(container_number, destination_country),
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
      shipment:shipments(container_number, destination_country),
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
  id: string
  name: string
  category: Database["public"]["Enums"]["document_category"]
  client_id?: string
  shipment_id?: string
  boe_id?: string
  description?: string
  tags?: string[]
  type: string
  current_file_url: string
  file_type: string
  file_size: number
  expiry_date?: string
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
      id: formData.id,
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
      // Storage fields
      current_file_url: formData.current_file_url,
      file_type: formData.file_type,
      file_size: formData.file_size,
      expiry_date: formData.expiry_date || null
       
    } as any)
    .select()
    .single()

  if (insertError) {
    console.error("Error creating document:", insertError)
    return { success: false, error: insertError.message }
  }

  // 2. Insert Activity Logging
  const { error: activityError } = await supabase
    .from("document_activities")
    .insert([
      {
        document_id: document.id,
        action: "Created",
        actor_id: user.id,
        date: new Date().toISOString(),
        details: "Document record created."
      },
      {
        document_id: document.id,
        action: "File Uploaded",
        actor_id: user.id,
        date: new Date().toISOString(),
        details: "Initial physical file uploaded."
      }
    ])

  if (activityError) {
    console.error("Error logging document creation activity:", activityError)
    // Non-fatal, we still created the document
  }

  await notifyRolesAndClient(['Admin', 'Employee'], document.client_id, {
    type: 'document',
    priority: 'medium',
    title: 'New Document Uploaded',
    message: `Document "${document.name}" was uploaded.`,
    entityId: document.id,
    entityType: 'document'
  })

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

  // Need client_id for notification
  const { data: docData } = await supabase.from('documents').select('client_id, name').eq('id', id).single()
  
  if (docData) {
    await notifyRolesAndClient(['Admin', 'Employee'], docData.client_id, {
      type: 'document',
      priority: 'low',
      title: 'Document Archived',
      message: `Document "${docData.name}" has been archived.`,
      entityId: id,
      entityType: 'document'
    })
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
  expiry_date?: string
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
      ...(formData.expiry_date !== undefined && { expiry_date: formData.expiry_date || null }),
      last_modified: new Date().toISOString()
       
    } as any)
    .eq("id", id)

  if (updateError) {
    console.error("Error updating document:", updateError)
    return { success: false, error: updateError.message }
  }

  // Insert Activity Logging
  const { error: activityError } = await supabase
    .from("document_activities")
    .insert({
      document_id: id,
      action: "Updated",
      actor_id: user.id,
      date: new Date().toISOString(),
      details: "Document metadata updated."
    })

  if (activityError) {
    console.error("Error logging metadata update activity:", activityError)
  }

  // Notify for Document Updated
  const { data: docData } = await supabase.from('documents').select('client_id, name').eq('id', id).single()
  if (docData) {
    await notifyRolesAndClient(['Admin', 'Employee'], docData.client_id, {
      type: 'document',
      priority: 'low',
      title: 'Document Metadata Updated',
      message: `Document "${docData.name}" has been updated.`,
      entityId: id,
      entityType: 'document'
    })
  }

  revalidatePath(`/documents/${id}`)
  revalidatePath("/documents")
  return { success: true }
}

export async function downloadDocument(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { data: document, error: fetchError } = await supabase
    .from("documents")
    .select("current_file_url")
    .eq("id", id)
    .single()

  if (fetchError || !document) {
    console.error("Error fetching document for download:", fetchError)
    return { success: false, error: fetchError?.message || "Document not found" }
  }

  if (!document.current_file_url) {
    return { success: false, error: "No file associated with this document" }
  }

  // Generate signed URL valid for 60 seconds (since bucket is private)
  const { data: signedUrl, error: signedUrlError } = await supabase
    .storage
    .from("documents")
    .createSignedUrl(document.current_file_url, 60)

  if (signedUrlError) {
    console.error("Error creating signed URL:", signedUrlError)
    return { success: false, error: signedUrlError.message }
  }

  return { success: true, data: { url: signedUrl.signedUrl } }
}

export async function replaceDocumentFile(id: string, fileData: {
  current_file_url: string
  file_type: string
  file_size: number
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  // 1. Fetch current document to get old metadata
  const { data: oldDoc, error: fetchError } = await supabase
    .from("documents")
    .select("current_file_url, file_size, file_type")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching old document metadata:", fetchError)
    return { success: false, error: "Failed to fetch previous file metadata" }
  }

  // 2. Update document with new file details
  const { error: updateError } = await supabase
    .from("documents")
    .update({ 
      current_file_url: fileData.current_file_url,
      file_type: fileData.file_type,
      file_size: fileData.file_size,
      last_modified: new Date().toISOString()
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error replacing document file:", updateError)
    return { success: false, error: updateError.message }
  }

  // 3. Insert Activity Logging with old metadata preserved in details
  const { error: activityError } = await supabase
    .from("document_activities")
    .insert({
      document_id: id,
      action: "File Replaced",
      actor_id: user.id,
      date: new Date().toISOString(),
      details: JSON.stringify({
        old_file_name: oldDoc?.current_file_url?.split('-').slice(1).join('-') || 'Unknown',
        old_file_size: String(oldDoc?.file_size || 0),
        old_file_type: oldDoc?.file_type || 'Unknown',
        old_file_path: oldDoc?.current_file_url || 'Unknown',
        new_file_name: fileData.current_file_url?.split('-').slice(1).join('-') || 'Unknown',
        new_file_size: String(fileData.file_size),
        new_file_type: fileData.file_type,
        new_file_path: fileData.current_file_url
      })
    })

  if (activityError) {
    console.error("Error logging file replace activity:", activityError)
  }

  // Need client_id for notification
  const { data: docData } = await supabase.from('documents').select('client_id, name').eq('id', id).single()

  if (docData) {
    await notifyRolesAndClient(['Admin', 'Employee'], docData.client_id, {
      type: 'document',
      priority: 'medium',
      title: 'Document Updated',
      message: `Document "${docData.name}" has been updated.`,
      entityId: id,
      entityType: 'document'
    })
  }

  revalidatePath(`/documents/${id}`)
  return { success: true }
}
