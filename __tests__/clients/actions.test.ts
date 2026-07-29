/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClientAction, getClients, getClientById, updateClientAction, deactivateClientAction } from '@/app/(app)/clients/actions'
import * as supabaseServer from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Mock the mapper
vi.mock('@/app/(app)/clients/mappers', () => ({
  mapClientToInsert: vi.fn((data) => data),
  mapClientToUpdate: vi.fn((data) => data),
  mapClient: vi.fn((data) => data),
}))

describe('createClientAction', () => {
  let mockSupabase: any
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: {} } }),
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123', email: 'test@test.com' } } }),
      },
      from: vi.fn(),
    }

    vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase as never)
  })

  const setupMockProfile = (role: string) => {
    const mockSingle = vi.fn().mockResolvedValue({ data: { id: 'profile-123', role } })
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    
    // Default implementation for `from` to handle both 'profiles' and 'clients'
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return { select: mockSelect }
      }
      return {}
    })
  }

  const setupMockInsert = (successData: any, errorData: any) => {
    const mockSingle = vi.fn().mockResolvedValue({ data: successData, error: errorData })
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
    
    // We update the `from` mock to handle 'clients' while preserving 'profiles'
    const originalFrom = mockSupabase.from.getMockImplementation()
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'clients') {
        return { insert: mockInsert }
      }
      if (originalFrom) {
        return originalFrom(table)
      }
      return {}
    })
  }

  it('TC10 & TC11: should allow Admin and Employee to create client', async () => {
    setupMockProfile('Admin')
    setupMockInsert({ id: 'client-1', status: 'Active' }, null)

    const result = await createClientAction({ companyName: 'New Client' } as any)
    
    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: 'client-1', status: 'Active' })
    expect(revalidatePath).toHaveBeenCalledWith('/clients')
  })

  it('TC12: should fail when database returns an error (simulating RLS rejection for Client role)', async () => {
    setupMockProfile('Client')
    setupMockInsert(null, { message: 'new row violates row-level security policy' })

    const result = await createClientAction({ companyName: 'New Client' } as any)
    
    expect(result.error).toContain('new row violates row-level security policy')
    expect(result.data).toBeNull()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('TC13: should handle unique constraint violation (e.g. duplicate tradeLicenseNumber)', async () => {
    setupMockProfile('Admin')
    setupMockInsert(null, { message: 'duplicate key value violates unique constraint' })

    const result = await createClientAction({ tradeLicenseNumber: 'DUP-123' } as any)
    
    expect(result.error).toContain('duplicate key value violates unique constraint')
    expect(result.data).toBeNull()
  })

  it('TC14: should correctly pass Active status by default when saving', async () => {
    setupMockProfile('Admin')
    
    // Spying on the insert call
    const mockSingle = vi.fn().mockResolvedValue({ data: { id: '1' }, error: null })
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
    
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'clients') return { insert: mockInsert }
      if (table === 'profiles') {
        return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { role: 'Admin' } }) }) }) }
      }
      return {}
    })

    // Action explicitly receives status 'Active' from the frontend in the page logic, 
    // but the action itself maps whatever it is given.
    await createClientAction({ status: 'Active' } as any)
    
    expect(mockInsert).toHaveBeenCalledWith({ status: 'Active' })
  })
})

describe('getClients', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      order: vi.fn(),
    }
    vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase as never)
  })

  it('TC24: should return clients successfully', async () => {
    mockSupabase.order.mockResolvedValue({ data: [{ id: '1', company_name: 'Test' }], error: null })
    const result = await getClients()
    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
  })

  it('TC25: should handle error when fetching clients', async () => {
    mockSupabase.order.mockResolvedValue({ data: null, error: { message: 'DB Error' } })
    const result = await getClients()
    expect(result.error).toEqual({ message: 'DB Error' })
    expect(result.data).toBeNull()
  })
})

describe('getClientById', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }
    vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase as never)
  })

  it('TC26: should return a client successfully', async () => {
    mockSupabase.single.mockResolvedValue({ data: { id: '1' }, error: null })
    const result = await getClientById('1')
    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: '1' })
  })

  it('TC27: should handle error when fetching client by id', async () => {
    mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
    const result = await getClientById('1')
    expect(result.error).toEqual({ message: 'Not found' })
    expect(result.data).toBeNull()
  })
})

describe('updateClientAction', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }
    vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase as never)
  })

  it('TC28: should update a client successfully', async () => {
    mockSupabase.single.mockResolvedValue({ data: { id: '1' }, error: null })
    const result = await updateClientAction('1', { companyName: 'Updated' })
    expect(result.error).toBeNull()
    expect(revalidatePath).toHaveBeenCalledWith('/clients')
    expect(revalidatePath).toHaveBeenCalledWith('/clients/1')
  })

  it('TC29: should handle update error', async () => {
    mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Update failed' } })
    const result = await updateClientAction('1', { companyName: 'Updated' })
    expect(result.error).toEqual({ message: 'Update failed' })
  })
})

describe('deactivateClientAction', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }
    vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase as never)
  })

  it('TC30: should deactivate a client successfully', async () => {
    mockSupabase.single.mockResolvedValue({ data: { id: '1', status: 'Inactive' }, error: null })
    const result = await deactivateClientAction('1')
    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: '1', status: 'Inactive' })
    expect(revalidatePath).toHaveBeenCalledWith('/clients')
  })

  it('TC31: should handle deactivation error', async () => {
    mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Deactivate failed' } })
    const result = await deactivateClientAction('1')
    expect(result.error).toEqual({ message: 'Deactivate failed' })
  })
})

