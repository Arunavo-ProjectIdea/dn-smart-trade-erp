import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import ShipmentsPage from '@/app/(app)/shipments/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/shipments'
}))

describe('Shipments Page', () => {
  it('renders correctly', () => {
    const { container } = render(<ShipmentsPage />)
    expect(container).toBeTruthy()
  })
})
