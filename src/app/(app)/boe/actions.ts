"use server"

import { createClient } from "@/lib/supabase/server"
import { BillOfEntry, BOEProduct, BOETimelineEvent, BOEStatus } from "@/lib/types/boe"
import { mapBOE, RawBOEFromSupabase } from "./mappers"
import { createBOESchema, updateBOESchema, createBOEProductSchema, updateBOEProductSchema } from "./schema"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database.types"

const SELECT_BOE_QUERY = `
  *,
  shipment:shipments!shipment_id (
    id,
    shipment_number,
    loading_port,
    discharge_port,
    arrival_port,
    origin_country,
    shipping_line,
    vessel_name,
    container_number,
    eta,
    created_at,
    client:clients!client_id (
      id,
      company_name,
      contact_person,
      bin_number,
      tin_number,
      address
    )
  ),
  boe_products (
    id,
    product_name,
    hs_code,
    quantity,
    unit,
    declared_value,
    currency
  ),
  boe_timeline (
    id,
    status,
    date,
    note,
    author:profiles!author_id (
      full_name
    )
  )
`

export async function getBOEs(): Promise<{ data: BillOfEntry[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bills_of_entry")
      .select(SELECT_BOE_QUERY)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching BOEs from Supabase:", error)
      return { data: null, error: error.message }
    }

    const mapped = (data as unknown as RawBOEFromSupabase[]).map(mapBOE)
    return { data: mapped, error: null }
  } catch (err) {
    console.error("Unexpected error in getBOEs action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load BOEs" }
  }
}

export async function getBOEById(id: string): Promise<{ data: BillOfEntry | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bills_of_entry")
      .select(SELECT_BOE_QUERY)
      .or(`id.eq.${id},boe_number.eq.${id}`)
      .single()

    if (error || !data) {
      console.error("Error fetching BOE by ID:", error)
      return { data: null, error: error?.message || "Bill of Entry not found" }
    }

    const mapped = mapBOE(data as unknown as RawBOEFromSupabase)
    return { data: mapped, error: null }
  } catch (err) {
    console.error("Unexpected error in getBOEById action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load BOE details" }
  }
}

export async function getAvailableShipments(currentShipmentId?: string): Promise<{
  data: Array<{ id: string; shipmentNumber: string; clientName: string }> | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    // Get all existing shipment_ids that already have a BOE
    const { data: existingBOEs, error: boeErr } = await supabase
      .from("bills_of_entry")
      .select("shipment_id")

    if (boeErr) {
      console.error("Error fetching existing BOE shipment IDs:", boeErr)
      return { data: null, error: boeErr.message }
    }

    const takenShipmentIds = new Set((existingBOEs || []).map((b) => b.shipment_id))
    if (currentShipmentId) {
      takenShipmentIds.delete(currentShipmentId)
    }

    // Fetch all shipments
    const { data: shipments, error: shpErr } = await supabase
      .from("shipments")
      .select(`
        id,
        shipment_number,
        clients!client_id ( company_name )
      `)
      .order("created_at", { ascending: false })

    if (shpErr) {
      console.error("Error fetching shipments:", shpErr)
      return { data: null, error: shpErr.message }
    }

    const available = (shipments || [])
      .filter((s) => !takenShipmentIds.has(s.id))
      .map((s) => ({
        id: s.id,
        shipmentNumber: s.shipment_number,
        clientName: (s.clients as unknown as { company_name: string })?.company_name || "Unknown Client",
      }))

    return { data: available, error: null }
  } catch (err) {
    console.error("Unexpected error in getAvailableShipments action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load available shipments" }
  }
}

export async function createBOE(formData: unknown): Promise<{ success: boolean; data?: BillOfEntry; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Auth & Authorization check (Admin / Employee only)
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, id")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can create Bills of Entry." }
    }

    // 2. Validate input with Zod
    const parseResult = createBOESchema.safeParse(formData)
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      return { success: false, error: `Validation Error: ${errorMsg}` }
    }

    const { boeNumber, shipmentId, status, notes, importDuty, vat, ait, at, otherCharges, grandTotal } = parseResult.data

    // 3. Verify shipment existence
    const { data: targetShipment, error: shipmentErr } = await supabase
      .from("shipments")
      .select("id")
      .eq("id", shipmentId)
      .single()

    if (shipmentErr || !targetShipment) {
      return { success: false, error: "Referenced Shipment does not exist." }
    }

    // 4. Verify 1-to-1 constraint (No duplicate BOE per Shipment)
    const { data: existingShipmentBOE } = await supabase
      .from("bills_of_entry")
      .select("id, boe_number")
      .eq("shipment_id", shipmentId)
      .maybeSingle()

    if (existingShipmentBOE) {
      return { success: false, error: `Shipment already has a Bill of Entry assigned (${existingShipmentBOE.boe_number}). Duplicate BOEs per shipment are not allowed.` }
    }

    // 5. Verify BOE Number uniqueness
    const { data: existingBOENumber } = await supabase
      .from("bills_of_entry")
      .select("id")
      .eq("boe_number", boeNumber)
      .maybeSingle()

    if (existingBOENumber) {
      return { success: false, error: `BOE Number '${boeNumber}' already exists. Please provide a unique BOE Number.` }
    }

    // 6. Insert new BOE record
    const { data: newBOERow, error: insertError } = await supabase
      .from("bills_of_entry")
      .insert({
        boe_number: boeNumber,
        shipment_id: shipmentId,
        status,
        notes: notes || null,
        duties_import_duty: importDuty,
        duties_vat: vat,
        duties_ait: ait,
        duties_at: at,
        duties_other_charges: otherCharges,
        duties_grand_total: grandTotal,
      })
      .select(SELECT_BOE_QUERY)
      .single()

    if (insertError) {
      console.error("Error creating BOE in Supabase:", insertError)
      return { success: false, error: insertError.message }
    }

    // Add initial timeline entry
    await supabase.from("boe_timeline").insert({
      boe_id: newBOERow.id,
      status,
      date: new Date().toISOString(),
      note: `BOE created with status: ${status}`,
      author_id: profile.id,
    })

    revalidatePath("/boe")
    revalidatePath("/dashboard")

    const mapped = mapBOE(newBOERow as unknown as RawBOEFromSupabase)
    return { success: true, data: mapped }
  } catch (err) {
    console.error("Unexpected error in createBOE action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to create BOE" }
  }
}

export async function updateBOE(id: string, formData: unknown): Promise<{ success: boolean; data?: BillOfEntry; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Auth & Authorization check (Admin / Employee only)
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, id")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can update Bills of Entry." }
    }

    // 2. Validate input with Zod
    const parseResult = updateBOESchema.safeParse(formData)
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      return { success: false, error: `Validation Error: ${errorMsg}` }
    }

    const inputData = parseResult.data

    // 3. Verify BOE exists
    const { data: currentBOE, error: findError } = await supabase
      .from("bills_of_entry")
      .select("id, boe_number, status")
      .eq("id", id)
      .single()

    if (findError || !currentBOE) {
      return { success: false, error: "Bill of Entry not found." }
    }

    // 4. Verify uniqueness if boeNumber is being changed
    if (inputData.boeNumber && inputData.boeNumber !== currentBOE.boe_number) {
      const { data: existingBOE } = await supabase
        .from("bills_of_entry")
        .select("id")
        .eq("boe_number", inputData.boeNumber)
        .neq("id", id)
        .maybeSingle()

      if (existingBOE) {
        return { success: false, error: `BOE Number '${inputData.boeNumber}' is already in use by another record.` }
      }
    }

    // 5. Perform update
    const updateData: Database["public"]["Tables"]["bills_of_entry"]["Update"] = {
      updated_at: new Date().toISOString(),
    }
    if (inputData.boeNumber) updateData.boe_number = inputData.boeNumber
    if (inputData.status) updateData.status = inputData.status
    if (inputData.notes !== undefined) updateData.notes = inputData.notes
    if (inputData.importDuty !== undefined) updateData.duties_import_duty = inputData.importDuty
    if (inputData.vat !== undefined) updateData.duties_vat = inputData.vat
    if (inputData.ait !== undefined) updateData.duties_ait = inputData.ait
    if (inputData.at !== undefined) updateData.duties_at = inputData.at
    if (inputData.otherCharges !== undefined) updateData.duties_other_charges = inputData.otherCharges
    if (inputData.grandTotal !== undefined) updateData.duties_grand_total = inputData.grandTotal

    const { data: updatedBOERow, error: updateError } = await supabase
      .from("bills_of_entry")
      .update(updateData)
      .eq("id", id)
      .select(SELECT_BOE_QUERY)
      .single()

    if (updateError) {
      console.error("Error updating BOE in Supabase:", updateError)
      return { success: false, error: updateError.message }
    }

    // Log timeline if status changed
    if (inputData.status && inputData.status !== currentBOE.status) {
      await supabase.from("boe_timeline").insert({
        boe_id: id,
        status: inputData.status,
        date: new Date().toISOString(),
        note: `Status updated to ${inputData.status}`,
        author_id: profile.id,
      })
    }

    revalidatePath("/boe")
    revalidatePath(`/boe/${id}`)
    revalidatePath(`/boe/${id}/edit`)
    revalidatePath("/dashboard")

    const mapped = mapBOE(updatedBOERow as unknown as RawBOEFromSupabase)
    return { success: true, data: mapped }
  } catch (err) {
    console.error("Unexpected error in updateBOE action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to update BOE" }
  }
}

export async function deleteBOE(_id: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("BOE deletion request received for ID:", _id)
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can delete BOE records." }
    }

    // Per Phase 4.3.1 requirements: "Implement soft delete if project architecture supports it. Otherwise prevent deletion and display an appropriate message."
    // Schema does not have a soft-delete column, so deletion is disabled.
    return {
      success: false,
      error: "BOE deletion is disabled for audit and customs compliance. Bills of Entry cannot be deleted.",
    }
  } catch (err) {
    console.error("Unexpected error in deleteBOE action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to process deletion" }
  }
}

export async function getBOEProducts(boeId: string): Promise<{ data: BOEProduct[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("boe_products")
      .select("id, product_name, hs_code, quantity, unit, declared_value, currency")
      .eq("boe_id", boeId)

    if (error) {
      console.error("Error fetching BOE products:", error)
      return { data: null, error: error.message }
    }

    const mapped: BOEProduct[] = (data || []).map((p) => ({
      id: p.id,
      productName: p.product_name,
      hsCode: p.hs_code || "N/A",
      quantity: Number(p.quantity) || 0,
      unit: p.unit || "Pieces",
      declaredValue: Number(p.declared_value) || 0,
      currency: p.currency || "USD",
    }))

    return { data: mapped, error: null }
  } catch (err) {
    console.error("Unexpected error in getBOEProducts action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load BOE products" }
  }
}

export async function createBOEProduct(payload: unknown): Promise<{ success: boolean; data?: BOEProduct; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Auth check (Admin / Employee only)
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can add BOE products." }
    }

    // 2. Zod validation
    const parseResult = createBOEProductSchema.safeParse(payload)
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      return { success: false, error: `Validation Error: ${errorMsg}` }
    }

    const { boeId, productName, hsCode, quantity, unit, declaredValue, currency } = parseResult.data

    // 3. Verify BOE existence
    const { data: boeRecord, error: boeErr } = await supabase
      .from("bills_of_entry")
      .select("id")
      .eq("id", boeId)
      .single()

    if (boeErr || !boeRecord) {
      return { success: false, error: "Associated Bill of Entry record does not exist." }
    }

    // 4. Validate HS Code existence if provided
    if (hsCode && hsCode.trim()) {
      const { data: hsRecord } = await supabase
        .from("hs_codes")
        .select("code")
        .eq("code", hsCode.trim())
        .maybeSingle()

      if (!hsRecord) {
        return { success: false, error: `HS Code '${hsCode}' does not exist in reference system.` }
      }
    }

    // 5. Check duplicate product in this BOE
    const { data: existingProd } = await supabase
      .from("boe_products")
      .select("id")
      .eq("boe_id", boeId)
      .ilike("product_name", productName.trim())
      .maybeSingle()

    if (existingProd) {
      return { success: false, error: `Product '${productName}' already exists in this Bill of Entry.` }
    }

    // 6. Insert new product
    const { data: newRow, error: insertErr } = await supabase
      .from("boe_products")
      .insert({
        boe_id: boeId,
        product_name: productName.trim(),
        hs_code: hsCode ? hsCode.trim() : null,
        quantity,
        unit: unit.trim(),
        declared_value: declaredValue,
        currency: currency.trim(),
      })
      .select("id, product_name, hs_code, quantity, unit, declared_value, currency")
      .single()

    if (insertErr) {
      console.error("Error creating BOE product in Supabase:", insertErr)
      return { success: false, error: insertErr.message }
    }

    revalidatePath(`/boe/${boeId}`)
    revalidatePath("/boe")

    const mapped: BOEProduct = {
      id: newRow.id,
      productName: newRow.product_name,
      hsCode: newRow.hs_code || "N/A",
      quantity: Number(newRow.quantity) || 0,
      unit: newRow.unit,
      declaredValue: Number(newRow.declared_value) || 0,
      currency: newRow.currency,
    }

    return { success: true, data: mapped }
  } catch (err) {
    console.error("Unexpected error in createBOEProduct action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to create BOE product" }
  }
}

export async function updateBOEProduct(id: string, payload: unknown): Promise<{ success: boolean; data?: BOEProduct; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Auth check (Admin / Employee only)
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can update BOE products." }
    }

    // 2. Zod validation
    const parseResult = updateBOEProductSchema.safeParse(payload)
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      return { success: false, error: `Validation Error: ${errorMsg}` }
    }

    const inputData = parseResult.data

    // 3. Verify product exists
    const { data: currentProduct, error: findErr } = await supabase
      .from("boe_products")
      .select("id, boe_id, product_name")
      .eq("id", id)
      .single()

    if (findErr || !currentProduct) {
      return { success: false, error: "BOE product not found." }
    }

    // 4. Validate HS Code if changed
    if (inputData.hsCode && inputData.hsCode.trim()) {
      const { data: hsRecord } = await supabase
        .from("hs_codes")
        .select("code")
        .eq("code", inputData.hsCode.trim())
        .maybeSingle()

      if (!hsRecord) {
        return { success: false, error: `HS Code '${inputData.hsCode}' does not exist in reference system.` }
      }
    }

    // 5. Build update object
    const updateData: Database["public"]["Tables"]["boe_products"]["Update"] = {}
    if (inputData.productName) updateData.product_name = inputData.productName.trim()
    if (inputData.hsCode !== undefined) updateData.hs_code = inputData.hsCode ? inputData.hsCode.trim() : null
    if (inputData.quantity !== undefined) updateData.quantity = inputData.quantity
    if (inputData.unit) updateData.unit = inputData.unit.trim()
    if (inputData.declaredValue !== undefined) updateData.declared_value = inputData.declaredValue
    if (inputData.currency) updateData.currency = inputData.currency.trim()

    const { data: updatedRow, error: updateErr } = await supabase
      .from("boe_products")
      .update(updateData)
      .eq("id", id)
      .select("id, boe_id, product_name, hs_code, quantity, unit, declared_value, currency")
      .single()

    if (updateErr) {
      console.error("Error updating BOE product in Supabase:", updateErr)
      return { success: false, error: updateErr.message }
    }

    revalidatePath(`/boe/${updatedRow.boe_id}`)
    revalidatePath("/boe")

    const mapped: BOEProduct = {
      id: updatedRow.id,
      productName: updatedRow.product_name,
      hsCode: updatedRow.hs_code || "N/A",
      quantity: Number(updatedRow.quantity) || 0,
      unit: updatedRow.unit,
      declaredValue: Number(updatedRow.declared_value) || 0,
      currency: updatedRow.currency,
    }

    return { success: true, data: mapped }
  } catch (err) {
    console.error("Unexpected error in updateBOEProduct action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to update BOE product" }
  }
}

export async function deleteBOEProduct(id: string, boeId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Auth check (Admin / Employee only)
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can delete BOE products." }
    }

    const { error: deleteErr } = await supabase
      .from("boe_products")
      .delete()
      .eq("id", id)

    if (deleteErr) {
      console.error("Error deleting BOE product:", deleteErr)
      return { success: false, error: deleteErr.message }
    }

    revalidatePath(`/boe/${boeId}`)
    revalidatePath("/boe")

    return { success: true }
  } catch (err) {
    console.error("Unexpected error in deleteBOEProduct action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete BOE product" }
  }
}

export interface HSCodeItem {
  id: string
  code: string
  name: string
  description: string | null
  category: string
  uom: string
  cd: number
  sd: number
  vat: number
  ait: number
  rd: number
}

export interface DutyCalculationResult {
  baseValueBDT: number
  cdAmount: number
  sdAmount: number
  vatAmount: number
  aitAmount: number
  rdAmount: number
  totalTaxAmount: number
  grandTotalAmount: number
}

let hsCodesCache: HSCodeItem[] | null = null
let hsCodesCacheTime = 0
const CACHE_TTL_MS = 60 * 1000

export async function getHSCodes(searchQuery?: string): Promise<{ data: HSCodeItem[] | null; error: string | null }> {
  try {
    const now = Date.now()
    let codes = hsCodesCache

    if (!codes || now - hsCodesCacheTime > CACHE_TTL_MS) {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("hs_codes")
        .select("id, code, name, description, category, uom, cd, sd, vat, ait, rd")
        .order("code", { ascending: true })

      if (error) {
        console.error("Error fetching HS Codes from Supabase:", error)
        return { data: null, error: error.message }
      }

      codes = (data || []).map((row) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        category: row.category,
        uom: row.uom || "Pieces",
        cd: Number(row.cd) || 0,
        sd: Number(row.sd) || 0,
        vat: Number(row.vat) || 0,
        ait: Number(row.ait) || 0,
        rd: Number(row.rd) || 0,
      }))

      hsCodesCache = codes
      hsCodesCacheTime = now
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      const filtered = codes.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
      )
      return { data: filtered, error: null }
    }

    return { data: codes, error: null }
  } catch (err) {
    console.error("Unexpected error in getHSCodes action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load HS Codes" }
  }
}

export async function calculateDuty(payload: {
  hsCode: string
  quantity: number
  unitPrice: number
  currency?: string
  exchangeRate?: number
}): Promise<{ success: boolean; data?: DutyCalculationResult; error?: string }> {
  try {
    const { hsCode, quantity, unitPrice, currency = "USD", exchangeRate = 120 } = payload

    if (!hsCode || !hsCode.trim()) {
      return { success: false, error: "HS Code is required for duty calculation." }
    }
    if (quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0." }
    }
    if (unitPrice <= 0) {
      return { success: false, error: "Unit Price must be greater than 0." }
    }

    const { data: hsCodesRes, error: hsError } = await getHSCodes(hsCode.trim())
    if (hsError || !hsCodesRes || hsCodesRes.length === 0) {
      return { success: false, error: `Valid HS Code '${hsCode}' not found in database.` }
    }

    const selectedCode = hsCodesRes.find((c) => c.code === hsCode.trim()) || hsCodesRes[0]

    const rate = currency === "USD" ? (exchangeRate > 0 ? exchangeRate : 120) : 1
    const baseValueBDT = quantity * unitPrice * rate

    const cdAmount = baseValueBDT * (selectedCode.cd / 100)
    const sdAmount = (baseValueBDT + cdAmount) * (selectedCode.sd / 100)
    const vatAmount = (baseValueBDT + cdAmount + sdAmount) * (selectedCode.vat / 100)
    const aitAmount = baseValueBDT * (selectedCode.ait / 100)
    const rdAmount = baseValueBDT * (selectedCode.rd / 100)

    const totalTaxAmount = cdAmount + sdAmount + vatAmount + aitAmount + rdAmount
    const grandTotalAmount = baseValueBDT + totalTaxAmount

    return {
      success: true,
      data: {
        baseValueBDT,
        cdAmount,
        sdAmount,
        vatAmount,
        aitAmount,
        rdAmount,
        totalTaxAmount,
        grandTotalAmount,
      },
    }
  } catch (err) {
    console.error("Unexpected error in calculateDuty action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Calculation failed." }
  }
}

export async function updateCalculatedAmounts(
  boeId: string,
  duties: {
    importDuty: number
    vat: number
    ait: number
    at: number
    otherCharges: number
    grandTotal: number
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can update calculated BOE duties." }
    }

    const { error: updateError } = await supabase
      .from("bills_of_entry")
      .update({
        duties_import_duty: duties.importDuty,
        duties_vat: duties.vat,
        duties_ait: duties.ait,
        duties_at: duties.at,
        duties_other_charges: duties.otherCharges,
        duties_grand_total: duties.grandTotal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boeId)

    if (updateError) {
      console.error("Error updating calculated amounts in Supabase:", updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath(`/boe/${boeId}`)
    revalidatePath("/boe")

    return { success: true }
  } catch (err) {
    console.error("Unexpected error in updateCalculatedAmounts action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to update calculated duty amounts." }
  }
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  Draft: ["Submitted"],
  Submitted: ["Under Review"],
  "Under Review": ["Approved", "Rejected"],
  Approved: ["Completed"],
  Rejected: ["Draft", "Submitted"],
  Completed: [],
}

export async function getBOETimeline(boeId: string): Promise<{ data: BOETimelineEvent[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("boe_timeline")
      .select(`
        id,
        boe_id,
        status,
        note,
        date,
        author_id,
        author:profiles!author_id (
          full_name,
          email,
          role
        )
      `)
      .eq("boe_id", boeId)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching BOE timeline from Supabase:", error)
      return { data: null, error: error.message }
    }

    const mapped: BOETimelineEvent[] = (data || []).map((t: {
      id: string
      date: string | null
      status: string
      note: string | null
      author?: { full_name: string | null; email: string | null } | null
    }) => ({
      id: t.id,
      date: t.date || new Date().toISOString(),
      status: t.status as BOEStatus,
      note: t.note || "Status updated",
      author: t.author?.full_name || t.author?.email || "System",
    }))

    return { data: mapped, error: null }
  } catch (err) {
    console.error("Unexpected error in getBOETimeline action:", err)
    return { data: null, error: err instanceof Error ? err.message : "Failed to load timeline" }
  }
}

export async function addTimelineEntry(payload: {
  boeId: string
  status: string
  note: string
}): Promise<{ success: boolean; data?: BOETimelineEvent; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Auth check
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can record timeline entries." }
    }

    if (!payload.note || !payload.note.trim()) {
      return { success: false, error: "A note/description is required for timeline entries." }
    }

    // 2. Insert timeline row
    const { data: newRow, error: insertError } = await supabase
      .from("boe_timeline")
      .insert({
        boe_id: payload.boeId,
        status: payload.status,
        note: payload.note.trim(),
        author_id: userData.user.id,
        date: new Date().toISOString(),
      })
      .select("id, status, note, date")
      .single()

    if (insertError) {
      console.error("Error inserting timeline entry:", insertError)
      return { success: false, error: insertError.message }
    }

    revalidatePath(`/boe/${payload.boeId}`)
    revalidatePath("/boe")

    const mapped: BOETimelineEvent = {
      id: newRow.id,
      date: newRow.date || new Date().toISOString(),
      status: newRow.status as BOEStatus,
      note: newRow.note || "",
      author: profile.full_name || profile.email || "User",
    }

    return { success: true, data: mapped }
  } catch (err) {
    console.error("Unexpected error in addTimelineEntry action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to add timeline entry" }
  }
}

export async function updateBOEStatus(
  boeId: string,
  newStatus: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Auth check
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData.user) {
      return { success: false, error: "Authentication required" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || (profile.role !== "Admin" && profile.role !== "Employee")) {
      return { success: false, error: "Unauthorized: Only Admins and Employees can update BOE status." }
    }

    if (!note || !note.trim()) {
      return { success: false, error: "A note/reason is required for status changes." }
    }

    // 2. Fetch current status
    const { data: currentBOE, error: findError } = await supabase
      .from("bills_of_entry")
      .select("status")
      .eq("id", boeId)
      .single()

    if (findError || !currentBOE) {
      return { success: false, error: "Bill of Entry record not found." }
    }

    const currentStatus = currentBOE.status || "Draft"
    if (currentStatus === newStatus) {
      return { success: false, error: `BOE is already in '${newStatus}' status.` }
    }

    // 3. Validate transition matrix
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || []
    if (!allowed.includes(newStatus) && profile.role !== "Admin") {
      return {
        success: false,
        error: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed next steps: ${
          allowed.length > 0 ? allowed.join(", ") : "None (Terminal State)"
        }.`,
      }
    }

    // 4. Update status in database
    const { error: updateError } = await supabase
      .from("bills_of_entry")
      .update({
        status: newStatus as Database["public"]["Enums"]["boe_status"],
        updated_at: new Date().toISOString(),
      })
      .eq("id", boeId)

    if (updateError) {
      console.error("Error updating BOE status in Supabase:", updateError)
      return { success: false, error: updateError.message }
    }

    // 5. Add audit entry to boe_timeline
    await addTimelineEntry({
      boeId,
      status: newStatus,
      note: note.trim(),
    })

    revalidatePath(`/boe/${boeId}`)
    revalidatePath("/boe")

    return { success: true }
  } catch (err) {
    console.error("Unexpected error in updateBOEStatus action:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to update status." }
  }
}
