import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, describe, it, vi } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('TC401: renders button correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('TC402: applies default variant and size classes', () => {
    render(<Button data-testid="btn">Default</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('bg-primary')
    expect(btn.className).toContain('h-10')
  })

  it('TC403: applies outline variant', () => {
    render(<Button variant="outline" data-testid="btn">Outline</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('border-border')
  })

  it('TC404: applies secondary variant', () => {
    render(<Button variant="secondary" data-testid="btn">Secondary</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('bg-secondary')
  })

  it('TC405: applies destructive variant', () => {
    render(<Button variant="destructive" data-testid="btn">Destructive</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('bg-destructive/10')
  })

  it('TC406: applies ghost variant', () => {
    render(<Button variant="ghost" data-testid="btn">Ghost</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('hover:bg-muted')
  })

  it('TC407: applies link variant', () => {
    render(<Button variant="link" data-testid="btn">Link</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('underline-offset-4')
  })

  it('TC408: applies sm size classes', () => {
    render(<Button size="sm" data-testid="btn">Small</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('h-9')
  })

  it('TC409: applies lg size classes', () => {
    render(<Button size="lg" data-testid="btn">Large</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('h-11')
  })

  it('TC410: applies icon size classes', () => {
    render(<Button size="icon" data-testid="btn">Icon</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('size-10')
  })

  it('TC411: merges custom class names', () => {
    render(<Button className="my-custom-btn" data-testid="btn">Custom</Button>)
    const btn = screen.getByTestId('btn')
    expect(btn.className).toContain('my-custom-btn')
    expect(btn.className).toContain('bg-primary')
  })

  it('TC412: forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref} data-testid="btn">Ref</Button>)
    expect(ref.current).not.toBeNull()
    expect((ref.current as any).tagName).toBe('BUTTON')
  })

  it('TC413: passes standard button attributes', () => {
    render(<Button disabled type="submit" data-testid="btn">Submit</Button>)
    const btn = screen.getByTestId('btn') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(btn.type).toBe('submit')
  })

  it('TC414: calls onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    await userEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('TC415: does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    await userEvent.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
