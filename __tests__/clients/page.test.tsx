/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AddClientPage from '@/app/(app)/clients/new/page'
import { createClientAction } from '@/app/(app)/clients/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

vi.mock('@/app/(app)/clients/actions', () => ({
  createClientAction: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('AddClientPage', () => {
  let mockPush: any
  let user: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
    user = userEvent.setup()
  })

  const fillRequiredFields = async () => {
    await user.type(screen.getByLabelText(/Company Name \*/i), 'Test Co')
    await user.type(screen.getByLabelText(/Contact Person \*/i), 'John')
    await user.type(screen.getByLabelText(/Email Address \*/i), 'test@test.com')
    await user.type(screen.getByLabelText(/Phone Number \*/i), '123456789')
  }

  it('TC01 & TC02 & TC03: renders all fields and buttons correctly', () => {
    render(<AddClientPage />)
    
    // Required fields
    expect(screen.getByLabelText(/Company Name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contact Person \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Client Type \*/i)).toBeInTheDocument()
    
    // Optional fields
    expect(screen.getByLabelText(/Registered Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Trade License Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/BIN Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/TIN Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Internal Notes/i)).toBeInTheDocument()

    // Buttons
    expect(screen.getByRole('button', { name: /Create Client/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
  })

  it('TC04 & TC05: prevents submission if required fields are missing or invalid (HTML5)', async () => {
    render(<AddClientPage />)
    
    const submitBtn = screen.getByRole('button', { name: /Create Client/i })
    fireEvent.click(submitBtn)
    
    // Should not call the action because HTML5 validation stops it
    expect(createClientAction).not.toHaveBeenCalled()
  })

  it('TC06: updates state when typing in inputs', async () => {
    render(<AddClientPage />)
    const companyInput = screen.getByLabelText(/Company Name \*/i)
    await user.type(companyInput, 'Acme Corp')
    expect(companyInput).toHaveValue('Acme Corp')
  })

  // Select component in Radix UI is tricky to test with userEvent directly due to portals
  // We'll test the submission payload instead to verify state updates.
  it('TC07 & TC15 & TC16 & TC17: success flow behavior', async () => {
    vi.mocked(createClientAction).mockResolvedValue({ error: null, data: { id: '1' } } as any)
    render(<AddClientPage />)
    
    await fillRequiredFields()
    
    const submitBtn = screen.getByRole('button', { name: /Create Client/i })
    
    // Wait for the form submission to be handled
    fireEvent.submit(submitBtn.closest('form')!)
    
    // Check loading state (button disabled or showing spinner - in this UI we check if it was disabled)
    // Actually the button receives `isSubmitting` in FormLayout, let's just wait for action
    await waitFor(() => {
      expect(createClientAction).toHaveBeenCalledWith({
        companyName: 'Test Co',
        contactPerson: 'John',
        email: 'test@test.com',
        phone: '123456789',
        address: '',
        clientType: 'Importer',
        tradeLicenseNumber: '',
        binNumber: '',
        tinNumber: '',
        notes: '',
        status: 'Active'
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Client created successfully')
    expect(mockPush).toHaveBeenCalledWith('/clients')
  })

  it('TC18 & TC19: error handling flow', async () => {
    vi.mocked(createClientAction).mockResolvedValue({ error: 'DB Error', data: null } as any)
    render(<AddClientPage />)
    
    await fillRequiredFields()
    
    const submitBtn = screen.getByRole('button', { name: /Create Client/i })
    fireEvent.submit(submitBtn.closest('form')!)
    
    await waitFor(() => {
      expect(createClientAction).toHaveBeenCalled()
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to create client')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('TC20: cancels and navigates away', async () => {
    render(<AddClientPage />)
    
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    await user.click(cancelBtn)
    
    expect(mockPush).toHaveBeenCalledWith('/clients')
    expect(createClientAction).not.toHaveBeenCalled()
  })

  it('TC21: updates state for all optional fields and dropdowns', async () => {
    vi.mocked(createClientAction).mockResolvedValue({ error: null, data: { id: '2' } } as any)
    render(<AddClientPage />)
    
    await fillRequiredFields()
    
    await user.type(screen.getByLabelText(/Registered Address/i), '123 Optional St')
    await user.type(screen.getByLabelText(/Trade License Number/i), 'TL-999')
    await user.type(screen.getByLabelText(/BIN Number/i), 'BIN-999')
    await user.type(screen.getByLabelText(/TIN Number/i), 'TIN-999')
    await user.type(screen.getByLabelText(/Internal Notes/i), 'Some notes')

    // Click select and choose 'Exporter'
    const selectTrigger = screen.getByRole('combobox')
    await user.click(selectTrigger)
    const exporterOption = await screen.findByRole('option', { name: 'Exporter' })
    await user.click(exporterOption)
    
    const submitBtn = screen.getByRole('button', { name: /Create Client/i })
    fireEvent.submit(submitBtn.closest('form')!)
    
    await waitFor(() => {
      expect(createClientAction).toHaveBeenCalledWith(expect.objectContaining({
        address: '123 Optional St',
        tradeLicenseNumber: 'TL-999',
        binNumber: 'BIN-999',
        tinNumber: 'TIN-999',
        notes: 'Some notes',
        clientType: 'Exporter',
      }))
    })
  })
})
