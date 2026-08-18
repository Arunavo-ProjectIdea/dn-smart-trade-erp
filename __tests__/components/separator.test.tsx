import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Separator } from '@/components/ui/separator'

describe('Separator Component', () => {
  it('TC1101: renders horizontal separator correctly', () => {
    render(<Separator data-testid="sep" />)
    const sep = screen.getByTestId('sep')
    expect(sep).toBeInTheDocument()
    expect(sep.className).toContain('shrink-0 bg-border')
    expect(sep.className).toContain('data-horizontal:w-full')
  })

  it('TC1102: renders vertical separator correctly', () => {
    render(<Separator orientation="vertical" data-testid="sep" />)
    const sep = screen.getByTestId('sep')
    expect(sep.className).toContain('data-vertical:w-px')
  })

  it('TC1103: merges custom class names', () => {
    render(<Separator className="my-4" data-testid="sep" />)
    const sep = screen.getByTestId('sep')
    expect(sep.className).toContain('my-4')
  })
})
