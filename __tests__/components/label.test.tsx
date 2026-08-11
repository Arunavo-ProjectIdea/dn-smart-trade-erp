import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Label } from '@/components/ui/label'

describe('Label Component', () => {
  it('TC601: renders label correctly', () => {
    render(<Label>Username</Label>)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('TC602: applies default classes', () => {
    render(<Label data-testid="lbl">Username</Label>)
    const lbl = screen.getByTestId('lbl')
    expect(lbl.className).toContain('text-sm leading-none font-medium')
  })

  it('TC603: merges custom class names', () => {
    render(<Label className="custom-label-class" data-testid="lbl">Username</Label>)
    const lbl = screen.getByTestId('lbl')
    expect(lbl.className).toContain('custom-label-class')
    expect(lbl.className).toContain('text-sm')
  })

  it('TC604: handles htmlFor attribute correctly', () => {
    render(
      <>
        <Label htmlFor="username">Username</Label>
        <input id="username" />
      </>
    )
    const lbl = screen.getByText('Username')
    expect(lbl.getAttribute('for')).toBe('username')
  })
})
