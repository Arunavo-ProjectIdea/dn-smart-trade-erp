import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import HSCodesPage from '@/app/(app)/hs-codes/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/hs-codes'
}))

describe('HS Codes Page', () => {
  it('renders correctly', () => {
    const { container } = render(<HSCodesPage />)
    expect(container).toBeTruthy()
  })
})
