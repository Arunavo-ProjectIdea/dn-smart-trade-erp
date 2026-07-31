"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCalculator, faSearch, faFilter, faClock, faArrowTrendUp, faRotate, faCircleCheck, faArrowRight, faBolt, faXmark, faWandSparkles, faMagnifyingGlass, faReceipt, faHashtag, faCheck, faLayerGroup, faList, faPercent, faTags, faSliders, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion"

import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { mockHSCodes, HSCode } from "@/lib/mock-data/hs-codes"

// ==========================================
// AI Recommendation Component
// ==========================================
function AIRecommendationCard({ onUseHSCode }: { onUseHSCode: (code: string) => void }) {
  const [productDesc, setProductDesc] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{ 
    hsCode: string; 
    confidence: number; 
    reason: string; 
    category: string; 
    duties: { cd: number; vat: number; rd: number; ait: number; estimatedTotal: number } 
  } | null>(null)

  const handleAnalyze = () => {
    if (!productDesc.trim()) return
    setIsAnalyzing(true)
    setResult(null)
    
    // Simulate API Call to Groq AI
    setTimeout(() => {
      const lowerDesc = productDesc.toLowerCase()
      let matched = mockHSCodes.find(c => c.name.toLowerCase().includes(lowerDesc) || c.description.toLowerCase().includes(lowerDesc))
      if (!matched) matched = mockHSCodes[0]

      setResult({
        hsCode: matched.code,
        confidence: 97,
        category: matched.category,
        reason: `Based on the product description "${productDesc}", this item clearly falls under ${matched.category}. The structural and functional characteristics align strictly with WCO guidelines for ${matched.name}.`,
        duties: {
          cd: matched.cd,
          vat: matched.vat,
          rd: matched.rd,
          ait: matched.ait,
          estimatedTotal: matched.cd + matched.vat + matched.rd + matched.ait
        }
      })
      setIsAnalyzing(false)
    }, 1200)
  }

  return (
    <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card/80 to-background backdrop-blur-xl shadow-xl shadow-amber-500/5">
      {/* Decorative Background Accent */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <CardHeader className="pb-4 border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-semibold tracking-tight text-lg">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/25 shadow-inner">
              <FontAwesomeIcon icon={faWandSparkles} className="h-5 w-5 animate-pulse" aria-hidden="true" />
            </div>
            AI Intelligent HS Code Assistant
          </CardTitle>
          <span className="text-[11px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <FontAwesomeIcon icon={faBolt} className="h-3 w-3" /> Powered by AI
          </span>
        </div>
        <CardDescription className="text-muted-foreground text-sm mt-1">
          Describe your product naturally or paste a specification line to instantly get WCO-compliant tariff suggestions.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input 
              placeholder="e.g. Gaming Laptop, Cotton T-Shirt, Stainless Steel Pipe..." 
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="h-11 border-amber-500/30 focus-visible:ring-amber-500/40 bg-background/60 backdrop-blur-sm pr-10 text-sm shadow-inner"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyze()
              }}
            />
            {productDesc && (
              <button 
                onClick={() => setProductDesc("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !productDesc.trim()}
            className="h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-lg shadow-amber-600/20 min-w-[150px] transition-all duration-200"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white/20 border-t-white h-4 w-4 rounded-full" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" aria-hidden="true" /> Analyze Product
              </span>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 12 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="pt-5 border-t border-amber-500/15"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Main Result Panel */}
                <div className="lg:col-span-7 space-y-4 bg-background/40 backdrop-blur-md p-5 rounded-2xl border border-amber-500/20 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested HS Code</p>
                        <h3 className="text-3xl font-extrabold font-mono tracking-tight text-foreground mt-1 flex items-center gap-3">
                          {result.hsCode}
                          <span className="inline-flex items-center justify-center p-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full">
                            <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" />
                          </span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">AI Match Confidence</p>
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-2.5 bg-muted/80 rounded-full overflow-hidden p-0.5 border border-border/50">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence}%` }}
                              transition={{ duration: 0.8, delay: 0.15 }}
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
                            />
                          </div>
                          <span className="font-bold font-mono text-sm text-amber-600 dark:text-amber-400">{result.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Category:</span>
                      <span className="text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        {result.category}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Classification Reasoning</p>
                      <p className="text-xs text-foreground/90 leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/50">
                        {result.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-4 border-t border-border/40 mt-4">
                    <Button 
                      onClick={() => onUseHSCode(result.hsCode)}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md shadow-amber-600/20"
                    >
                      <FontAwesomeIcon icon={faCircleCheck} className="mr-1.5 h-4 w-4" /> Use HS Code
                    </Button>
                    <Link href={`/hs-codes/${result.hsCode}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Full Tariff Details <FontAwesomeIcon icon={faArrowRight} className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Duty Summary Panel */}
                <div className="lg:col-span-5 bg-gradient-to-br from-card to-muted/30 border border-amber-500/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faReceipt} className="h-4 w-4 text-amber-500" aria-hidden="true" /> Duty & Tax Breakdown
                      </span>
                      <span className="text-xs font-mono font-medium text-muted-foreground">Standard Rate</span>
                    </h4>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-background/60 border border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Customs Duty (CD)</span>
                        <span className="font-mono font-bold text-foreground">{result.duties.cd}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-background/60 border border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">VAT</span>
                        <span className="font-mono font-bold text-foreground">{result.duties.vat}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-background/60 border border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Regulatory Duty (RD)</span>
                        <span className="font-mono font-bold text-foreground">{result.duties.rd}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-background/60 border border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Advance Income Tax (AIT)</span>
                        <span className="font-mono font-bold text-foreground">{result.duties.ait}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-500/20 mt-4 flex justify-between items-center bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Est. Total Duty</p>
                      <p className="text-[10px] text-muted-foreground">Combined base tax impact</p>
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
type SearchType = "name" | "code" | "category"

interface RecentSearch {
  id: string
  keyword: string
  type: SearchType
  time: string
}

export default function HSCodesPage() {
  const [data] = useState<HSCode[]>(mockHSCodes)
  
  // UI State
  const [isLoading, setIsLoading] = useState(false)
  
  // Search Input State
  const [searchType, setSearchType] = useState<SearchType>("name")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Applied Search State
  const [appliedQuery, setAppliedQuery] = useState("")
  const [appliedType, setAppliedType] = useState<SearchType>("name")
  
  // Filter State
  const [minDuty, setMinDuty] = useState<string>("")
  const [maxDuty, setMaxDuty] = useState<string>("")
  const [vatPercent, setVatPercent] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { id: "1", keyword: "Laptop", type: "name", time: "10 mins ago" },
    { id: "2", keyword: "84713000", type: "code", time: "2 hours ago" },
    { id: "3", keyword: "Electronics", type: "category", time: "1 day ago" },
  ])

  // Statistics Computations
  const stats = useMemo(() => {
    const totalCategories = new Set(data.map(d => d.category)).size
    const avgDuty = data.reduce((acc, curr) => acc + curr.cd, 0) / data.length
    return {
      totalCodes: data.length,
      categories: totalCategories,
      avgDuty: avgDuty.toFixed(2),
      topCategory: "Electronics"
    }
  }, [data])

  // Categories list
  const categoriesList = useMemo(() => {
    const cats = new Set(data.map(item => item.category))
    return Array.from(cats)
  }, [data])

  const filterCategories = ["All", ...categoriesList]

  // Handlers
  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      setAppliedQuery(searchQuery)
      setAppliedType(searchType)
      
      if (searchQuery.trim()) {
        const newSearch: RecentSearch = {
          id: Date.now().toString(),
          keyword: searchQuery,
          type: searchType,
          time: "Just now"
        }
        setRecentSearches(prev => [newSearch, ...prev.filter(s => s.keyword !== searchQuery)].slice(0, 5))
      }
      
      setIsLoading(false)
    }, 450)
  }

  const handleCategoryCardClick = (cat: string) => {
    setSearchType("category")
    setSearchQuery(cat)
    setIsLoading(true)
    setTimeout(() => {
      setAppliedType("category")
      setAppliedQuery(cat)
      
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        keyword: cat,
        type: "category",
        time: "Just now"
      }
      setRecentSearches(prev => [newSearch, ...prev.filter(s => s.keyword !== cat)].slice(0, 5))
      
      setIsLoading(false)
    }, 450)
  }

  const handleRecentClick = (recent: RecentSearch) => {
    setSearchType(recent.type)
    setSearchQuery(recent.keyword)
    setIsLoading(true)
    setTimeout(() => {
      setAppliedType(recent.type)
      setAppliedQuery(recent.keyword)
      setIsLoading(false)
    }, 450)
  }

  const clearFilters = () => {
    setMinDuty("")
    setMaxDuty("")
    setVatPercent("")
    setSelectedCategory("All")
  }

  const handleResetSearch = () => {
    setSearchQuery("")
    setAppliedQuery("")
    setSearchType("name")
    setAppliedType("name")
    clearFilters()
  }

  const handleAIRecommendationUse = (code: string) => {
    setSearchType("code")
    setSearchQuery(code)
    setIsLoading(true)
    setTimeout(() => {
      setAppliedType("code")
      setAppliedQuery(code)
      
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        keyword: code,
        type: "code",
        time: "Just now"
      }
      setRecentSearches(prev => [newSearch, ...prev.filter(s => s.keyword !== code)].slice(0, 5))
      
      setIsLoading(false)
    }, 450)
  }

  // Compute filtered data based on APPLIED states
  const filteredData = useMemo(() => {
    return data.filter(item => {
      let matchesSearch = true
      if (appliedQuery) {
        const query = appliedQuery.toLowerCase()
        if (appliedType === "name") {
          matchesSearch = item.name.toLowerCase().includes(query)
        } else if (appliedType === "code") {
          matchesSearch = item.code.includes(query)
        } else if (appliedType === "category") {
          matchesSearch = item.category.toLowerCase().includes(query)
        }
      }

      let matchesFilters = true
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        matchesFilters = false
      }
      if (minDuty !== "" && item.cd < parseFloat(minDuty)) {
        matchesFilters = false
      }
      if (maxDuty !== "" && item.cd > parseFloat(maxDuty)) {
        matchesFilters = false
      }
      if (vatPercent !== "" && item.vat !== parseFloat(vatPercent)) {
        matchesFilters = false
      }

      return matchesSearch && matchesFilters
    })
  }, [data, appliedQuery, appliedType, minDuty, maxDuty, vatPercent, selectedCategory])

  const searchPlaceholder = useMemo(() => {
    switch (searchType) {
      case "name": return "Search product name (e.g. Laptop, Rice)..."
      case "code": return "Enter HS Code (e.g. 85171200)..."
      case "category": return "Type category name..."
      default: return "Search HS codes..."
    }
  }, [searchType])

  const activeFiltersCount = (minDuty ? 1 : 0) + (maxDuty ? 1 : 0) + (vatPercent ? 1 : 0) + (selectedCategory !== "All" ? 1 : 0)

  const columns: ColumnDef<HSCode>[] = [
    {
      header: "HS Code",
      accessorKey: "code",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20">
            {item.code}
          </span>
        </div>
      )
    },
    {
      header: "Product Name",
      accessorKey: "name",
      sortable: true,
      cell: (item) => (
        <div className="max-w-md">
          <p className="font-semibold text-foreground text-sm leading-tight">{item.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
      cell: (item) => (
        <span className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border/50">
          {item.category}
        </span>
      )
    },
    {
      header: "CD %",
      accessorKey: "cd",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-foreground bg-slate-500/10 px-2 py-0.5 rounded">
          {item.cd}%
        </span>
      )
    },
    {
      header: "VAT %",
      accessorKey: "vat",
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
          {item.vat}%
        </span>
      )
    },
    {
      header: "Est. Total Tax",
      cell: (item) => {
        const total = item.cd + item.vat + item.rd + item.ait + item.sd
        return (
          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {total}%
          </span>
        )
      }
    },
    {
      header: "Manage",
      cell: (item) => (
        <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap flex-nowrap w-[200px]">
          <Link 
            href={`/hs-codes/${item.code}`}
            className={buttonVariants({ variant: "ghost", size: "sm" }) + " h-8 px-2.5 text-xs gap-1 hover:bg-primary/10 hover:text-primary"}
            title="View Details"
            aria-label={`View full details for HS Code ${item.code}`}
          >
            <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />
            <span>Details</span>
          </Link>
          <Link 
            href={`/duty-calculator?hsCode=${item.code}`}
            className={buttonVariants({ variant: "outline", size: "sm" }) + " h-8 px-2.5 text-xs gap-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground shadow-xs"}
            title="Calculate Duty"
            aria-label={`Calculate duty for HS Code ${item.code}`}
          >
            <FontAwesomeIcon icon={faCalculator} className="h-3.5 w-3.5" />
            <span>Calculate</span>
          </Link>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title="Customs HS Code Database" 
        description="Comprehensive WCO Harmonized System classification, duty schedules, and intelligent search."
      />

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl bg-card/70 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total HS Codes</p>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faHashtag} className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold tracking-tight text-foreground">{stats.totalCodes}</p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-emerald-500" aria-hidden="true" /> Active tariffs indexed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl bg-card/70 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FontAwesomeIcon icon={faLayerGroup} className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold tracking-tight text-foreground">{stats.categories}</p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faList} className="h-3 w-3 text-blue-500" aria-hidden="true" /> Major product sections
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl bg-card/70 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg CD Duty Rate</p>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FontAwesomeIcon icon={faPercent} className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold tracking-tight text-foreground">{stats.avgDuty}%</p>
              <p className="text-[11px] text-muted-foreground mt-1">Mean standard customs duty</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl bg-card/70 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Category</p>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FontAwesomeIcon icon={faArrowTrendUp} className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold tracking-tight text-foreground truncate">{stats.topCategory}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Most queried section</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. AI Recommendation Component */}
      <AIRecommendationCard onUseHSCode={handleAIRecommendationUse} />

      {/* 3. Category Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FontAwesomeIcon icon={faTags} className="h-4 w-4 text-primary" aria-hidden="true" /> Browse Categories
          </h3>
          <span className="text-xs text-muted-foreground">{categoriesList.length} categories available</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            className={`rounded-full text-xs font-medium transition-all ${
              selectedCategory === "All" ? "shadow-sm" : "hover:border-primary/50"
            }`}
            onClick={() => {
              setSelectedCategory("All")
              setAppliedQuery("")
            }}
          >
            All Categories ({data.length})
          </Button>
          {categoriesList.map((cat) => {
            const count = data.filter(d => d.category === cat).length
            const isSelected = selectedCategory === cat || (appliedType === "category" && appliedQuery === cat)
            return (
              <Button 
                key={cat} 
                variant={isSelected ? "default" : "outline"} 
                size="sm" 
                className={`rounded-full text-xs font-medium transition-all gap-1.5 ${
                  isSelected ? "shadow-sm" : "bg-card hover:bg-primary/10 hover:text-primary border-border/80"
                }`}
                onClick={() => {
                  setSelectedCategory(cat)
                  handleCategoryCardClick(cat)
                }}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* 4. Search Bar & Filters */}
      <Card className="rounded-xl shadow-sm border-border/60 bg-card/80 backdrop-blur-xl">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            
            {/* Search Type Dropdown */}
            <div className="space-y-1.5 w-full md:w-52">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Field</Label>
              <Select value={searchType} onValueChange={(val) => {
                if (val) {
                  setSearchType(val as SearchType)
                  setSearchQuery("")
                }
              }}>
                <SelectTrigger className="h-11 font-medium">
                  <SelectValue placeholder="Select search type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Product Name</SelectItem>
                  <SelectItem value="code">HS Code Number</SelectItem>
                  <SelectItem value="category">Category Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="flex-1 w-full space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Query</Label>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder} 
                  className="pl-9 pr-9 h-11 text-sm font-medium shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <Button onClick={handleSearch} className="h-11 px-6 min-w-[120px] shadow-md font-medium" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin border-2 border-white/20 border-t-white h-4 w-4 rounded-full" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4" /> Search
                </span>
              )}
            </Button>

            {/* Advanced Filters Sheet */}
            <Sheet>
              <SheetTrigger render={
                <Button variant="outline" className="h-11 gap-2 px-4 border-border/80">
                  <FontAwesomeIcon icon={faSliders} className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="flex h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              } />
              <SheetContent className="w-80 sm:w-96" side="right">
                <SheetHeader className="pb-4 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="font-semibold text-lg flex items-center gap-2">
                      <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-primary" /> Advanced Filters
                    </SheetTitle>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs text-primary hover:underline">
                        Reset All
                      </Button>
                    )}
                  </div>
                </SheetHeader>
                <div className="space-y-6 pt-6">
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Filter by Category</Label>
                    <Select value={selectedCategory} onValueChange={(val) => val && setSelectedCategory(val)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Customs Duty (CD %) Range</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] text-muted-foreground">Min CD %</span>
                        <Input 
                          type="number" 
                          placeholder="e.g. 0" 
                          value={minDuty}
                          onChange={(e) => setMinDuty(e.target.value)}
                          className="h-9 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] text-muted-foreground">Max CD %</span>
                        <Input 
                          type="number" 
                          placeholder="e.g. 25" 
                          value={maxDuty}
                          onChange={(e) => setMaxDuty(e.target.value)}
                          className="h-9 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Exact VAT (%)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 15" 
                      value={vatPercent}
                      onChange={(e) => setVatPercent(e.target.value)}
                      className="h-9 font-mono"
                    />
                  </div>

                  <div className="pt-4 border-t border-border/60 flex gap-3">
                    <Button onClick={clearFilters} variant="outline" className="flex-1">Clear</Button>
                    <Button onClick={() => handleSearch()} className="flex-1">Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* 5. Results & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Recent Searches */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-xl border-border/60 shadow-sm bg-card/70 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-primary" /> Recent Searches
                </span>
                {recentSearches.length > 0 && (
                  <button 
                    onClick={() => setRecentSearches([])}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 px-3 pb-3">
              {recentSearches.length > 0 ? (
                <div className="space-y-1.5">
                  {recentSearches.map((recent) => (
                    <div 
                      key={recent.id}
                      onClick={() => handleRecentClick(recent)}
                      className="p-2.5 rounded-xl hover:bg-accent/60 cursor-pointer transition-all duration-200 border border-transparent hover:border-border/60 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[140px]">
                          {recent.keyword}
                        </p>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md uppercase">
                          {recent.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                        <span>{recent.time}</span>
                        <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No recent search history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Area: Results Table */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Result Summary Bar */}
          <div className="flex flex-wrap items-center justify-between bg-card/70 backdrop-blur-xl p-3.5 rounded-xl border border-border/60 shadow-sm gap-3">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <span>Matching HS Codes:</span>
                <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
                  {filteredData.length}
                </span>
              </p>

              {(appliedQuery || activeFiltersCount > 0) && (
                <>
                  <div className="h-4 w-px bg-border hidden sm:block"></div>
                  {appliedQuery && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      Query: <strong className="text-foreground font-semibold">&quot;{appliedQuery}&quot;</strong>
                    </span>
                  )}
                  {selectedCategory !== "All" && (
                    <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium">
                      Category: {selectedCategory}
                    </span>
                  )}
                </>
              )}
            </div>

            {(appliedQuery || activeFiltersCount > 0) && (
              <Button variant="ghost" size="sm" onClick={handleResetSearch} className="h-7 text-xs text-muted-foreground hover:text-foreground">
                <FontAwesomeIcon icon={faRotate} className="h-3 w-3 mr-1.5" /> Reset Filters
              </Button>
            )}
          </div>

          {/* Results Table / Skeleton / Empty */}
          {isLoading ? (
            <Card className="rounded-xl border-border/60">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </CardContent>
            </Card>
          ) : filteredData.length === 0 ? (
            <Card className="rounded-xl border-dashed border-2 border-border/60 bg-card/50">
              <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-muted/60 mb-4">
                  <FontAwesomeIcon icon={faBoxOpen} className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No matching HS Codes found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mb-6">
                  We couldn&apos;t find any tariff code matching your search criteria. Try modifying your keywords or clearing active filters.
                </p>
                <Button onClick={handleResetSearch} size="sm" className="gap-2">
                  <FontAwesomeIcon icon={faRotate} className="h-3.5 w-3.5" /> Reset All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-card/70 backdrop-blur-xl rounded-xl border border-border/60 shadow-sm overflow-hidden">
              <DataTable 
                columns={columns} 
                data={filteredData}
              />
            </div>
          )}

        </div>
      </div>

    </div>
  )
}
