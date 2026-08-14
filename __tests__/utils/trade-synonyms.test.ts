import { describe, it, expect } from 'vitest'
import { expandTradeSynonym, TRADE_SYNONYM_CATEGORIES } from '@/lib/trade-synonyms'

describe('expandTradeSynonym', () => {
  it('TC101: should return original query if no synonym matches', () => {
    const result = expandTradeSynonym('random object')
    expect(result.searchTerm).toBe('random object')
    expect(result.matchedKeyword).toBeUndefined()
    expect(result.matchedCategory).toBeUndefined()
  })

  // We can dynamically create tests for each category and keyword
  Object.entries(TRADE_SYNONYM_CATEGORIES).forEach(([category, synonyms]) => {
    Object.entries(synonyms).forEach(([keyword, expansion]) => {
      it(`TC_SYNC_${category}_${keyword.replace(/\s+/g, '_')}: matches keyword "${keyword}" to parent category`, () => {
        const testQuery = `test ${keyword} item`
        const result = expandTradeSynonym(testQuery)
        
        expect(result.searchTerm).toBe(expansion)
        expect(result.matchedKeyword).toBe(keyword)
        expect(result.matchedCategory).toBe(category)
      })

      it(`TC_SYNC_${category}_${keyword.replace(/\s+/g, '_')}_uppercase: matches uppercase keyword "${keyword.toUpperCase()}"`, () => {
        const testQuery = `TEST ${keyword.toUpperCase()} ITEM`
        const result = expandTradeSynonym(testQuery)
        
        expect(result.searchTerm).toBe(expansion)
        expect(result.matchedKeyword).toBe(keyword)
        expect(result.matchedCategory).toBe(category)
      })
      
      it(`TC_SYNC_${category}_${keyword.replace(/\s+/g, '_')}_exact: matches exact keyword "${keyword}"`, () => {
        const result = expandTradeSynonym(keyword)
        
        expect(result.searchTerm).toBe(expansion)
        expect(result.matchedKeyword).toBe(keyword)
        expect(result.matchedCategory).toBe(category)
      })
    })
  })

  it('TC114: should correctly identify exact matches without extra spaces', () => {
    const result = expandTradeSynonym('laptop')
    expect(result.searchTerm).toBe('portable automatic data processing machines')
  })
})
