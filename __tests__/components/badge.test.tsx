import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('TC301: renders badge correctly', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('TC302: applies default variant classes', () => {
    render(<Badge data-testid="b1">Default</Badge>)
    const badge = screen.getByTestId('b1')
    expect(badge.className).toContain('bg-primary')
  })

  it('TC303: applies secondary variant classes', () => {
    render(<Badge variant="secondary" data-testid="b2">Secondary</Badge>)
    const badge = screen.getByTestId('b2')
    expect(badge.className).toContain('bg-secondary')
  })

  it('TC304: applies destructive variant classes', () => {
    render(<Badge variant="destructive" data-testid="b3">Destructive</Badge>)
    const badge = screen.getByTestId('b3')
    expect(badge.className).toContain('bg-destructive/10')
  })

  it('TC305: applies outline variant classes', () => {
    render(<Badge variant="outline" data-testid="b4">Outline</Badge>)
    const badge = screen.getByTestId('b4')
    expect(badge.className).toContain('border-border')
  })

  it('TC306: applies ghost variant classes', () => {
    render(<Badge variant="ghost" data-testid="b5">Ghost</Badge>)
    const badge = screen.getByTestId('b5')
    expect(badge.className).toContain('hover:bg-muted')
  })

  it('TC307: applies link variant classes', () => {
    render(<Badge variant="link" data-testid="b6">Link</Badge>)
    const badge = screen.getByTestId('b6')
    expect(badge.className).toContain('underline')
  })

  it('TC308: merges custom class names', () => {
    render(<Badge className="custom-class" data-testid="b7">Custom</Badge>)
    const badge = screen.getByTestId('b7')
    expect(badge.className).toContain('custom-class')
    expect(badge.className).toContain('bg-primary')
  })
})
