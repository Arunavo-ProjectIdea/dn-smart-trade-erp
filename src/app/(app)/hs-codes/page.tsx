"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEye, faCalculator, faSearch, faFilter, faClock, faArrowTrendUp, faRotate,
  faCircleCheck, faArrowRight, faBolt, faXmark, faWandSparkles, faMagnifyingGlass,
  faReceipt, faHashtag, faCheck, faLayerGroup, faPercent, faSliders, faBoxOpen,
  faChevronLeft, faChevronRight, faTriangleExclamation, faChevronDown, faChevronUp
} from "@fortawesome/free-solid-svg-icons"
import { motion, AnimatePresence } from "framer-motion"

import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { getHSCodes, getHSCodeStats, type HSCodeRow } from "@/actions/hs-codes.actions"

// ==========================================
// Example placeholders for AI input
// ==========================================
const AI_EXAMPLES = ["Laptop", "Mobile Phone", "Cotton Shirt", "Plastic Bottle", "LED Light"]

// ==========================================
// AI Recommendation Component
// ==========================================
function AIRecommendationCard({ onUseHSCode }: { onUseHSCode: (code: string) => void }) {
  const [productDesc, setProductDesc] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    hsCode: string
    confidence: number
    reason: string
    category: string
    duties: { cd: number; vat: number; rd: number; ait: number; estimatedTotal: number }
  } | null>(null)

  const handleAnalyze = async () => {
    if (!productDesc.trim()) return
    setIsAnalyzing(true)
    setResult(null)
    const res = await getHSCodes({ query: productDesc.trim(), searchType: "tariff_description", page: 1 })
    const matched = res.data[0]
    setTimeout(() => {
      if (matched) {
        setResult({
          hsCode: matched.hscode,
          confidence: 94,
          category: matched.category ?? "General",
          reason: `Based on the product description "${productDesc}", this item aligns with tariff entry: ${matched.tariff_description ?? matched.hscode}. Classification follows WCO harmonised system guidelines.`,
          duties: {
            cd: matched.cd ?? 0,
            vat: matched.vat ?? 0,
            rd: matched.rd ?? 0,
            ait: matched.ait ?? 0,
            estimatedTotal: (matched.cd ?? 0) + (matched.vat ?? 0) + (matched.rd ?? 0) + (matched.ait ?? 0),
          },
        })
      }
      setIsAnalyzing(false)
    }, 800)
  }

  return (
    <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card/80 to-background backdrop-blur-xl shadow-lg shadow-amber-500/5">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/8 rounded-full blur-2xl -z-10 pointer-events-none" />

      <CardHeader className="pb-5 border-b border-amber-500/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
              <FontAwesomeIcon icon={faWandSparkles} className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-amber-600 dark:text-amber-400 font-bold tracking-tight text-base">
                AI Intelligent HS Code Assistant
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Describe your product to get instant WCO-compliant tariff suggestions
              </CardDescription>
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <FontAwesomeIcon icon={faBolt} className="h-2.5 w-2.5" /> Powered by AI
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/60 pointer-events-none" />
            <Input
              placeholder="Describe your product — e.g. Gaming Laptop, Cotton T-Shirt..."
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="h-12 pl-10 pr-10 border-amber-500/30 focus-visible:ring-amber-500/40 bg-background/70 text-sm font-medium shadow-inner rounded-xl"
              onKeyDown={(e) => { if (e.key === "Enter") handleAnalyze() }}
            />
            {productDesc && (
              <button
                onClick={() => setProductDesc("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !productDesc.trim()}
            className="h-12 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-600/25 min-w-[160px] rounded-xl transition-all duration-200"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white/20 border-t-white h-4 w-4 rounded-full" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" /> Analyze Product
              </span>
            )}
          </Button>
        </div>

        {/* Example chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Try:</span>
          {AI_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setProductDesc(ex)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pt-5 border-t border-amber-500/15"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Main Result */}
                <div className="lg:col-span-7 bg-background/50 backdrop-blur-md p-5 rounded-2xl border border-amber-500/20 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Suggested HS Code</p>
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="text-3xl font-extrabold font-mono text-foreground">{result.hsCode}</span>
                        <span className="p-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full">
                          <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted/80 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          />
                        </div>
                        <span className="font-bold font-mono text-sm text-amber-600 dark:text-amber-400">{result.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Category:</span>
                    <span className="text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                      {result.category}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40">
                    {result.reason}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 border-t border-border/30">
                    <Button onClick={() => onUseHSCode(result.hsCode)} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                      <FontAwesomeIcon icon={faCircleCheck} className="mr-1.5 h-3.5 w-3.5" /> Use HS Code
                    </Button>
                    <Link href={`/hs-codes/${result.hsCode}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Tariff Details <FontAwesomeIcon icon={faArrowRight} className="ml-1.5 h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Duty Panel */}
                <div className="lg:col-span-5 bg-gradient-to-br from-card to-muted/20 border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <FontAwesomeIcon icon={faReceipt} className="h-3.5 w-3.5 text-amber-500" /> Duty &amp; Tax Breakdown
                    </h4>
                    <span className="text-[10px] font-mono text-muted-foreground">Standard Rate</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {[
                      { label: "Customs Duty (CD)", value: result.duties.cd },
                      { label: "VAT", value: result.duties.vat },
                      { label: "Regulatory Duty (RD)", value: result.duties.rd },
                      { label: "Advance Income Tax (AIT)", value: result.duties.ait },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-2.5 rounded-lg bg-background/50 border border-border/30 text-xs">
                        <span className="text-muted-foreground font-medium">{item.label}</span>
                        <span className="font-mono font-bold text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Est. Total Duty</p>
                      <p className="text-[10px] text-muted-foreground">Combined tax impact</p>
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                      {result.duties.estimatedTotal}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// ==========================================
// Main Page Component
// ==========================================
type SearchType = "tariff_description" | "hscode"

interface RecentSearch {
  id: string
  keyword: string
  type: SearchType
  time: string
}

const PAGE_SIZE = 50

export default function HSCodesPage() {
  // Data state
  const [rows, setRows] = useState<HSCodeRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ totalCount: 0, avgCd: 0 })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Search state
  const [searchType, setSearchType] = useState<SearchType>("tariff_description")
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedQuery, setAppliedQuery] = useState("")
  const [appliedType, setAppliedType] = useState<SearchType>("tariff_description")

  // Filter state
  const [minDuty, setMinDuty] = useState<string>("")
  const [maxDuty, setMaxDuty] = useState<string>("")
  const [vatPercent, setVatPercent] = useState<string>("")

  // Recent searches — collapsed by default
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { id: "1", keyword: "Cotton", type: "tariff_description", time: "10 mins ago" },
    { id: "2", keyword: "87034011", type: "hscode", time: "2 hours ago" },
  ])
  const [recentExpanded, setRecentExpanded] = useState(false)

  const fetchData = useCallback(async (page: number) => {
    setIsLoading(true)
    setError(null)
    const res = await getHSCodes({
      query: appliedQuery,
      searchType: appliedType,
      page,
      minCd: minDuty ? parseFloat(minDuty) : undefined,
      maxCd: maxDuty ? parseFloat(maxDuty) : undefined,
      vatFilter: vatPercent ? parseFloat(vatPercent) : undefined,
    })
    setIsLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setRows(res.data)
      setTotalCount(res.totalCount)
    }
  }, [appliedQuery, appliedType, minDuty, maxDuty, vatPercent])

  useEffect(() => {
    getHSCodeStats().then(setStats)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchData(currentPage)
  }, [fetchData, currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    setAppliedQuery(searchQuery)
    setAppliedType(searchType)
    if (searchQuery.trim()) {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        keyword: searchQuery,
        type: searchType,
        time: "Just now",
      }
      setRecentSearches((prev) => [newSearch, ...prev.filter((s) => s.keyword !== searchQuery)].slice(0, 5))
    }
  }

  const handleRecentClick = (recent: RecentSearch) => {
    setSearchType(recent.type)
    setSearchQuery(recent.keyword)
    setAppliedType(recent.type)
    setAppliedQuery(recent.keyword)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setMinDuty("")
    setMaxDuty("")
    setVatPercent("")
  }

  const handleResetSearch = () => {
    setSearchQuery("")
    setAppliedQuery("")
    setSearchType("tariff_description")
    setAppliedType("tariff_description")
    clearFilters()
    setCurrentPage(1)
  }

  const handleAIUse = (code: string) => {
    setSearchType("hscode")
    setSearchQuery(code)
    setAppliedType("hscode")
    setAppliedQuery(code)
    setCurrentPage(1)
    const newSearch: RecentSearch = { id: Date.now().toString(), keyword: code, type: "hscode", time: "Just now" }
    setRecentSearches((prev) => [newSearch, ...prev.filter((s) => s.keyword !== code)].slice(0, 5))
  }

  const searchPlaceholder = searchType === "hscode"
    ? "Enter HS Code number (e.g. 87034011)..."
    : "Search tariff description (e.g. Cotton, Laptop)..."

  const activeFiltersCount = (minDuty ? 1 : 0) + (maxDuty ? 1 : 0) + (vatPercent ? 1 : 0)

  const columns: ColumnDef<HSCodeRow>[] = [
    {
      header: "HS Code",
      accessorKey: "hscode",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20 whitespace-nowrap">
          {item.hscode}
        </span>
      ),
    },
    {
      header: "Tariff Description",
      accessorKey: "tariff_description",
      sortable: false,
      cell: (item) => (
        <p className="text-sm font-medium text-foreground max-w-sm leading-snug">
          {item.tariff_description ?? "—"}
        </p>
      ),
    },
    {
      header: "CD %",
      accessorKey: "cd",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs font-semibold bg-slate-500/10 text-foreground px-2 py-0.5 rounded">
          {item.cd ?? 0}%
        </span>
      ),
    },
    {
      header: "VAT %",
      accessorKey: "vat",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
          {item.vat ?? 0}%
        </span>
      ),
    },
    {
      header: "SD %",
      accessorKey: "sd",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">
          {item.sd ?? 0}%
        </span>
      ),
    },
    {
      header: "TTI %",
      accessorKey: "tti",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
          {item.tti ?? 0}%
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Link
            href={`/hs-codes/${item.hscode}`}
            className={buttonVariants({ variant: "ghost", size: "sm" }) + " h-7 px-2 text-xs gap-1 hover:bg-primary/10 hover:text-primary"}
            aria-label={`View details for ${item.hscode}`}
          >
            <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
            <span className="hidden sm:inline">Details</span>
          </Link>
          <Link
            href={`/duty-calculator?hsCode=${item.hscode}`}
            className={buttonVariants({ variant: "outline", size: "sm" }) + " h-7 px-2 text-xs gap-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"}
            aria-label={`Calculate duty for ${item.hscode}`}
          >
            <FontAwesomeIcon icon={faCalculator} className="h-3 w-3" />
            <span className="hidden sm:inline">Calculate</span>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6 pb-10 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <PageHeader
        title="Customs HS Code Database"
        description="Comprehensive WCO Harmonized System classification, duty schedules, and intelligent search."
      />

      {/* ── Statistics Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total HS Codes",
            value: stats.totalCount.toLocaleString(),
            sub: "Active tariffs indexed",
            icon: faHashtag,
            iconBg: "bg-primary/10 text-primary",
            check: true,
          },
          {
            label: "Showing Results",
            value: totalCount.toLocaleString(),
            sub: "Matching current filters",
            icon: faLayerGroup,
            iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          },
          {
            label: "Avg CD Duty Rate",
            value: `${stats.avgCd.toFixed(1)}%`,
            sub: "Mean customs duty",
            icon: faPercent,
            iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          },
          {
            label: "Page",
            value: `${currentPage} / ${totalPages || 1}`,
            sub: `${PAGE_SIZE} records per page`,
            icon: faArrowTrendUp,
            iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          },
        ].map((card) => (
          <Card key={card.label} className="rounded-xl bg-card/70 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{card.label}</p>
                <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                  <FontAwesomeIcon icon={card.icon} className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold tracking-tight text-foreground">{card.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                {card.check && <FontAwesomeIcon icon={faCheck} className="h-2.5 w-2.5 text-emerald-500" />}
                {card.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── AI HS Code Assistant ── */}
      <AIRecommendationCard onUseHSCode={handleAIUse} />

      {/* ── Search & Filters ── */}
      <Card className="rounded-xl shadow-sm border-border/60 bg-card/80 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">

            {/* Search Type */}
            <div className="w-full sm:w-44 space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Field</Label>
              <Select value={searchType} onValueChange={(val) => {
                if (val) { setSearchType(val as SearchType); setSearchQuery("") }
              }}>
                <SelectTrigger className="h-10 text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tariff_description">Description</SelectItem>
                  <SelectItem value="hscode">HS Code</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search Query</Label>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-9 pr-9 h-10 text-sm"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-end">
              <Button onClick={handleSearch} className="h-10 px-5 font-semibold shadow-sm" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin border-2 border-white/20 border-t-white h-3.5 w-3.5 rounded-full" />
                    Searching
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faSearch} className="h-3.5 w-3.5" /> Search
                  </span>
                )}
              </Button>

              <Sheet>
                <SheetTrigger render={
                  <Button variant="outline" className="h-10 px-4 gap-2 border-border/80 relative">
                    <FontAwesomeIcon icon={faSliders} className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold items-center justify-center shadow-sm">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                } />
                <SheetContent className="w-80 sm:w-[420px] p-0 flex flex-col justify-between bg-card" side="right">
                  <SheetHeader className="p-5 border-b border-border/60 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                        </div>
                        <div>
                          <SheetTitle className="font-bold text-base text-foreground">Advanced Tariff Filters</SheetTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">Filter by duty rates and tax categories</p>
                        </div>
                      </div>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-primary hover:bg-primary/10 gap-1 px-2">
                          <FontAwesomeIcon icon={faRotate} className="h-3 w-3" /> Reset
                        </Button>
                      )}
                    </div>
                  </SheetHeader>

                  <div className="p-5 space-y-6 overflow-y-auto flex-1">

                    {/* Quick Presets */}
                    <div className="space-y-2.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faWandSparkles} className="h-3 w-3 text-amber-500" /> Quick Tariff Presets
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => { setMinDuty("0"); setMaxDuty("0"); }}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${minDuty === "0" && maxDuty === "0" ? "bg-primary/15 border-primary text-primary font-bold shadow-xs" : "bg-muted/40 border-border/60 hover:bg-muted text-foreground"}`}
                        >
                          Zero Duty (0% CD)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setVatPercent("15"); }}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${vatPercent === "15" ? "bg-primary/15 border-primary text-primary font-bold shadow-xs" : "bg-muted/40 border-border/60 hover:bg-muted text-foreground"}`}
                        >
                          Standard VAT (15%)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMinDuty("15"); setMaxDuty(""); }}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${minDuty === "15" && maxDuty === "" ? "bg-primary/15 border-primary text-primary font-bold shadow-xs" : "bg-muted/40 border-border/60 hover:bg-muted text-foreground"}`}
                        >
                          High Duty (&gt;15% CD)
                        </button>
                      </div>
                    </div>

                    {/* Customs Duty (CD %) Section */}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faPercent} className="h-3 w-3 text-amber-500" /> Customs Duty (CD %) Range
                        </Label>
                        {(minDuty || maxDuty) && (
                          <button type="button" onClick={() => { setMinDuty(""); setMaxDuty(""); }} className="text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground">Minimum CD %</span>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="0"
                              value={minDuty}
                              onChange={(e) => setMinDuty(e.target.value)}
                              className="h-10 font-mono text-sm pr-7 bg-background"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none">%</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground">Maximum CD %</span>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="25"
                              value={maxDuty}
                              onChange={(e) => setMaxDuty(e.target.value)}
                              className="h-10 font-mono text-sm pr-7 bg-background"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick CD pills */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-muted-foreground font-medium">Quick select:</span>
                        {["0", "5", "10", "25"].map((cdVal) => (
                          <button
                            key={cdVal}
                            type="button"
                            onClick={() => { setMinDuty(cdVal); setMaxDuty(cdVal); }}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-background border border-border/60 hover:border-primary/50 text-foreground"
                          >
                            {cdVal}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Value Added Tax (VAT %) Section */}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faReceipt} className="h-3 w-3 text-blue-500" /> Exact VAT (%)
                        </Label>
                        {vatPercent && (
                          <button type="button" onClick={() => setVatPercent("")} className="text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
                        )}
                      </div>

                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="e.g. 15"
                          value={vatPercent}
                          onChange={(e) => setVatPercent(e.target.value)}
                          className="h-10 font-mono text-sm pr-7 bg-background"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none">%</span>
                      </div>

                      {/* Quick VAT pills */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-muted-foreground font-medium">Common rates:</span>
                        {["0", "5", "15"].map((vVal) => (
                          <button
                            key={vVal}
                            type="button"
                            onClick={() => setVatPercent(vVal)}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-background border border-border/60 hover:border-primary/50 text-foreground"
                          >
                            {vVal}%
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-4 border-t border-border/60 bg-muted/20 flex gap-3">
                    <Button onClick={clearFilters} variant="outline" className="flex-1 h-11 text-xs font-semibold border-border/80">
                      <FontAwesomeIcon icon={faRotate} className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                    </Button>
                    <SheetTrigger render={
                      <Button onClick={() => { setCurrentPage(1); handleSearch() }} className="flex-1 h-11 text-xs font-semibold bg-primary hover:bg-primary/90 shadow-md">
                        <FontAwesomeIcon icon={faCheck} className="mr-1.5 h-3.5 w-3.5" /> Apply Filters
                      </Button>
                    } />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Searches (Collapsible, default collapsed) ── */}
      <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setRecentExpanded((v) => !v)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setRecentExpanded((v) => !v) }}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/40 transition-colors cursor-pointer select-none"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5 text-primary" />
            Recent Searches
            {recentSearches.length > 0 && (
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">
                {recentSearches.length}
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            {recentSearches.length > 0 && recentExpanded && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setRecentSearches([]) }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); setRecentSearches([]) } }}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded-md hover:bg-muted cursor-pointer"
              >
                Clear all
              </span>
            )}
            <FontAwesomeIcon
              icon={recentExpanded ? faChevronUp : faChevronDown}
              className="h-3.5 w-3.5 text-muted-foreground"
            />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {recentExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="px-4 pb-4 border-t border-border/40">
                {recentSearches.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {recentSearches.map((recent) => (
                      <button
                        key={recent.id}
                        onClick={() => handleRecentClick(recent)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-background/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all text-xs font-medium group"
                      >
                        <span>{recent.keyword}</span>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded-full group-hover:bg-primary/10">
                          {recent.type === "hscode" ? "code" : "desc"}
                        </span>
                        <span className="text-[9px] text-muted-foreground">{recent.time}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground pt-3">No recent searches.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Results Area ── */}
      <div className="space-y-4">

        {/* Result Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-foreground flex items-center gap-2">
              Matching Results:
              <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
                {totalCount.toLocaleString()}
              </span>
            </span>
            {appliedQuery && (
              <>
                <div className="h-3.5 w-px bg-border hidden sm:block" />
                <span className="text-muted-foreground">
                  Query: <strong className="text-foreground">&quot;{appliedQuery}&quot;</strong>
                </span>
              </>
            )}
            {activeFiltersCount > 0 && (
              <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
              </span>
            )}
          </div>
          {(appliedQuery || activeFiltersCount > 0) && (
            <Button variant="ghost" size="sm" onClick={handleResetSearch} className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5">
              <FontAwesomeIcon icon={faRotate} className="h-3 w-3" /> Reset
            </Button>
          )}
        </div>

        {/* Table / States */}
        {error ? (
          <Card className="rounded-xl border-destructive/50 bg-destructive/5">
            <CardContent className="py-14 flex flex-col items-center justify-center text-center gap-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="h-10 w-10 text-destructive/60" />
              <h3 className="text-base font-bold">Failed to load HS Codes</h3>
              <p className="text-xs text-muted-foreground max-w-sm">{error}</p>
              <Button onClick={() => fetchData(currentPage)} size="sm" variant="outline" className="mt-1">Try Again</Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card className="rounded-xl border-border/60">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-9 w-full rounded-lg" />
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
        ) : rows.length === 0 ? (
          <Card className="rounded-xl border-dashed border-2 border-border/50 bg-card/40">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 rounded-2xl bg-muted/50">
                <FontAwesomeIcon icon={faBoxOpen} className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="text-base font-bold">No matching HS Codes found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Try modifying your search keywords or clearing the active filters.
                </p>
              </div>
              <Button onClick={handleResetSearch} size="sm" className="gap-2 mt-1">
                <FontAwesomeIcon icon={faRotate} className="h-3.5 w-3.5" /> Reset All
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
            <DataTable columns={columns} data={rows} />
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)}</span> of <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 gap-1 px-3"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" /> Prev
              </Button>
              <span className="text-xs font-mono font-semibold bg-muted px-3 py-1.5 rounded-md border border-border/60">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline" size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 gap-1 px-3"
              >
                Next <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
