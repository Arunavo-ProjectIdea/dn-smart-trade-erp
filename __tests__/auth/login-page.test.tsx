 
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import LoginPage from '@/app/login/page'
import { signIn } from '@/actions/auth.actions'
import { useRouter } from 'next/navigation'

vi.mock('@/actions/auth.actions', () => ({
  signIn: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('LoginPage', () => {
  let mockPush: any
  let user: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
    user = userEvent.setup()
  })

  it('renders all fields and buttons correctly', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('prevents submission if required fields are missing (HTML5)', async () => {
    render(<LoginPage />)
    
    const submitBtn = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.click(submitBtn)
    
    expect(signIn).not.toHaveBeenCalled()
  })

  it('updates state when typing in inputs', async () => {
    render(<LoginPage />)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'secret')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('secret')
  })

  it('handles successful login flow', async () => {
    vi.mocked(signIn).mockResolvedValue({ success: true } as any)
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^Password$/i), 'secret')
    
    const submitBtn = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.submit(submitBtn.closest('form')!)
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalled()
    })

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('handles error login flow', async () => {
    vi.mocked(signIn).mockResolvedValue({ success: false, error: 'Invalid credentials' } as any)
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^Password$/i), 'wrong')
    
    const submitBtn = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.submit(submitBtn.closest('form')!)
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalled()
    })

    expect(mockPush).not.toHaveBeenCalled()
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

})
