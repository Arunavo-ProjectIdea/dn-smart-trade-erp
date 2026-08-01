"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEye, faCalculator, faSearch, faFilter, faClock, faArrowTrendUp, faRotate,
  faCircleCheck, faArrowRight, faBolt, faXmark, faWandSparkles, faMagnifyingGlass,
  faReceipt, faHashtag, faCheck, faLayerGroup, faPercent, faSliders, faBoxOpen,
  faChevronLeft, faChevronRight, faTriangleExclamation, faChevronDown, faChevronUp,
  faScaleUnbalanced, faInfoCircle, faTag, faRobot
} from "@fortawesome/free-solid-svg-icons"
import { motion, AnimatePresence } from "framer-motion"

import { PageHeader } from "@/components/erp/page-header"
import { DataTable, ColumnDef } from "@/components/erp/data-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { getHSCodes, getHSCodeStats, type HSCodeRow } from "@/actions/hs-codes.actions"
import { findHSCodesWithAI, getHSCodeAutocomplete, type AIMatchCandidate, type AISearchResult, type AutocompleteItem } from "@/actions/hs-code-ai.actions"

// ==========================================
// Example placeholders for AI input
// ==========================================
const AI_EXAMPLES = ["Laptop", "Mobile Phone", "Cotton Shirt", "Plastic Bottle", "LED Light", "Electric Motor", "Syringe"]

// ==========================================
// 4-Tier Confidence Color Helper
// ==========================================
function getConfidenceStyle(conf: number) {
  if (conf >= 90) {
    return {
      bg: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-500/10 border-emerald-500/25",
      gradient: "from-emerald-500 to-teal-500",
      label: "High Confidence",
    }
  }
  if (conf >= 70) {
    return {
      bg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      badgeBg: "bg-blue-500/10 border-blue-500/25",
      gradient: "from-blue-500 to-cyan-500",
      label: "Good Match",
    }
  }
  if (conf >= 50) {
    return {
      bg: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-500/10 border-amber-500/25",
      gradient: "from-amber-500 to-orange-500",
      label: "Moderate Match",
    }
  }
  return {
    bg: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-500/10 border-red-500/25",
    gradient: "from-red-500 to-rose-500",
    label: "Low Confidence",
  }
}

// ==========================================
// AI Recommendation Component
// ==========================================
function AIRecommendationCard({
  onUseHSCode,
  onLogAnalytics,
}: {
  onUseHSCode: (code: string) => void
  onLogAnalytics: (query: string, count: number) => void
}) {
  const [productDesc, setProductDesc] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AISearchResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Session Cache (last 10 queries)
  const sessionCacheRef = useRef<Map<string, AISearchResult>>(new Map())

  // Comparison Matrix state (up to 3 items)
  const [compareItems, setCompareItems] = useState<AIMatchCandidate[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Handle Autocomplete debouncing
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    if (productDesc.trim().length >= 2 && showSuggestions) {
      debounceTimerRef.current = setTimeout(async () => {
        const items = await getHSCodeAutocomplete(productDesc)
        setSuggestions(items)
        setActiveSuggestionIdx(-1)
      }, 500)
    } else {
      setTimeout(() => setSuggestions([]), 0)
    }

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [productDesc, showSuggestions])

  const handleAnalyze = async (queryText?: string) => {
    const targetQuery = (queryText || productDesc).trim()
    if (!targetQuery) return

    setShowSuggestions(false)
    setIsAnalyzing(true)
    setHasSearched(true)

    // Check Session Cache
    if (sessionCacheRef.current.has(targetQuery.toLowerCase())) {
      const cached = sessionCacheRef.current.get(targetQuery.toLowerCase())!
      setResult(cached)
      setIsAnalyzing(false)
      onLogAnalytics(targetQuery, cached.candidates.length)
      return
    }

    const res = await findHSCodesWithAI(targetQuery)

    // Cache result (LRU max 10)
    if (sessionCacheRef.current.size >= 10) {
      const firstKey = sessionCacheRef.current.keys().next().value
      if (firstKey) sessionCacheRef.current.delete(firstKey)
    }
    sessionCacheRef.current.set(targetQuery.toLowerCase(), res)

    setResult(res)
    setIsAnalyzing(false)
    onLogAnalytics(targetQuery, res.candidates.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveSuggestionIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveSuggestionIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        return
      }
      if (e.key === "Enter" && activeSuggestionIdx >= 0) {
        e.preventDefault()
        const selected = suggestions[activeSuggestionIdx]
        setProductDesc(selected.description)
        setShowSuggestions(false)
        handleAnalyze(selected.description)
        return
      }
      if (e.key === "Escape") {
        setShowSuggestions(false)
        return
      }
    }
    if (e.key === "Enter") {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const toggleCompare = (candidate: AIMatchCandidate) => {
    setCompareItems((prev) => {
      const exists = prev.some((item) => item.hsCode === candidate.hsCode)
      if (exists) {
        return prev.filter((item) => item.hsCode !== candidate.hsCode)
      }
      if (prev.length >= 3) return prev
      return [...prev, candidate]
    })
  }

  const topCandidate = result?.candidates[0]

  return (
    <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card/80 to-background backdrop-blur-xl shadow-lg shadow-amber-500/5">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/8 rounded-full blur-2xl -z-10 pointer-events-none" />

      <CardHeader className="pb-5 border-b border-amber-500/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
              <FontAwesomeIcon icon={faWandSparkles} className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-amber-600 dark:text-amber-400 font-bold tracking-tight text-base flex items-center gap-2">
                AI Intelligent HS Code Assistant
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Search in plain language or commercial terms (e.g., &quot;Laptop&quot;, &quot;Cotton T-Shirt&quot;, &quot;Plastic Bottle&quot;)
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompareModal(true)}
                className="h-8 text-xs font-semibold border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 gap-1.5"
              >
                <FontAwesomeIcon icon={faScaleUnbalanced} className="h-3.5 w-3.5" />
                Compare ({compareItems.length})
              </Button>
            )}
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <FontAwesomeIcon icon={faBolt} className="h-2.5 w-2.5" /> Powered by AI
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Input & Autocomplete Container */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/60 pointer-events-none" />
              <Input
                ref={inputRef}
                placeholder="Describe your product — e.g. Gaming Laptop, Cotton T-Shirt, Stainless Steel Pipe..."
                value={productDesc}
                onChange={(e) => {
                  setProductDesc(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={showSuggestions && suggestions.length > 0}
                aria-autocomplete="list"
                aria-controls="hs-code-suggestions"
                aria-label="AI Product Description Search"
                className="h-12 pl-10 pr-10 border-amber-500/30 focus-visible:ring-amber-500/40 bg-background/70 text-sm font-medium shadow-inner rounded-xl"
              />
              {productDesc && (
                <button
                  onClick={() => { setProductDesc(""); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Clear AI search input"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              onClick={() => handleAnalyze()}
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

          {/* Autocomplete Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                id="hs-code-suggestions"
                role="listbox"
                className="absolute left-0 right-0 top-full mt-1.5 bg-card/95 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-border/40"
              >
                {suggestions.map((item, idx) => (
                  <div
                    key={item.hscode + idx}
                    role="option"
                    aria-selected={idx === activeSuggestionIdx}
                    onClick={() => {
                      setProductDesc(item.description)
                      setShowSuggestions(false)
                      handleAnalyze(item.description)
                    }}
                    className={`p-3 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors ${idx === activeSuggestionIdx ? "bg-amber-500/15 text-amber-900 dark:text-amber-200" : "hover:bg-accent/60"}`}
                  >
                    <span className="font-medium truncate">{item.description}</span>
                    <span className="font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 shrink-0">
                      {item.hscode}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Example chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Try:</span>
          {AI_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setProductDesc(ex)
                handleAnalyze(ex)
              }}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Results / Candidates Area */}
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4 space-y-3">
              <Skeleton className="h-28 w-full rounded-2xl" />
            </motion.div>
          ) : result && result.candidates.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pt-5 border-t border-amber-500/15 space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* Primary AI Match Result Panel */}
                {topCandidate && (
                  <div className="lg:col-span-7 bg-background/60 backdrop-blur-md p-5 rounded-2xl border border-amber-500/20 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Suggested HS Code</p>
                          <div className="flex items-center gap-2.5 mt-1">
                            <span className="text-3xl font-extrabold font-mono text-foreground">{topCandidate.hsCode}</span>
                            <span className="p-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full">
                              <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" />
                            </span>
                          </div>
                        </div>

                        {/* 4-Tier Confidence Badge */}
                        {(() => {
                          const style = getConfidenceStyle(topCandidate.confidence)
                          return (
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">AI Confidence</p>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted/80 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${topCandidate.confidence}%` }}
                                    transition={{ duration: 0.8 }}
                                    className={`h-full bg-gradient-to-r ${style.gradient} rounded-full`}
                                  />
                                </div>
                                <span className={`font-bold font-mono text-xs px-2 py-0.5 rounded-full border ${style.badgeBg} ${style.text}`}>
                                  {topCandidate.confidence}% ({style.label})
                                </span>
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Matching Keywords */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Matching Keywords:</span>
                        {topCandidate.matchedKeywords.map((kw) => (
                          <span key={kw} className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <FontAwesomeIcon icon={faTag} className="h-2.5 w-2.5 opacity-60" /> {kw}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Classification Reasoning</p>
                        <p className="text-xs text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40 font-normal">
                          {topCandidate.reasoning}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/30 mt-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => onUseHSCode(topCandidate.hsCode)}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md shadow-amber-600/20"
                        >
                          <FontAwesomeIcon icon={faCircleCheck} className="mr-1.5 h-3.5 w-3.5" /> Use HS Code
                        </Button>
                        <Link href={`/hs-codes/${topCandidate.hsCode}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                          View Details <FontAwesomeIcon icon={faArrowRight} className="ml-1.5 h-3 w-3" />
                        </Link>
                      </div>

                      <button
                        onClick={() => toggleCompare(topCandidate)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${compareItems.some(i => i.hsCode === topCandidate.hsCode) ? "bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 font-bold" : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground"}`}
                      >
                        <FontAwesomeIcon icon={faScaleUnbalanced} className="mr-1 h-3 w-3" />
                        {compareItems.some(i => i.hsCode === topCandidate.hsCode) ? "Selected for Compare" : "Compare"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Duty Summary & Tax Breakdown Panel */}
                {topCandidate && (
                  <div className="lg:col-span-5 bg-gradient-to-br from-card to-muted/20 border border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                          <FontAwesomeIcon icon={faReceipt} className="h-3.5 w-3.5 text-amber-500" /> Duty &amp; Tax Breakdown
                        </h4>
                        <span className="text-[10px] font-mono text-muted-foreground">Standard Schedule</span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { label: "Customs Duty (CD)", value: topCandidate.duties.cd },
                          { label: "Supp. Duty (SD)", value: topCandidate.duties.sd },
                          { label: "VAT", value: topCandidate.duties.vat },
                          { label: "Advance Tax (AIT)", value: topCandidate.duties.ait },
                          { label: "Reg. Duty (RD)", value: topCandidate.duties.rd },
                          { label: "AT", value: topCandidate.duties.at },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between items-center px-2.5 py-1 rounded-lg bg-background/50 border border-border/30 text-xs">
                            <span className="text-muted-foreground font-medium">{item.label}</span>
                            <span className="font-mono font-bold text-foreground">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Est. Total Duty</p>
                        <p className="text-[10px] text-muted-foreground">Combined base tax impact</p>
                      </div>
                      <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                        {topCandidate.duties.estimatedTotal}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional AI Match Candidates (if any) */}
              {result.candidates.length > 1 && (
                <div className="pt-3 border-t border-amber-500/15">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Alternative Matches</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.candidates.slice(1).map((cand) => {
                      const style = getConfidenceStyle(cand.confidence)
                      return (
                        <div key={cand.hsCode} className="p-3.5 rounded-xl bg-background/50 border border-border/60 space-y-2 hover:border-amber-500/40 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                              {cand.hsCode}
                            </span>
                            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg} ${style.text}`}>
                              {cand.confidence}%
                            </span>
                          </div>
                          <p className="text-xs font-medium text-foreground line-clamp-2">{cand.tariffDescription}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="font-mono font-semibold text-muted-foreground">Est Duty: {cand.duties.estimatedTotal}%</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => onUseHSCode(cand.hsCode)} className="text-primary font-bold hover:underline">
                                Use
                              </button>
                              <button onClick={() => toggleCompare(cand)} className="text-muted-foreground hover:text-foreground">
                                Compare
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Official Legal Disclaimer */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-start gap-2.5 text-[11px] text-muted-foreground">
                <FontAwesomeIcon icon={faInfoCircle} className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  AI suggestions are provided for assistance only. Final customs classification should be verified according to Bangladesh Customs Tariff Schedule.
                </span>
              </div>
            </motion.div>
          ) : hasSearched ? (
            /* Guided Empty Match State */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-5 border-t border-amber-500/15">
              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-3">
                <div className="p-3 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 w-12 h-12 mx-auto flex items-center justify-center">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">No reliable HS Code found</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  We couldn&apos;t find a high-confidence match for &quot;{productDesc}&quot;. Try adjusting your search description using the tips below:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-lg mx-auto pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50">
                    <strong className="text-foreground">Use broader terms:</strong> e.g., &quot;Fabric&quot; instead of &quot;Red Silk Fabric&quot;
                  </div>
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50">
                    <strong className="text-foreground">Include material:</strong> e.g., Cotton, Stainless Steel, Plastic
                  </div>
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50">
                    <strong className="text-foreground">Mention usage:</strong> e.g., Medical, Machinery, Packaging
                  </div>
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50">
                    <strong className="text-foreground">Check spelling:</strong> Common trade names like &quot;Laptop&quot; work best
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>

      {/* Side-by-Side Comparison Matrix Modal */}
      <AnimatePresence>
        {showCompareModal && compareItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border/80 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <FontAwesomeIcon icon={faScaleUnbalanced} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Tariff Comparison Matrix</h3>
                    <p className="text-xs text-muted-foreground">Comparing {compareItems.length} candidate HS codes side-by-side</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowCompareModal(false)} className="rounded-full">
                  <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                </Button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="p-3 font-bold text-muted-foreground uppercase">Tariff Duty Field</th>
                      {compareItems.map((item) => (
                        <th key={item.hsCode} className="p-3 font-mono font-bold text-primary text-sm min-w-[180px]">
                          {item.hsCode}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Description</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 text-foreground font-sans leading-snug">
                          {item.tariffDescription}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Customs Duty (CD)</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 font-mono font-bold text-foreground">{item.duties.cd}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Supp. Duty (SD)</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">{item.duties.sd}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">VAT</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.duties.vat}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Advance Tax (AIT)</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 font-mono font-bold text-foreground">{item.duties.ait}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Reg. Duty (RD)</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 font-mono font-bold text-foreground">{item.duties.rd}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">AT</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">{item.duties.at}%</td>
                      ))}
                    </tr>
                    <tr className="bg-amber-500/10 font-bold">
                      <td className="p-3 text-amber-800 dark:text-amber-200">Total Tax Impact (TTI)</td>
                      {compareItems.map((item) => (
                        <td key={item.hsCode} className="p-3 font-mono text-base text-amber-600 dark:text-amber-400">
                          {item.duties.estimatedTotal}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
                <Button variant="outline" onClick={() => setShowCompareModal(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ==========================================
// Main Page Component
// ==========================================
type SearchType = "all" | "tariff_description" | "hscode"

interface RecentSearch {
  id: string
  keyword: string
  type: SearchType | "ai"
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

  // Ref for smooth scrolling to results table
  const resultsTableRef = useRef<HTMLDivElement>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Search state
  const [searchType, setSearchType] = useState<SearchType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedQuery, setAppliedQuery] = useState("")
  const [appliedType, setAppliedType] = useState<SearchType>("all")

  // Filter state
  const [minDuty, setMinDuty] = useState<string>("")
  const [maxDuty, setMaxDuty] = useState<string>("")
  const [vatPercent, setVatPercent] = useState<string>("")

  // Recent searches (last 10 entries)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { id: "1", keyword: "Cotton", type: "all", time: "10 mins ago" },
    { id: "2", keyword: "87034011", type: "all", time: "2 hours ago" },
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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(currentPage)
    }, 0)
    return () => clearTimeout(timer)
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
      setRecentSearches((prev) => [newSearch, ...prev.filter((s) => s.keyword !== searchQuery)].slice(0, 10))
    }
  }

  const handleLogAIAnalytics = (query: string, count: number) => {
    if (!query.trim()) return
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      keyword: `AI: ${query} (${count} matches)`,
      type: "ai",
      time: "Just now",
    }
    setRecentSearches((prev) => [newSearch, ...prev.filter((s) => s.keyword !== newSearch.keyword)].slice(0, 10))
  }

  const handleRecentClick = (recent: RecentSearch) => {
    if (recent.type === "ai") {
      const rawQuery = recent.keyword.replace(/^AI:\s*/, "").replace(/\s*\(\d+\s*matches\)$/, "")
      setSearchType("all")
      setSearchQuery(rawQuery)
      setAppliedType("all")
      setAppliedQuery(rawQuery)
      setCurrentPage(1)
    } else {
      setSearchType(recent.type)
      setSearchQuery(recent.keyword)
      setAppliedType(recent.type)
      setAppliedQuery(recent.keyword)
      setCurrentPage(1)
    }
  }

  const clearFilters = () => {
    setMinDuty("")
    setMaxDuty("")
    setVatPercent("")
  }

  const handleResetSearch = () => {
    setSearchQuery("")
    setAppliedQuery("")
    setSearchType("all")
    setAppliedType("all")
    clearFilters()
    setCurrentPage(1)
  }

  const handleAIUse = (code: string) => {
    setSearchType("all")
    setSearchQuery(code)
    setAppliedType("all")
    setAppliedQuery(code)
    setCurrentPage(1)

    // Smoothly scroll down to results table
    setTimeout(() => {
      resultsTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const searchPlaceholder = "Search HS Code or product description (e.g. 87034011, Cotton, Laptop)..."

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
        <div className="whitespace-normal break-words max-w-xs sm:max-w-md text-sm font-medium text-foreground leading-snug">
          {item.tariff_description ?? "—"}
        </div>
      ),
    },
    {
      header: "CD %",
      accessorKey: "cd",
      sortable: true,
      cell: (item) => (
        <div className="whitespace-nowrap">
          <span className="font-mono text-xs font-semibold bg-slate-500/10 text-foreground px-2 py-0.5 rounded">
            {item.cd ?? 0}%
          </span>
        </div>
      ),
    },
    {
      header: "VAT %",
      accessorKey: "vat",
      sortable: true,
      cell: (item) => (
        <div className="whitespace-nowrap">
          <span className="font-mono text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
            {item.vat ?? 0}%
          </span>
        </div>
      ),
    },
    {
      header: "SD %",
      accessorKey: "sd",
      sortable: true,
      cell: (item) => (
        <div className="whitespace-nowrap">
          <span className="font-mono text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">
            {item.sd ?? 0}%
          </span>
        </div>
      ),
    },
    {
      header: "TTI %",
      accessorKey: "tti",
      sortable: true,
      cell: (item) => (
        <div className="whitespace-nowrap">
          <span className="font-mono text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            {item.tti ?? 0}%
          </span>
        </div>
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

      {/* ── AI HS Code Assistant (Connected to Live Server Action) ── */}
      <AIRecommendationCard onUseHSCode={handleAIUse} onLogAnalytics={handleLogAIAnalytics} />

      {/* ── Search & Filters ── */}
      <Card className="rounded-xl shadow-sm border-border/60 bg-card/80 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">

            {/* Unified Search Input */}
            <div className="flex-1 space-y-1 w-full">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search Query</Label>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-9 pr-9 h-10 text-sm font-medium"
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

      {/* ── Recent Searches (Collapsible, last 10 entries) ── */}
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
            Recent Searches &amp; AI Logs
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
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium group transition-all ${recent.type === "ai" ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20" : "border-border/60 bg-background/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"}`}
                      >
                        {recent.type === "ai" && <FontAwesomeIcon icon={faRobot} className="h-3 w-3 text-amber-500" />}
                        <span>{recent.keyword}</span>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded-full">
                          {recent.type}
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
      <div ref={resultsTableRef} className="space-y-4">

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
