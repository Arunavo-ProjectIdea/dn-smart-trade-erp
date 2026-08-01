"use server"

import { createClient } from "@/lib/supabase/server"
import { expandTradeSynonym } from "@/lib/trade-synonyms"
import type { HSCodeRow } from "./hs-codes.actions"

export interface AIMatchCandidate {
  hsCode: string
  tariffDescription: string
  category: string
  confidence: number
  matchedKeywords: string[]
  reasoning: string
  duties: {
    cd: number
    sd: number
    vat: number
    ait: number
    rd: number
    at: number
    tti: number
    estimatedTotal: number
  }
}

export interface AISearchResult {
  query: string
  candidates: AIMatchCandidate[]
  totalMatches: number
  error: string | null
}

export interface AutocompleteItem {
  hscode: string
  description: string
}

export async function getHSCodeAutocomplete(query: string, limit = 5): Promise<AutocompleteItem[]> {
  if (!query || query.trim().length < 2) return []

  const supabase = await createClient()
  const trimmed = query.trim()
  const pattern = `%${trimmed}%`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("hs_codes")
    .select("hscode, tariff_description")
    .or(`hscode.ilike.${pattern},tariff_description.ilike.${pattern}`)
    .limit(limit)

  if (error || !data) return []

  return data.map((item: { hscode: string; tariff_description: string | null }) => ({
    hscode: item.hscode,
    description: item.tariff_description ?? item.hscode,
  }))
}

export async function findHSCodesWithAI(query: string, limit = 5): Promise<AISearchResult> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { query, candidates: [], totalMatches: 0, error: null }
  }

  const supabase = await createClient()

  // 1. Expand query via 10 domain synonym categories
  const { searchTerm, matchedKeyword, matchedCategory } = expandTradeSynonym(trimmed)

  // 2. Call Supabase RPC
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { data: rpcData, error: rpcError } = await (supabase as any).rpc("match_hs_codes_ai", {
    search_term: searchTerm,
    match_limit: limit,
  })

  // Fallback to direct ILIKE query if RPC returns empty or fails
  if (rpcError || !rpcData || rpcData.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: fallbackData } = await (supabase as any)
      .from("hs_codes")
      .select("id, hscode, tariff_description, category, cd, sd, vat, ait, at, rd, tti")
      .or(`hscode.ilike.%${trimmed}%,tariff_description.ilike.%${trimmed}%,tariff_description.ilike.%${searchTerm}%`)
      .limit(limit)

    if (fallbackData && fallbackData.length > 0) {
      rpcData = fallbackData.map((item: HSCodeRow) => ({
        ...item,
        trgm_score: 0.6,
      }))
    }
  }

  if (!rpcData || rpcData.length === 0) {
    return { query: trimmed, candidates: [], totalMatches: 0, error: null }
  }

  // 3. Map candidates with simple confidence score & reasoning
  const candidates: AIMatchCandidate[] = rpcData.map((item: {
    hscode: string
    tariff_description?: string | null
    category?: string | null
    cd?: number | null
    sd?: number | null
    vat?: number | null
    ait?: number | null
    at?: number | null
    rd?: number | null
    tti?: number | null
    trgm_score?: number
  }) => {
    const rawTrgm = item.trgm_score ?? 0.5
    // Simple confidence formula: base trigram * 80 + keyword boost 15 (capped between 40 and 95)
    let conf = Math.round(rawTrgm * 75 + (matchedKeyword ? 20 : 10))
    if (conf > 95) conf = 95
    if (conf < 40) conf = 40

    const cd = item.cd ?? 0
    const sd = item.sd ?? 0
    const vat = item.vat ?? 0
    const ait = item.ait ?? 0
    const rd = item.rd ?? 0
    const at = item.at ?? 0
    const tti = item.tti ?? (cd + sd + vat + ait + rd + at)

    const keywords: string[] = []
    if (matchedKeyword) keywords.push(matchedKeyword)
    if (matchedCategory) keywords.push(matchedCategory)
    keywords.push(`HS ${item.hscode.substring(0, 4)}`)

    const descSnippet = item.tariff_description ?? item.hscode
    const categoryName = item.category ?? matchedCategory ?? "General Tariff Schedule"
    const reasoning = matchedKeyword
      ? `Query matched trade synonym "${matchedKeyword}" (${matchedCategory} domain). Aligns with WCO entry: ${descSnippet}.`
      : `Item matches tariff description entry "${descSnippet}" under ${categoryName}.`

    return {
      hsCode: item.hscode,
      tariffDescription: descSnippet,
      category: categoryName,
      confidence: conf,
      matchedKeywords: Array.from(new Set(keywords)),
      reasoning,
      duties: {
        cd,
        sd,
        vat,
        ait,
        rd,
        at,
        tti,
        estimatedTotal: cd + sd + vat + ait + rd + at,
      },
    }
  })

  return {
    query: trimmed,
    candidates,
    totalMatches: candidates.length,
    error: null,
  }
}
