"use client"

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalculator,
  faRotate,
  faCircle,
  faGlobe,
  faFileExcel,
  faBrain,
  faChartBar,
  faHistory,
  faSpinner,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import { motion, AnimatePresence } from "framer-motion"

import { PageHeader } from "@/components/erp/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getHSCodes, type HSCodeRow } from "@/actions/hs-codes.actions"
import {
  findHSCodesWithAI,
  type AIMatchCandidate,
  type AISearchResult,
} from "@/actions/hs-code-ai.actions"

import { AIRecommendationPanel } from "@/components/duty-calculator/AIRecommendationPanel"
import { DutyComparisonModal } from "@/components/duty-calculator/DutyComparisonModal"
import {
  CalculationHistoryPanel,
  type CalcHistoryEntry,
} from "@/components/duty-calculator/CalculationHistoryPanel"
import { ExportActions, type ExportData } from "@/components/duty-calculator/ExportActions"

// ─── History helpers ──────────────────────────────────────────────────────────
const MAX_HISTORY = 10

function makeTimestamp(): string {
  return new Date().toLocaleString("en-BD", {
    hour12: true,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Inner component (needs useSearchParams so wrapped in Suspense) ───────────
function DutyCalculatorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialHsCode = searchParams?.get("hsCode") || ""

  // ── Existing state (unchanged) ─────────────────────────────────────────────
  const [selectedHsCodeStr, setSelectedHsCodeStr] = useState<string>(initialHsCode)
  const [assessableValue, setAssessableValue] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [currency, setCurrency] = useState<"BDT" | "USD">("USD")
  const [exchangeRate, setExchangeRate] = useState<string>("120.00")
  const [liveHSCodes, setLiveHSCodes] = useState<HSCodeRow[]>([])
  const [codesLoading, setCodesLoading] = useState(true)

  // ── New AI state ───────────────────────────────────────────────────────────
  const [aiQuery, setAiQuery] = useState<string>("")
  const [aiResults, setAiResults] = useState<AISearchResult | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedAICandidate, setSelectedAICandidate] = useState<AIMatchCandidate | null>(null)
  const [compareList, setCompareList] = useState<AIMatchCandidate[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [history, setHistory] = useState<CalcHistoryEntry[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Load all HS codes once (existing logic unchanged) ──────────────────────
  useEffect(() => {
    getHSCodes({ page: 1, query: "" }).then((res) => {
      setLiveHSCodes(res.data)
      setCodesLoading(false)
    })
  }, [])

  // ── Derived: selected code from live data (unchanged) ─────────────────────
  const selectedCode = useMemo(
    () => liveHSCodes.find((c) => c.hscode === selectedHsCodeStr),
    [liveHSCodes, selectedHsCodeStr]
  )

  // ── Existing calculation formulas — UNTOUCHED ──────────────────────────────
  const results = useMemo(() => {
    if (!selectedCode) return null

    const val = parseFloat(assessableValue) || 0
    const qty = parseFloat(quantity) || 1
    const exRate = currency === "USD" ? parseFloat(exchangeRate) || 120 : 1

    const baseValueBDT = val * exRate * qty

    const cdAmount = baseValueBDT * ((selectedCode.cd ?? 0) / 100)
    const sdAmount = (baseValueBDT + cdAmount) * ((selectedCode.sd ?? 0) / 100)
    const vatAmount = (baseValueBDT + cdAmount + sdAmount) * ((selectedCode.vat ?? 0) / 100)
    const aitAmount = baseValueBDT * ((selectedCode.ait ?? 0) / 100)
    const rdAmount = baseValueBDT * ((selectedCode.rd ?? 0) / 100)

    const totalTaxAmount = cdAmount + sdAmount + vatAmount + aitAmount + rdAmount
    const grandTotalAmount = baseValueBDT + totalTaxAmount

    return {
      baseValueBDT,
      cdAmount,
      sdAmount,
      vatAmount,
      aitAmount,
      rdAmount,
      totalTaxAmount,
      grandTotalAmount,
    }
  }, [selectedCode, assessableValue, quantity, currency, exchangeRate])

  // ── Auto-save to history when calculation is ready ─────────────────────────
  useEffect(() => {
    if (!results || !selectedCode || !assessableValue) return
    setHistory((prev) => {
      const entry: CalcHistoryEntry = {
        id: `${Date.now()}`,
        timestamp: makeTimestamp(),
        hsCode: selectedCode.hscode,
        description: selectedCode.tariff_description ?? selectedCode.hscode,
        assessableValue,
        quantity,
        currency,
        exchangeRate,
        results: {
          baseValueBDT: results.baseValueBDT,
          totalTaxAmount: results.totalTaxAmount,
          grandTotalAmount: results.grandTotalAmount,
        },
      }
      // Deduplicate by HS code + value combo and cap at MAX_HISTORY
      const filtered = prev.filter(
        (e) => !(e.hsCode === entry.hsCode && e.assessableValue === entry.assessableValue && e.quantity === entry.quantity)
      )
      return [...filtered, entry].slice(-MAX_HISTORY)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results])

  // ── Debounced AI search ────────────────────────────────────────────────────
  const handleAiQueryChange = useCallback((value: string) => {
    setAiQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim() || value.trim().length < 2) {
      setAiResults(null)
      setAiLoading(false)
      return
    }
    setAiLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await findHSCodesWithAI(value.trim(), 5)
        setAiResults(res)
        if (res.candidates.length > 0) {
          setSelectedAICandidate(res.candidates[0])
        }
      } catch {
        setAiResults(null)
      } finally {
        setAiLoading(false)
      }
    }, 500)
  }, [])

  // ── Apply AI candidate to calculator ─────────────────────────────────────
  const handleUseHSCode = useCallback((candidate: AIMatchCandidate) => {
    setSelectedHsCodeStr(candidate.hsCode)
    setSelectedAICandidate(null)
    setAiResults(null)
    setAiQuery("")
  }, [])

  // ── Compare helpers ──────────────────────────────────────────────────────
  const handleAddToCompare = useCallback((candidate: AIMatchCandidate) => {
    setCompareList((prev) => {
      if (prev.some((c) => c.hsCode === candidate.hsCode)) return prev
      if (prev.length >= 3) return prev
      return [...prev, candidate]
    })
    setShowCompare(true)
  }, [])

  const handleRemoveFromCompare = useCallback((hsCode: string) => {
    setCompareList((prev) => prev.filter((c) => c.hsCode !== hsCode))
  }, [])

  // ── History restore ─────────────────────────────────────────────────────
  const handleRestoreHistory = useCallback((entry: CalcHistoryEntry) => {
    setSelectedHsCodeStr(entry.hsCode)
    setAssessableValue(entry.assessableValue)
    setQuantity(entry.quantity)
    setCurrency(entry.currency)
    setExchangeRate(entry.exchangeRate)
  }, [])

  // ── Existing reset (unchanged) ────────────────────────────────────────────
  const handleReset = () => {
    setSelectedHsCodeStr("")
    setAssessableValue("")
    setQuantity("1")
    setCurrency("USD")
    setExchangeRate("120.00")
    setAiQuery("")
    setAiResults(null)
    setSelectedAICandidate(null)
    router.push("/duty-calculator")
  }

  // ── Existing formatCurrency (unchanged) ───────────────────────────────────
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // ── Existing print handler (unchanged) ────────────────────────────────────
  const handlePrint = () => {
    window.print()
  }

  // ── Export data shape for ExportActions component ─────────────────────────
  const exportData: ExportData | null = useMemo(() => {
    if (!results || !selectedCode) return null
    return {
      hsCode: selectedCode.hscode,
      description: selectedCode.tariff_description ?? selectedCode.hscode,
      quantity,
      assessableValue,
      currency,
      exchangeRate,
      baseValueBDT: results.baseValueBDT,
      cdRate: selectedCode.cd ?? 0,
      sdRate: selectedCode.sd ?? 0,
      vatRate: selectedCode.vat ?? 0,
      aitRate: selectedCode.ait ?? 0,
      rdRate: selectedCode.rd ?? 0,
      cdAmount: results.cdAmount,
      sdAmount: results.sdAmount,
      vatAmount: results.vatAmount,
      aitAmount: results.aitAmount,
      rdAmount: results.rdAmount,
      totalTaxAmount: results.totalTaxAmount,
      grandTotalAmount: results.grandTotalAmount,
    }
  }, [results, selectedCode, quantity, assessableValue, currency, exchangeRate])

  // ── Existing tax ratio (unchanged) ────────────────────────────────────────
  const taxRatioPercent = useMemo(() => {
    if (!results || results.baseValueBDT === 0) return 0
    return ((results.totalTaxAmount / results.baseValueBDT) * 100).toFixed(1)
  }, [results])

  const baseValueBDTForCompare = results?.baseValueBDT ?? 0

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      <PageHeader
        title="Customs Duty & Tariff Calculator"
        description="AI-powered assessment of landed costs, customs duties, SD, VAT, AIT, and regulatory tariffs."
      />

      {/* ── AI Product Search Bar ─────────────────────────────────────────── */}
      <Card className="rounded-xl border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="p-1.5 rounded-lg bg-primary/15">
                <FontAwesomeIcon icon={faBrain} className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">AI Product Search</p>
                <p className="text-[10px] text-muted-foreground">Type a product name to find the best HS Code</p>
              </div>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <FontAwesomeIcon
                icon={aiLoading ? faSpinner : faSearch}
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${aiLoading ? "animate-spin" : ""}`}
              />
              <Input
                id="aiProductSearch"
                type="text"
                placeholder="e.g. Laptop, Cotton Shirt, Steel Pipe, LED Bulb…"
                value={aiQuery}
                onChange={(e) => handleAiQueryChange(e.target.value)}
                className="pl-9 h-10 text-sm shadow-inner pr-8"
                aria-label="AI product search"
              />
              {aiQuery && (
                <button
                  onClick={() => { setAiQuery(""); setAiResults(null); setSelectedAICandidate(null) }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear AI search"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {compareList.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCompare(true)}
                className="h-10 text-xs gap-1.5 border-border/80 flex-shrink-0"
              >
                <FontAwesomeIcon icon={faChartBar} className="h-3.5 w-3.5" />
                Compare ({compareList.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── AI Recommendation Panel ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedAICandidate && aiResults && (
          <AIRecommendationPanel
            key={selectedAICandidate.hsCode}
            candidate={selectedAICandidate}
            allCandidates={aiResults.candidates}
            onUseHSCode={handleUseHSCode}
            onAddToCompare={handleAddToCompare}
            onDismiss={() => { setSelectedAICandidate(null); setAiResults(null); setAiQuery("") }}
            compareList={compareList}
          />
        )}
      </AnimatePresence>

      {/* ── Main Calculator Layout ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Calculation Inputs Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalculator} className="h-5 w-5 text-primary" /> Calculation Parameters
                </CardTitle>
                <span className="text-[11px] font-mono text-muted-foreground uppercase bg-muted px-2.5 py-1 rounded-full border border-border/50">
                  NBR Tariff Schedule
                </span>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Select an HS Code and enter assessable item value to estimate total landed taxes.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">

              {/* HS Code Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="hsCode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Target HS Code *</span>
                  {selectedCode && (
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {selectedCode.category}
                    </span>
                  )}
                </Label>
                <Select value={selectedHsCodeStr} onValueChange={(val) => setSelectedHsCodeStr(val || "")}>
                  <SelectTrigger id="hsCode" className="h-11 font-mono text-sm shadow-inner">
                    <SelectValue placeholder="Search or select HS Code..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {codesLoading ? (
                      <SelectItem value="__loading" disabled>Loading HS Codes...</SelectItem>
                    ) : (
                      liveHSCodes.map((code) => (
                        <SelectItem key={code.id} value={code.hscode} className="font-mono text-xs">
                          <span className="font-bold text-primary mr-2">{code.hscode}</span>
                          <span className="text-muted-foreground font-sans truncate">{code.tariff_description}</span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected HS Code Preview Card */}
              <AnimatePresence mode="wait">
                {selectedCode && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Selected Item</p>
                        <p className="text-sm font-bold text-foreground leading-tight mt-0.5">
                          {selectedCode.tariff_description ?? selectedCode.hscode}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-medium bg-background px-2 py-0.5 rounded border border-border/60">
                        TTI: {selectedCode.tti ?? 0}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-500/15 text-foreground px-2 py-0.5 rounded border border-border/40">
                        CD: {selectedCode.cd ?? 0}%
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                        SD: {selectedCode.sd ?? 0}%
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                        VAT: {selectedCode.vat ?? 0}%
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                        AIT: {selectedCode.ait ?? 0}%
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                        RD: {selectedCode.rd ?? 0}%
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Assessable Value & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="assessableValue" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Assessable Value / Unit *
                  </Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faCircle} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="assessableValue"
                      type="number"
                      min="0"
                      value={assessableValue}
                      onChange={(e) => setAssessableValue(e.target.value)}
                      placeholder="e.g. 5000"
                      className="pl-9 h-11 font-mono text-sm shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="quantity" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity *
                  </Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faCircle} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1"
                      className="pl-9 h-11 font-mono text-sm shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Currency & Exchange Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currency" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Invoice Currency *
                  </Label>
                  <Select value={currency} onValueChange={(val) => setCurrency(val as "BDT" | "USD")}>
                    <SelectTrigger id="currency" className="h-11 font-medium shadow-inner">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="BDT">BDT (৳) - Taka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {currency === "USD" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="exchangeRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Exchange Rate (1 USD = BDT) *
                    </Label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faGlobe} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="exchangeRate"
                        type="number"
                        step="0.01"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(e.target.value)}
                        className="pl-9 h-11 font-mono text-sm shadow-inner"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Base Conversion Rate
                    </Label>
                    <div className="h-11 px-3.5 bg-muted/40 rounded-md border border-border/60 flex items-center text-xs font-mono text-muted-foreground">
                      1.00 BDT (Direct local currency)
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-3">
                <Button
                  variant="outline"
                  className="w-1/3 h-11 text-xs font-medium border-border/80"
                  onClick={handleReset}
                >
                  <FontAwesomeIcon icon={faRotate} className="mr-1.5 h-3.5 w-3.5" /> Reset
                </Button>
                <Button className="w-2/3 h-11 text-xs font-bold gap-2 shadow-md bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700">
                  <FontAwesomeIcon icon={faCalculator} className="h-4 w-4" /> Recalculate Duties
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History Panel */}
          <CalculationHistoryPanel
            history={history}
            onRestore={handleRestoreHistory}
            onClear={() => setHistory([])}
          />
        </div>

        {/* Right Column: Dynamic Duty & Tax Breakdown */}
        <div className="lg:col-span-7 space-y-6">

          {results ? (
            <div className="space-y-6">

              {/* Hero Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="rounded-xl bg-card/70 backdrop-blur-xl border-border/60 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assessable Base (BDT)</p>
                  <p className="text-xl font-extrabold font-mono text-foreground mt-1.5">
                    {formatCurrency(results.baseValueBDT)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Landed items evaluation</p>
                </Card>

                <Card className="rounded-xl bg-amber-500/10 border-amber-500/25 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Total Duties & Taxes</p>
                  <p className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1.5">
                    {formatCurrency(results.totalTaxAmount)}
                  </p>
                  <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">
                    +{taxRatioPercent}% tariff impact
                  </p>
                </Card>

                <Card className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-card border-primary/30 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Grand Total Landed Cost</p>
                  <p className="text-xl font-extrabold font-mono text-primary mt-1.5">
                    {formatCurrency(results.grandTotalAmount)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Base + Combined Taxes</p>
                </Card>
              </div>

              {/* Detailed Breakdown Card */}
              <Card className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileExcel} className="h-5 w-5 text-primary" /> Itemized Tax Schedule Breakdown
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                      Individual NBR tariff schedules applied sequentially per valuation rules.
                    </CardDescription>
                  </div>

                  {/* Export Actions component */}
                  {exportData && (
                    <ExportActions data={exportData} onPrint={handlePrint} />
                  )}
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y divide-border/60">

                    {/* Customs Duty */}
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Customs Duty (CD)</span>
                          <span className="text-xs font-mono font-semibold bg-slate-500/15 text-foreground px-2 py-0.5 rounded">
                            {selectedCode?.cd}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Basis: Assessable Base Value</p>
                      </div>
                      <p className="text-base font-mono font-bold text-foreground">{formatCurrency(results.cdAmount)}</p>
                    </div>

                    {/* Supplementary Duty */}
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Supplementary Duty (SD)</span>
                          <span className="text-xs font-mono font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                            {selectedCode?.sd}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Basis: (Base Value + CD)</p>
                      </div>
                      <p className="text-base font-mono font-bold text-foreground">{formatCurrency(results.sdAmount)}</p>
                    </div>

                    {/* VAT */}
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Value Added Tax (VAT)</span>
                          <span className="text-xs font-mono font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                            {selectedCode?.vat}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Basis: (Base Value + CD + SD)</p>
                      </div>
                      <p className="text-base font-mono font-bold text-foreground">{formatCurrency(results.vatAmount)}</p>
                    </div>

                    {/* AIT */}
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Advance Income Tax (AIT)</span>
                          <span className="text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                            {selectedCode?.ait}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Basis: Assessable Base Value</p>
                      </div>
                      <p className="text-base font-mono font-bold text-foreground">{formatCurrency(results.aitAmount)}</p>
                    </div>

                    {/* Regulatory Duty */}
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Regulatory Duty (RD)</span>
                          <span className="text-xs font-mono font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                            {selectedCode?.rd}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Basis: Assessable Base Value</p>
                      </div>
                      <p className="text-base font-mono font-bold text-foreground">{formatCurrency(results.rdAmount)}</p>
                    </div>

                    {/* Totals Section */}
                    <div className="p-6 bg-gradient-to-br from-card via-muted/40 to-card space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-xs">
                          Total Taxes & Customs Duties
                        </span>
                        <span className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">
                          {formatCurrency(results.totalTaxAmount)}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-2xl font-black text-primary tracking-tight">Grand Landed Cost</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Assessable Base Value + Total Calculated Taxes</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-black font-mono text-primary">
                          {formatCurrency(results.grandTotalAmount)}
                        </p>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="rounded-xl border-dashed border-2 border-border/60 bg-card/50">
              <CardContent className="py-20 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                  <FontAwesomeIcon icon={faCalculator} className="h-12 w-12 text-primary/60" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Select an HS Code to Calculate</h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6 leading-relaxed">
                  Use the AI search above to type a product name, or choose a target HS code from the input dropdown
                  and enter unit assessable values to generate a full duty breakdown.
                </p>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/60">
                    Ready for Input
                  </span>
                  <span className="text-[11px] font-mono text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                    <FontAwesomeIcon icon={faBrain} className="h-3 w-3" />
                    AI Powered
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* ── History Summary (mobile shortcut below main grid) ──────────────── */}
      <div className="lg:hidden">
        {history.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faHistory} className="h-3.5 w-3.5" />
            <span>{history.length} session calculation{history.length !== 1 ? "s" : ""} saved. Check the left panel to restore.</span>
          </div>
        )}
      </div>

      {/* ── Comparison Modal ──────────────────────────────────────────────── */}
      <DutyComparisonModal
        open={showCompare}
        onClose={() => setShowCompare(false)}
        compareList={compareList}
        onRemove={handleRemoveFromCompare}
        baseValueBDT={baseValueBDTForCompare}
      />
    </div>
  )
}

export default function DutyCalculatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading calculator...</div>}>
      <DutyCalculatorInner />
    </Suspense>
  )
}
