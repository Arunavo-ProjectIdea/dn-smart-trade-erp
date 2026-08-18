import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { KPICards } from '@/components/reports/kpi-cards'

describe('KPICards', () => {
  it('renders primary KPI cards', () => {
    const mockData = {
      activeShipments: 10,
      completedShipments: 5,
      totalDocuments: 15,
      totalClients: 20,
      totalBOE: 25
    } as any

    render(<KPICards data={mockData} userRole="Admin" />)
    
    expect(screen.getByText('Active Shipments')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Total Clients')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('hides secondary cards for Client role', () => {
    const mockData = {
      activeShipments: 10,
      completedShipments: 5,
      totalDocuments: 15,
      totalClients: 20,
      totalBOE: 25
    } as any

    render(<KPICards data={mockData} userRole="Client" />)
    
    expect(screen.getByText('Active Shipments')).toBeInTheDocument()
    expect(screen.queryByText('Total Clients')).not.toBeInTheDocument()
  })
})
