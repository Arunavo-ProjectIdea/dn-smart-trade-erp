import { describe, it, expect } from 'vitest'
import { expandTradeSynonym, TRADE_SYNONYM_CATEGORIES } from '@/lib/trade-synonyms'

describe('expandTradeSynonym', () => {
  it('TC101: should return original query if no synonym matches', () => {
    const result = expandTradeSynonym('random object')
    expect(result.searchTerm).toBe('random object')
    expect(result.matchedKeyword).toBeUndefined()
    expect(result.matchedCategory).toBeUndefined()
  })

  it('TC102: should match electronics laptop synonym', () => {
    const result = expandTradeSynonym('gaming laptop')
    expect(result.searchTerm).toBe('portable automatic data processing machines')
    expect(result.matchedKeyword).toBe('laptop')
    expect(result.matchedCategory).toBe('Electronics')
  })

  it('TC103: should match electronics mobile synonym', () => {
    const result = expandTradeSynonym('mobile phone case')
    expect(result.searchTerm).toBe('telephones for cellular networks')
    expect(result.matchedKeyword).toBe('mobile')
    expect(result.matchedCategory).toBe('Electronics')
  })

  it('TC104: should handle uppercase queries', () => {
    const result = expandTradeSynonym('MACBOOK PRO')
    expect(result.searchTerm).toBe('portable automatic data processing machines')
    expect(result.matchedKeyword).toBe('macbook')
    expect(result.matchedCategory).toBe('Electronics')
  })

  it('TC105: should match textile tshirt synonym', () => {
    const result = expandTradeSynonym('blue tshirt')
    expect(result.searchTerm).toBe('t-shirts, singlets and other vests, knitted or crocheted')
    expect(result.matchedKeyword).toBe('tshirt')
    expect(result.matchedCategory).toBe('Textile')
  })

  it('TC106: should match plastic bottle synonym', () => {
    const result = expandTradeSynonym('empty plastic bottle')
    expect(result.searchTerm).toBe('carboys, bottles, flasks and similar articles of plastics')
    expect(result.matchedKeyword).toBe('plastic bottle')
    expect(result.matchedCategory).toBe('Plastic')
  })

  it('TC107: should match steel wire synonym', () => {
    const result = expandTradeSynonym('copper wire')
    expect(result.searchTerm).toBe('wire of iron or non-alloy steel')
    expect(result.matchedKeyword).toBe('wire')
    expect(result.matchedCategory).toBe('Steel')
  })

  it('TC108: should match agriculture wheat synonym', () => {
    const result = expandTradeSynonym('wheat grain')
    expect(result.searchTerm).toBe('wheat and meslin')
    expect(result.matchedKeyword).toBe('wheat')
    expect(result.matchedCategory).toBe('Agriculture')
  })

  it('TC109: should match food palm oil synonym', () => {
    const result = expandTradeSynonym('refined palm oil')
    expect(result.searchTerm).toBe('palm oil and its fractions, whether or not refined')
    expect(result.matchedKeyword).toBe('palm oil')
    expect(result.matchedCategory).toBe('Food')
  })

  it('TC110: should match medical syringe synonym', () => {
    const result = expandTradeSynonym('plastic syringe 5ml')
    expect(result.searchTerm).toBe('syringes, needles, catheters, cannulae and the like')
    expect(result.matchedKeyword).toBe('syringe')
    expect(result.matchedCategory).toBe('Medical')
  })

  it('TC111: should match machinery water pump synonym', () => {
    const result = expandTradeSynonym('industrial water pump')
    expect(result.searchTerm).toBe('pumps for liquids, whether or not fitted with a measuring device')
    expect(result.matchedKeyword).toBe('water pump')
    expect(result.matchedCategory).toBe('Machinery')
  })

  it('TC112: should match automobile electric car synonym', () => {
    const result = expandTradeSynonym('new electric car')
    expect(result.searchTerm).toBe('motor vehicles for the transport of ten or more persons')
    expect(result.matchedKeyword).toBe('electric car')
    expect(result.matchedCategory).toBe('Automobile')
  })

  it('TC113: should match chemical pesticides synonym', () => {
    const result = expandTradeSynonym('agricultural pesticides')
    expect(result.searchTerm).toBe('insecticides, rodenticides, fungicides, herbicides')
    expect(result.matchedKeyword).toBe('pesticides')
    expect(result.matchedCategory).toBe('Chemical')
  })

  it('TC114: should correctly identify exact matches without extra spaces', () => {
    const result = expandTradeSynonym('laptop')
    expect(result.searchTerm).toBe('portable automatic data processing machines')
  })
})
