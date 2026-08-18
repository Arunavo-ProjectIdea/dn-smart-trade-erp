import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton Component', () => {
  it('TC1001: renders skeleton correctly', () => {
    render(<Skeleton data-testid="skel" />)
    expect(screen.getByTestId('skel')).toBeInTheDocument()
  })

  it('TC1002: applies default classes', () => {
    render(<Skeleton data-testid="skel" />)
    const skel = screen.getByTestId('skel')
    expect(skel.className).toContain('animate-pulse rounded-lg bg-muted/60')
  })

  it('TC1003: merges custom class names', () => {
    render(<Skeleton className="h-4 w-[200px]" data-testid="skel" />)
    const skel = screen.getByTestId('skel')
    expect(skel.className).toContain('h-4 w-[200px]')
    expect(skel.className).toContain('animate-pulse')
  })
})
