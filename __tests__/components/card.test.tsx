import { render, screen } from '@testing-library/react'
import { expect, describe, it } from 'vitest'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

describe('Card Components', () => {
  it('TC801: renders Card and all sub-components correctly', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="content">
          <p>Content</p>
        </CardContent>
        <CardFooter data-testid="footer">
          <button>Footer Button</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer Button')).toBeInTheDocument()
  })

  it('TC802: Card applies default classes', () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('bg-card')
  })

  it('TC803: CardHeader applies default classes', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    const header = screen.getByTestId('header')
    expect(header.className).toContain('grid')
  })

  it('TC804: CardTitle applies default classes', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    const title = screen.getByTestId('title')
    expect(title.className).toContain('font-heading')
  })

  it('TC805: CardDescription applies default classes', () => {
    render(<CardDescription data-testid="desc">Desc</CardDescription>)
    const desc = screen.getByTestId('desc')
    expect(desc.className).toContain('text-muted-foreground')
  })

  it('TC806: CardContent applies default classes', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    const content = screen.getByTestId('content')
    expect(content.className).toContain('px-')
  })

  it('TC807: CardFooter applies default classes', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    const footer = screen.getByTestId('footer')
    expect(footer.className).toContain('flex items-center rounded-b-xl')
  })

  it('TC808: custom classes merge correctly in Card', () => {
    render(<Card className="my-custom-card" data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('my-custom-card')
    expect(card.className).toContain('bg-card')
  })
})
