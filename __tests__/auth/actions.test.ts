import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signIn, signOut, resetPassword, getCurrentUser, getUserProfile } from '@/actions/auth.actions'
import * as supabaseServer from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

describe('Auth Actions', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockSupabase = {
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        getUser: vi.fn(),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }

    vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase as never)
  })

  describe('signIn', () => {
    it('should return error if email or password are missing', async () => {
      const formData = new FormData()
      formData.append('email', 'test@test.com')
      // Missing password
      
      const result = await signIn(formData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Email and password are required')
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('should handle successful sign in', async () => {
      const formData = new FormData()
      formData.append('email', 'test@test.com')
      formData.append('password', 'password123')
      
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { session: {} },
        error: null
      })

      const result = await signIn(formData)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      })
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('should handle sign in error', async () => {
      const formData = new FormData()
      formData.append('email', 'test@test.com')
      formData.append('password', 'wrong')
      
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      })

      const result = await signIn(formData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid login credentials')
    })
  })

  describe('signOut', () => {
    it('should handle successful sign out', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      const result = await signOut()
      
      expect(result.success).toBe(true)
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('should handle sign out error', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: { message: 'Network error' } })

      const result = await signOut()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('resetPassword', () => {
    it('should return error if email is missing', async () => {
      const formData = new FormData()
      
      const result = await resetPassword(formData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Email is required')
    })

    it('should handle successful reset request', async () => {
      const formData = new FormData()
      formData.append('email', 'test@test.com')
      
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null
      })

      const result = await resetPassword(formData)
      
      expect(result.success).toBe(true)
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@test.com')
    })

    it('should handle reset request error', async () => {
      const formData = new FormData()
      formData.append('email', 'test@test.com')
      
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: { message: 'User not found' }
      })

      const result = await resetPassword(formData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('User not found')
    })
  })

  describe('getCurrentUser', () => {
    it('should return user if authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      })

      const result = await getCurrentUser()
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ id: '123' })
    })

    it('should return error if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: 'Not logged in' }
      })

      const result = await getCurrentUser()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not logged in')
    })
  })

  describe('getUserProfile', () => {
    it('should return profile and user if both exist', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      })

      mockSupabase.single.mockResolvedValue({
        data: { id: 'profile-123', role: 'Admin' },
        error: null
      })

      const result = await getUserProfile()
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        id: 'profile-123',
        role: 'Admin',
        user: { id: '123' }
      })
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    })

    it('should return error if user is not found', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: 'User not found' }
      })

      const result = await getUserProfile()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('User not found')
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('should return error if profile is not found', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      })

      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' }
      })

      const result = await getUserProfile()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Profile not found')
    })
  })
})
