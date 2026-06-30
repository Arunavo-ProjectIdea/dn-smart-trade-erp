"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Eye, Calculator, Search, Filter, Clock, Tag, PackageSearch, Percent, TrendingUp, RefreshCcw, Sparkles, CheckCircle2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
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
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = () => {
    if (!productDesc.trim()) return
    setIsAnalyzing(true)
    setResult(null)
    
    // Simulate API Call to Groq
    setTimeout(() => {
      // Find a mock match if possible, otherwise default to a random one
      const lowerDesc = productDesc.toLowerCase()
      let matched = mockHSCodes.find(c => c.name.toLowerCase().includes(lowerDesc) || c.description.toLowerCase().includes(lowerDesc))
      if (!matched) matched = mockHSCodes[0]

      setResult({
        hsCode: matched.code,
        confidence: 97, // Mock high confidence
        category: matched.category,
        reason: `Based on the product description "${productDesc}", this item clearly falls under ${matched.category}. The structural and functional characteristics align strictly with WCO guidelines for ${matched.name}.`,
        duties: {
          cd: matched.cd,
          vat: matched.vat,
          rd: matched.rd,
          ait: matched.ait,
          estimatedTotal: matched.cd + matched.vat + matched.rd + matched.ait // Mock total % 
        }
      })
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <Card className="border-orange-500/30 shadow-md shadow-orange-500/5 relative overflow-hidden bg-card/50 backdrop-blur-sm">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-500">
          <Sparkles className="h-5 w-5" />
          AI HS Code Recommendation
        </CardTitle>
        <CardDescription>
          Describe your product naturally and our AI will suggest the most accurate HS Code.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Input 
            placeholder="e.g. Gaming Laptop, Cotton T-Shirt, Steel Pipe..." 
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            className="border-orange-500/20 focus-visible:ring-orange-500/30"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAnalyze()
            }}
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !productDesc.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white min-w-[140px]"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white/20 border-t-white h-4 w-4 rounded-full" />
                Analyzing
              </span>
            ) : "Analyze Product"}
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4 border-t border-orange-500/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Main Result */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Suggested HS Code</p>
                      <h3 className="text-3xl font-bold font-mono text-foreground mt-1 flex items-center gap-3">
                        {result.hsCode}
                        <CheckCircle2 className="h-6 w-6 text-orange-500" />
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground mb-2">AI Confidence</p>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full bg-orange-500 rounded-full" 
                          />
                        </div>
                        <span className="font-bold text-orange-500">{result.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Product Category</p>
                    <p className="text-sm font-medium bg-orange-500/10 text-orange-600 w-max px-2 py-1 rounded">{result.category}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Reasoning</p>
                    <p className="text-sm text-foreground/80 leading-relaxed bg-muted/50 p-3 rounded-md border border-border/50">
                      {result.reason}
                    </p>
                  </div>
                </div>

                {/* Duty Summary */}
                <div className="md:col-span-5 bg-card border border-orange-500/20 rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-orange-500" /> Duty Summary
                  </h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customs Duty (CD)</span>
                      <span className="font-mono font-medium">{result.duties.cd}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT</span>
                      <span className="font-mono font-medium">{result.duties.vat}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Regulatory Duty (RD)</span>
                      <span className="font-mono font-medium">{result.duties.rd}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AIT</span>
                      <span className="font-mono font-medium">{result.duties.ait}%</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-orange-500/10 flex justify-between items-center">
                    <span className="text-sm font-semibold text-orange-500">Est. Total Tax</span>
                    <span className="text-lg font-bold font-mono text-orange-500">{result.duties.estimatedTotal}%</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-orange-500/10">
                <Button 
                  onClick={() => onUseHSCode(result.hsCode)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Use This HS Code
                </Button>
                <Button variant="outline" className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-600">
                  <Search className="mr-2 h-4 w-4" /> Search Similar Products
                </Button>
                <Link href={`/hs-codes/${result.hsCode}`} className={buttonVariants({ variant: "ghost" })}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
  
  // Search Input State (what user is typing)
  const [searchType, setSearchType] = useState<SearchType>("name")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Applied Search State (what is actually filtering the table)
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
  ])

  // Statistics Computations
  const stats = useMemo(() => {
    const totalCategories = new Set(data.map(d => d.category)).size
    const avgDuty = data.reduce((acc, curr) => acc + curr.cd, 0) / data.length
    return {
      totalCodes: data.length,
      categories: totalCategories,
      avgDuty: avgDuty.toFixed(2),
      topCategory: "Electronics" // Mocked frequently searched
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
    // Simulate network delay
    setTimeout(() => {
      setAppliedQuery(searchQuery)
      setAppliedType(searchType)
      
      // Add to recent if query exists
      if (searchQuery.trim()) {
        const newSearch: RecentSearch = {
          id: Date.now().toString(),
          keyword: searchQuery,
          type: searchType,
          time: "Just now"
        }
        setRecentSearches(prev => [newSearch, ...prev].slice(0, 5))
      }
      
      setIsLoading(false)
    }, 600) // 600ms loading animation
  }

  const handleCategoryCardClick = (cat: string) => {
    setSearchType("category")
    setSearchQuery(cat)
    // Auto trigger search
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
      setRecentSearches(prev => [newSearch, ...prev].slice(0, 5))
      
      setIsLoading(false)
    }, 600)
  }

  const handleRecentClick = (recent: RecentSearch) => {
    setSearchType(recent.type)
    setSearchQuery(recent.keyword)
    // Auto trigger search
    setIsLoading(true)
    setTimeout(() => {
      setAppliedType(recent.type)
      setAppliedQuery(recent.keyword)
      setIsLoading(false)
    }, 600)
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
    // Auto trigger search
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
      setRecentSearches(prev => [newSearch, ...prev].slice(0, 5))
      
      setIsLoading(false)
    }, 600)
  }

  // Compute filtered data based on APPLIED states
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Search Query Match
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

      // 2. Filters
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
      case "name": return "Search product name..."
      case "code": return "Enter HS Code..."
      case "category": return "Select category..."
      default: return "Search..."
    }
  }, [searchType])

  const columns: ColumnDef<HSCode>[] = [
    {
      header: "HS Code",
      accessorKey: "code",
      sortable: true,
      cell: (item) => <span className="font-mono text-sm font-medium">{item.code}</span>
    },
    {
      header: "Product Name",
      accessorKey: "name",
      sortable: true,
      cell: (item) => <span className="font-medium text-foreground">{item.name}</span>
    },
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
      cell: (item) => <span className="text-muted-foreground text-sm">{item.category}</span>
    },
    {
      header: "CD %",
      accessorKey: "cd",
      sortable: true,
      cell: (item) => <span>{item.cd}%</span>
    },
    {
      header: "VAT %",
      accessorKey: "vat",
      sortable: true,
      cell: (item) => <span>{item.vat}%</span>
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Link 
            href={`/hs-codes/${item.code}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link 
            href={`/duty-calculator?hsCode=${item.code}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            title="Calculate Duty"
          >
            <Calculator className="h-4 w-4 text-primary hover:text-primary/80" />
          </Link>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="HS Code Database" 
        description="Professional customs search and tariff verification module."
      />

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total HS Codes</p>
              <PackageSearch className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.totalCodes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.categories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Avg Duty Rate</p>
              <Percent className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.avgDuty}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Top Category</p>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-bold mt-2 truncate">{stats.topCategory}</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. AI Recommendation Card */}
      <AIRecommendationCard onUseHSCode={handleAIRecommendationUse} />

      {/* 3. Popular Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Popular Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categoriesList.slice(0, 7).map((cat) => (
            <Button 
              key={cat} 
              variant="secondary" 
              size="sm" 
              className="bg-card hover:bg-primary hover:text-primary-foreground border"
              onClick={() => handleCategoryCardClick(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* 4. Search Bar */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            
            {/* Search Type Dropdown */}
            <div className="space-y-1 w-full md:w-48">
              <Label className="text-xs text-muted-foreground">Search By</Label>
              <Select value={searchType} onValueChange={(val) => {
                if (val) {
                  setSearchType(val as SearchType)
                  setSearchQuery("") // Clear query when changing type
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Product Name</SelectItem>
                  <SelectItem value="code">HS Code</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="flex-1 w-full space-y-1">
              <Label className="text-xs text-muted-foreground">Keyword</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder} 
                  className="pl-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>

            {/* Advanced Filters Sheet */}
            <Sheet>
              <SheetTrigger render={
                <Button variant="outline" className="gap-2 w-full md:w-auto">
                  <Filter className="h-4 w-4" />
                  Filters
                  {(minDuty || maxDuty || vatPercent || selectedCategory !== "All") && (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              } />
              <SheetContent className="w-80" side="right">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <SheetTitle className="font-medium leading-none">Advanced Filters</SheetTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-xs text-muted-foreground">Clear all</Button>
                  </div>
                </SheetHeader>
                <div className="space-y-4 pt-6">
                  
                  <div className="space-y-2">
                    <Label>Category Filter</Label>
                    <Select value={selectedCategory} onValueChange={(val) => val && setSelectedCategory(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Duty (%)</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={minDuty}
                        onChange={(e) => setMinDuty(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Duty (%)</Label>
                      <Input 
                        type="number" 
                        placeholder="25" 
                        value={maxDuty}
                        onChange={(e) => setMaxDuty(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Exact VAT (%)</Label>
                    <Input 
                      type="number" 
                      placeholder="15" 
                      value={vatPercent}
                      onChange={(e) => setVatPercent(e.target.value)}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Recent Searches */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" /> Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 px-2 pb-2">
              {recentSearches.length > 0 ? (
                <div className="space-y-1">
                  {recentSearches.map((recent) => (
                    <div 
                      key={recent.id}
                      onClick={() => handleRecentClick(recent)}
                      className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors group"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors truncate max-w-[150px]">
                          {recent.keyword}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-muted/50 px-1.5 py-0.5 rounded">
                          {recent.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{recent.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No recent searches</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Area: Results */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Result Summary */}
          <div className="flex items-center justify-between bg-card p-3 rounded-md border shadow-sm">
            <div className="flex items-center gap-4 text-sm">
              <p className="font-medium">
                Results: <span className="text-primary">{filteredData.length}</span>
              </p>
              {appliedQuery && (
                <>
                  <div className="h-4 w-px bg-border"></div>
                  <p className="text-muted-foreground">
                    Type: <span className="text-foreground capitalize">{appliedType}</span>
                  </p>
                  <div className="h-4 w-px bg-border"></div>
                  <p className="text-muted-foreground">
                    Keyword: <span className="text-foreground font-medium">"{appliedQuery}"</span>
                  </p>
                </>
              )}
            </div>
            {appliedQuery && (
              <Button variant="ghost" size="sm" onClick={handleResetSearch} className="h-8 text-muted-foreground">
                <RefreshCcw className="h-3.5 w-3.5 mr-2" /> Reset
              </Button>
            )}
          </div>

          {/* Results Table / Loader / Empty */}
          {isLoading ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : filteredData.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 flex flex-col items-center justify-center">
                <PackageSearch className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No matching HS Code found.</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center mb-6">
                  Try adjusting your search keywords, using a different search type, or clearing active filters.
                </p>
                <Button onClick={handleResetSearch}>Search Again</Button>
              </CardContent>
            </Card>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredData}
            />
          )}

        </div>
      </div>

    </div>
  )
}
