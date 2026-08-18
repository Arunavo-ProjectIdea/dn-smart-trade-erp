import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ReportsPage from '@/app/(app)/reports/page'

vi.mock('@/actions/auth.actions', () => ({
  getUserProfile: vi.fn().mockResolvedValue({ success: true, data: { role: 'Admin' } })
}))

vi.mock('@/actions/report.actions', () => ({
  getReportKPIs: vi.fn().mockResolvedValue({ data: {} }),
  getShipmentAnalytics: vi.fn().mockResolvedValue({ data: {} }),
  getDocumentAnalytics: vi.fn().mockResolvedValue({ data: {} }),
  getClientAnalytics: vi.fn().mockResolvedValue({ data: {} }),
  getMonthlyTrends: vi.fn().mockResolvedValue({ data: [] }),
  getReportTableRows: vi.fn().mockResolvedValue({ data: [] })
}))

vi.mock('@/app/(app)/reports/reports-client', () => ({
  default: () => <div data-testid="reports-client">Reports Client Component</div>
}))

describe('ReportsPage', () => {
  it('renders ReportsClient component', async () => {
    const page = await ReportsPage()
    render(page)
    expect(screen.getByTestId('reports-client')).toBeInTheDocument()
  })
})
