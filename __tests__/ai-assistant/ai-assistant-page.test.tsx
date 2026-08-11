import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import AIAssistantPage from '@/app/(app)/ai-assistant/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/ai-assistant'
}))

describe('AI Assistant Page', () => {
  it('renders correctly', () => {
    const { container } = render(<AIAssistantPage />)
    expect(container).toBeTruthy()
  })
})
