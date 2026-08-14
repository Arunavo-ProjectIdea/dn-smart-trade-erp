import { describe, it, expect } from 'vitest'
import { formatClientId, cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('TC201: merges basic classes', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
    })
    
    it('TC202: merges conditional classes', () => {
      expect(cn('bg-red-500', true && 'text-white', false && 'hidden')).toBe('bg-red-500 text-white')
    })

    it('TC203: resolves tailwind conflicts', () => {
      expect(cn('p-4 p-8')).toBe('p-8')
    })

    it('TC204: handles arrays of classes', () => {
      expect(cn(['p-4', 'm-4'])).toBe('p-4 m-4')
    })

    it('TC205: handles undefined and null', () => {
      expect(cn('p-4', undefined, null, 'm-4')).toBe('p-4 m-4')
    })
  })

  describe('formatClientId', () => {
    it('TC206: formats a standard uuid correctly', () => {
      const id = '1a2b3c4d-1234-5678-90ab-cdef12345678'
      // 0x1a2b3c4d = 439041101, % 10000 = 1101
      expect(formatClientId(id)).toBe('CI-1101')
    })

    it('TC207: pads small numbers with zeros', () => {
      const id = '00000005-1234-5678-90ab-cdef12345678'
      // 0x5 = 5, % 10000 = 5 -> 005
      expect(formatClientId(id)).toBe('CI-005')
    })

    it('TC208: handles empty string', () => {
      expect(formatClientId('')).toBe('')
    })

    it('TC209: handles strings without hyphens', () => {
      expect(formatClientId('invalidid')).toBe('invalidid')
    })

    it('TC210: handles strings that are too short', () => {
      expect(formatClientId('a-b')).toBe('a-b')
    })
  })
})
