import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Input } from '@/components/ui/input'
import userEvent from '@testing-library/user-event'

describe('Input Component', () => {
  it('TC501: renders input correctly', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('TC502: applies default classes', () => {
    render(<Input data-testid="inp" />)
    const inp = screen.getByTestId('inp')
    expect(inp.className).toContain('flex h-10 w-full')
  })

  it('TC503: merges custom class names', () => {
    render(<Input className="custom-input-class" data-testid="inp" />)
    const inp = screen.getByTestId('inp')
    expect(inp.className).toContain('custom-input-class')
    expect(inp.className).toContain('border-input')
  })

  it('TC504: passes standard input attributes', () => {
    render(<Input type="password" required disabled data-testid="inp" />)
    const inp = screen.getByTestId('inp') as HTMLInputElement
    expect(inp.type).toBe('password')
    expect(inp.required).toBe(true)
    expect(inp.disabled).toBe(true)
  })

  it('TC505: handles user input', async () => {
    render(<Input data-testid="inp" />)
    const inp = screen.getByTestId('inp') as HTMLInputElement
    await userEvent.type(inp, 'Hello')
    expect(inp.value).toBe('Hello')
  })
})
