"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faArrowLeft, faCircleCheck, faShieldHalved, faFileLines, faCircle, faCheck, faInfoCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getHSCodeByHscode, getRelatedHSCodes, type HSCodeRow } from "@/actions/hs-codes.actions"

export default function HSCodeDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [copied, setCopied] = useState(false)
  const [hsCodeData, setHsCodeData] = useState<HSCodeRow | null>(null)
  const [relatedCodes, setRelatedCodes] = useState<HSCodeRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      setIsLoading(true)
      const [data, related] = await Promise.all([
        getHSCodeByHscode(id),
        getRelatedHSCodes(id, 4),
      ])
      setIsLoading(false)
      if (!data) {
        setNotFound(true)
        return
      }
      setHsCodeData(data)
      setRelatedCodes(related)
    }
    load()
  }, [id])

  const handleCopyCode = () => {
    if (!hsCodeData) return
    navigator.clipboard.writeText(hsCodeData.hscode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !hsCodeData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-lg font-bold text-foreground">HS Code &quot;{id}&quot; not found</p>
        <p className="text-sm text-muted-foreground">This code does not exist in the database.</p>
        <Button onClick={() => router.push("/hs-codes")} variant="outline" className="gap-2">
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" /> Back to HS Codes
        </Button>
      </div>
    )
  }

  const cd = hsCodeData.cd ?? 0
  const sd = hsCodeData.sd ?? 0
  const vat = hsCodeData.vat ?? 0
  const ait = hsCodeData.ait ?? 0
  const rd = hsCodeData.rd ?? 0
  const at = hsCodeData.at ?? 0
  const tti = hsCodeData.tti ?? 0
  const totalTaxRate = cd + sd + vat + ait + rd + at

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">

      {/* Hero Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/70 backdrop-blur-xl p-6 rounded-xl border border-border/60 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/hs-codes")}
            className="h-10 w-10 rounded-xl border-border/80 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                {hsCodeData.hscode}
              </h1>
              {hsCodeData.category && (
                <span className="text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCircle} className="h-3.5 w-3.5" /> {hsCodeData.category}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Official Customs Tariff Classification Code
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleCopyCode}
            className="h-10 text-xs font-medium gap-1.5 border-border/80"
          >
            {copied ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-emerald-500" /> Copied Code
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCircle} className="h-4 w-4 text-muted-foreground" /> Copy Code
              </>
            )}
          </Button>
          <Button
            onClick={() => router.push(`/duty-calculator?hsCode=${hsCodeData.hscode}`)}
            className="h-10 text-xs font-semibold gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground shadow-md shadow-primary/20"
          >
            <FontAwesomeIcon icon={faCalculator} className="h-4 w-4" /> Calculate Duty
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Product Info & Taxes */}
        <div className="lg:col-span-2 space-y-8">

          {/* Product Information Card */}
          <Card className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-primary" /> Product Classification Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tariff Description</p>
                <p className="text-xl font-bold text-foreground tracking-tight">{hsCodeData.tariff_description ?? "—"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-background/60 p-3.5 rounded-xl border border-border/60">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HS Code</p>
                  <p className="text-base font-bold font-mono text-primary mt-0.5">{hsCodeData.hscode}</p>
                </div>
                <div className="bg-background/60 p-3.5 rounded-xl border border-border/60">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TTI Rate</p>
                  <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{tti}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Rates & Duties Card */}
          <Card className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircle} className="h-5 w-5 text-amber-500" /> Applicable Tariff &amp; Tax Rates
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    Current duty percentages applicable for customs clearance.
                  </CardDescription>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
                  Total Tax Impact: {totalTaxRate}%
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {[
                  { label: "Customs (CD)", value: cd, color: "text-foreground" },
                  { label: "Supp. (SD)", value: sd, color: "text-amber-600 dark:text-amber-400" },
                  { label: "VAT", value: vat, color: "text-blue-600 dark:text-blue-400" },
                  { label: "AIT", value: ait, color: "text-foreground" },
                  { label: "Reg. Duty (RD)", value: rd, color: "text-foreground" },
                  { label: "AT", value: at, color: "text-purple-600 dark:text-purple-400" },
                ].map(item => (
                  <div key={item.label} className="bg-gradient-to-br from-card to-muted/40 border border-border/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                    <p className={`text-2xl font-extrabold font-mono ${item.color}`}>{item.value}%</p>
                  </div>
                ))}
              </div>

              {/* Total Calculation Note */}
              <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                    <FontAwesomeIcon icon={faCalculator} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Estimated Total Effective Duty Rate</p>
                    <p className="text-[11px] text-muted-foreground">Cumulative sum of CD + SD + VAT + AIT + RD + AT</p>
                  </div>
                </div>
                <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">{totalTaxRate}%</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: TTI & Info */}
        <div className="lg:col-span-1 space-y-8">

          {/* TTI Summary */}
          <Card className="rounded-xl border-amber-500/30 bg-amber-500/5 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-amber-500/15">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Total Tax Incidence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-4xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{tti}%</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                The Total Tax Incidence (TTI) is the pre-calculated composite tax rate for this HS code as defined by the Bangladesh National Board of Revenue (NBR).
              </p>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faFileLines} className="h-5 w-5 text-primary" />
                Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {[
                  { label: "CD (Customs Duty)", value: `${cd}%` },
                  { label: "SD (Supplementary Duty)", value: `${sd}%` },
                  { label: "VAT", value: `${vat}%` },
                  { label: "AIT (Advance Income Tax)", value: `${ait}%` },
                  { label: "RD (Regulatory Duty)", value: `${rd}%` },
                  { label: "AT (Advance Tax)", value: `${at}%` },
                ].map((item) => (
                  <li key={item.label} className="flex items-center justify-between text-xs font-semibold text-foreground p-2.5 rounded-xl bg-background/60 border border-border/50">
                    <span className="flex items-center gap-2">
                      <span className="p-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5" />
                      </span>
                      {item.label}
                    </span>
                    <span className="font-mono">{item.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Related HS Codes Section */}
      {relatedCodes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FontAwesomeIcon icon={faCircle} className="h-4 w-4 text-primary" /> Related HS Codes in Same Chapter
            </h2>
            <Link href="/hs-codes" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              Browse All HS Codes <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCodes.map((rel) => (
              <Card key={rel.id} className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl hover:border-primary/40 transition-all duration-200 shadow-sm group">
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {rel.hscode}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-muted-foreground">CD: {rel.cd ?? 0}%</span>
                    </div>
                    <p className="text-xs font-bold text-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {rel.tariff_description ?? "—"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">TTI: {rel.tti ?? 0}%</span>
                    <Link href={`/hs-codes/${rel.hscode}`} className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
                      View <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
