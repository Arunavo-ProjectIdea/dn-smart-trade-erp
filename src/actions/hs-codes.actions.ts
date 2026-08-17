"use server"

import { createClient } from "@/lib/supabase/server"

export interface HSCodeRow {
  id: string
  hscode: string
  tariff_description: string | null
  category: string | null
  cd: number | null
  sd: number | null
  vat: number | null
  ait: number | null
  at: number | null
  rd: number | null
  tti: number | null
}

export interface HSCodePageResult {
  data: HSCodeRow[]
  totalCount: number
  error: string | null
}

const PAGE_SIZE = 50

export async function getHSCodes({
  query = "",
  searchType = "all",
  page = 1,
  minCd,
  maxCd,
  vatFilter,
}: {
  query?: string
  searchType?: "all" | "hscode" | "tariff_description"
  page?: number
  minCd?: number
  maxCd?: number
  vatFilter?: number
}): Promise<HSCodePageResult> {
  const supabase = await createClient()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

   
  let countQuery = (supabase as any)
    .from("hs_codes")
    .select("*", { count: "exact", head: true })

   
  let dataQuery = (supabase as any)
    .from("hs_codes")
    .select("id, hscode, tariff_description, category, cd, sd, vat, ait, at, rd, tti")
    .order("hscode", { ascending: true })
    .range(from, to)

  // Apply text search
  if (query.trim()) {
    const ilike = `%${query.trim()}%`
    if (searchType === "hscode") {
      countQuery = countQuery.ilike("hscode", ilike)
      dataQuery = dataQuery.ilike("hscode", ilike)
    } else if (searchType === "tariff_description") {
      countQuery = countQuery.ilike("tariff_description", ilike)
      dataQuery = dataQuery.ilike("tariff_description", ilike)
    } else {
      countQuery = countQuery.or(`hscode.ilike.${ilike},tariff_description.ilike.${ilike}`)
      dataQuery = dataQuery.or(`hscode.ilike.${ilike},tariff_description.ilike.${ilike}`)
    }
  }

  // Apply numeric filters
  if (minCd !== undefined) {
    countQuery = countQuery.gte("cd", minCd)
    dataQuery = dataQuery.gte("cd", minCd)
  }
  if (maxCd !== undefined) {
    countQuery = countQuery.lte("cd", maxCd)
    dataQuery = dataQuery.lte("cd", maxCd)
  }
  if (vatFilter !== undefined) {
    countQuery = countQuery.eq("vat", vatFilter)
    dataQuery = dataQuery.eq("vat", vatFilter)
  }

  const [{ count }, { data, error }] = await Promise.all([countQuery, dataQuery])

  if (error) {
    return { data: [], totalCount: 0, error: "Failed to retrieve HS codes." }
  }

  return {
    data: (data as unknown as HSCodeRow[]) ?? [],
    totalCount: count ?? 0,
    error: null,
  }
}

export async function getHSCodeByHscode(hscode: string): Promise<HSCodeRow | null> {
  const supabase = await createClient()

   
  const { data, error } = await (supabase as any)
    .from("hs_codes")
    .select("id, hscode, tariff_description, category, cd, sd, vat, ait, at, rd, tti")
    .eq("hscode", hscode)
    .limit(1)
    .single()

  if (error || !data) return null
  return data as unknown as HSCodeRow
}

export async function getRelatedHSCodes(hscode: string, limit = 4): Promise<HSCodeRow[]> {
  const supabase = await createClient()

  // Get first 4 digits to find related codes in same HS chapter
  const chapter = hscode.substring(0, 4)

   
  const { data, error } = await (supabase as any)
    .from("hs_codes")
    .select("id, hscode, tariff_description, category, cd, sd, vat, ait, at, rd, tti")
    .like("hscode", `${chapter}%`)
    .neq("hscode", hscode)
    .limit(limit)

  if (error || !data) return []
  return data as unknown as HSCodeRow[]
}

export async function getHSCodeStats(): Promise<{
  totalCount: number
  avgCd: number
}> {
  const supabase = await createClient()

  const { count } = await supabase
    .from("hs_codes")
    .select("*", { count: "exact", head: true })

  const { data: avgData } = await supabase
    .from("hs_codes")
    .select("cd")

  const avg =
    avgData && avgData.length > 0
       
      ? avgData.reduce((acc: number, r: any) => acc + (r.cd ?? 0), 0) / avgData.length
      : 0

  return { totalCount: count ?? 0, avgCd: avg }
}
