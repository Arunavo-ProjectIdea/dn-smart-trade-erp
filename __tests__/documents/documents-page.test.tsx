import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import DocumentsPage from '@/app/(app)/documents/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/documents'
}))

describe('Documents Page', () => {
  it('renders correctly', () => {
    const { container } = render(<DocumentsPage />)
    expect(container).toBeTruthy()
  })
})
