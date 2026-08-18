import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import ShipmentsPage from '@/app/(app)/shipments/page'
import { ShipmentForm } from '@/components/erp/shipment-form'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/shipments'
}))

describe('Shipment Workflow Integration', () => {
  it('should render shipments page and shipment form without crashing', () => {
    const page = render(<ShipmentsPage />)
    expect(page.container).toBeTruthy()
    
    const form = render(<ShipmentForm />)
    expect(form.container).toBeTruthy()
  })
})
