"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapProfileToEmployee } from "@/utils/mappers/employee.mapper"
import { Employee } from "@/types/employee"

export async function getEmployees(): Promise<{ success: boolean; data?: Employee[]; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) throw error

    const employees = (profiles || []).map(mapProfileToEmployee)
    return { success: true, data: employees }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function getEmployeeById(id: string): Promise<{ success: boolean; data?: Employee; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!profile) throw new Error("Employee not found")

    return { success: true, data: mapProfileToEmployee(profile) }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateEmployeeStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'Admin') {
      throw new Error("Forbidden: Only Admins can update employee status")
    }

    const { error } = await supabase
      .from('profiles')
      .update({ status: status as any })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/employees')
    revalidatePath(`/employees/${id}`)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'Admin'

    // Only Admins can update other employees
    if (id !== user.id && !isAdmin) {
      throw new Error("Forbidden: You can only update your own profile")
    }

    // We do NOT update email here, as it requires auth updates.
    // We only update profile metadata.
    const updates: any = {
      full_name: data.fullName,
      phone: data.phone,
      department: data.department,
      designation: data.designation,
      username: data.username,
    }

    // Only Admins can change role and status
    if (isAdmin) {
      if (data.role) updates.role = data.role
      if (data.status) updates.status = data.status
    }

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key as keyof typeof updates] === undefined && delete updates[key as keyof typeof updates])

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/employees')
    revalidatePath(`/employees/${id}`)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function createEmployee(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'Admin') {
      throw new Error("Forbidden: Only Admins can create employees")
    }

    // MUST use admin client to create user without logging out the current admin session
    const adminAuthClient = createAdminClient()
    
    // 1. Create the Auth User
    const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
      email: data.email,
      password: data.password || 'TempPass123!', // Ensure a secure default or passed in
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName,
      }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error("User creation failed, no user returned.")

    const newUserId = authData.user.id

    // Give the database trigger 'handle_new_user' a moment to commit the initial profile row
    // In some fast environments, the update below might fire before the trigger finishes.
    await new Promise(resolve => setTimeout(resolve, 500))

    // 2. Update the profile with remaining details
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        department: data.department || null,
        designation: data.designation || null,
        phone: data.phone || null,
        role: (data.role as any) || 'Employee',
        status: (data.status as any) || 'Active',
      } as any)
      .eq('id', newUserId)

    if (profileError) {
      throw profileError
    }

    revalidatePath('/employees')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
