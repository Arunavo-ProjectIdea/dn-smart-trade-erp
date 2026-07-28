import { describe, it, expect } from 'vitest'
import { mapClientToInsert, mapClientToUpdate, mapClient } from '@/app/(app)/clients/mappers'
import { Client } from '@/lib/mock-data/clients'
import { Database } from '@/lib/supabase/types'

describe('Client Mappers', () => {
  describe('mapClient', () => {
    it('TC21: should map snake_case DB row to camelCase frontend object', () => {
      const dbRow: Database['public']['Tables']['clients']['Row'] = {
        id: '123',
        company_name: 'Test Co',
        contact_person: 'John Doe',
        phone: '123',
        email: 'test@test.com',
        address: '123 Test St',
        trade_license_number: 'TL',
        bin_number: 'BIN',
        tin_number: 'TIN',
        client_type: 'Both',
        status: 'Active',
        notes: 'Notes',
        created_at: '2024',
        updated_at: '2024'
      }
      const result = mapClient(dbRow)
      expect(result.companyName).toBe('Test Co')
      expect(result.tradeLicenseNumber).toBe('TL')
      expect(result.totalShipments).toBe(0)
    })
  })

  describe('mapClientToInsert', () => {
    it('TC08: should map camelCase frontend object to snake_case DB object', () => {
      const clientData: Partial<Client> = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        phone: '1234567890',
        email: 'test@example.com',
        address: '123 Test St',
        tradeLicenseNumber: 'TL-123',
        binNumber: 'BIN-123',
        tinNumber: 'TIN-123',
        clientType: 'Importer',
        status: 'Active',
        notes: 'Test note',
      }

      const result = mapClientToInsert(clientData)

      expect(result).toEqual({
        company_name: 'Test Company',
        contact_person: 'John Doe',
        phone: '1234567890',
        email: 'test@example.com',
        address: '123 Test St',
        trade_license_number: 'TL-123',
        bin_number: 'BIN-123',
        tin_number: 'TIN-123',
        client_type: 'Importer',
        status: 'Active',
        notes: 'Test note',
      })
    })

    it('TC09: should map empty strings for unique fields to null', () => {
      const clientData: Partial<Client> = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        phone: '1234567890',
        email: 'test@example.com',
        address: '123 Test St',
        tradeLicenseNumber: '',
        binNumber: '',
        tinNumber: '',
        clientType: 'Importer',
        status: 'Active',
        notes: '',
      }

      const result = mapClientToInsert(clientData)

      expect(result.trade_license_number).toBeNull()
      expect(result.bin_number).toBeNull()
      expect(result.tin_number).toBeNull()
    })
    
    it('TC22: should pass id if id is provided in insert payload', () => {
      const clientData: Partial<Client> = {
        id: 'uuid-123',
        companyName: 'Test Co',
        contactPerson: 'John',
        phone: '123',
        email: 'test@test.com',
        address: '123 St',
      }
      const result = mapClientToInsert(clientData)
      expect(result.id).toBe('uuid-123')
    })
  })

  describe('mapClientToUpdate', () => {
    it('TC23: should map frontend updates to DB updates', () => {
      const clientData: Partial<Client> = {
        companyName: 'Updated Co',
        tradeLicenseNumber: '',
      }
      const result = mapClientToUpdate(clientData)
      expect(result.company_name).toBe('Updated Co')
      expect(result.trade_license_number).toBeNull()
    })
  })
})
