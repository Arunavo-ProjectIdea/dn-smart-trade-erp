import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TrackingTimeline } from '@/components/erp/tracking-timeline'

describe('Tracking Timeline', () => {
  it('renders correctly', () => {
    const { container } = render(<TrackingTimeline events={[]} />)
    expect(container).toBeTruthy()
  })
})
