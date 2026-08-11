import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Textarea } from '@/components/ui/textarea'
import userEvent from '@testing-library/user-event'

describe('Textarea Component', () => {
  it('TC701: renders textarea correctly', () => {
    render(<Textarea placeholder="Enter your message" />)
    expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument()
  })

  it('TC702: applies default classes', () => {
    render(<Textarea data-testid="txtarea" />)
    const txtarea = screen.getByTestId('txtarea')
    expect(txtarea.className).toContain('flex field-sizing-content min-h-[80px]')
  })

  it('TC703: merges custom class names', () => {
    render(<Textarea className="custom-textarea-class" data-testid="txtarea" />)
    const txtarea = screen.getByTestId('txtarea')
    expect(txtarea.className).toContain('custom-textarea-class')
    expect(txtarea.className).toContain('border-input')
  })

  it('TC704: passes standard textarea attributes', () => {
    render(<Textarea required disabled rows={5} data-testid="txtarea" />)
    const txtarea = screen.getByTestId('txtarea') as HTMLTextAreaElement
    expect(txtarea.required).toBe(true)
    expect(txtarea.disabled).toBe(true)
    expect(txtarea.rows).toBe(5)
  })

  it('TC705: handles user input', async () => {
    render(<Textarea data-testid="txtarea" />)
    const txtarea = screen.getByTestId('txtarea') as HTMLTextAreaElement
    await userEvent.type(txtarea, 'Hello world\nNew line')
    expect(txtarea.value).toBe('Hello world\nNew line')
  })
})
