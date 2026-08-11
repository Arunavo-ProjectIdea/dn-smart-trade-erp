import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import DashboardPage from '@/app/(app)/dashboard/page'

vi.mock('@/actions/auth.actions', () => ({
  getUserProfile: vi.fn().mockResolvedValue({ data: { role: 'Admin' } })
}))

vi.mock('@/actions/dashboard.actions', () => ({
  getDashboardStats: vi.fn().mockResolvedValue({ data: {
    totalClients: 10, totalShipments: 20, totalDocuments: 30, totalBOE: 40, 
    activeEmployees: 5, pendingDocuments: 2, pendingShipments: 1, 
    activeShipments: 3, last30DaysClients: 1, last30DaysShipments: 2, last30DaysDocuments: 3
  } }),
  getRecentActivities: vi.fn().mockResolvedValue({ data: [] }),
  getRecentDocuments: vi.fn().mockResolvedValue({ data: [] }),
  getRecentShipments: vi.fn().mockResolvedValue({ data: [] })
}))

describe('DashboardPage', () => {
  it('renders Admin Dashboard title and stats', async () => {
    const page = await DashboardPage()
    render(page)
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Active Shipments')).toBeInTheDocument()
  })
})
