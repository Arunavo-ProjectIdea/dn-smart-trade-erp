import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Checkbox } from '@/components/ui/checkbox'
import userEvent from '@testing-library/user-event'

describe('Checkbox Component', () => {
  it('TC901: renders checkbox correctly', () => {
    render(<Checkbox data-testid="chk" />)
    expect(screen.getByTestId('chk')).toBeInTheDocument()
  })

  it('TC902: applies default classes', () => {
    render(<Checkbox data-testid="chk" />)
    const chk = screen.getByTestId('chk')
    expect(chk.className).toContain('peer relative flex size-4 shrink-0')
  })

  it('TC903: handles checked state internally', async () => {
    render(<Checkbox data-testid="chk" />)
    const chk = screen.getByTestId('chk')
    
    // Initial state
    expect(chk.hasAttribute('data-checked')).toBe(false)
    
    await userEvent.click(chk)
    
    expect(chk.hasAttribute('data-checked')).toBe(true)
  })
  
  it('TC904: can be disabled', async () => {
    render(<Checkbox data-testid="chk" disabled />)
    const chk = screen.getByTestId('chk')
    expect(chk.hasAttribute('data-disabled')).toBe(true)
    
    await userEvent.click(chk)
    expect(chk.hasAttribute('data-checked')).toBe(false)
  })
})
