"use client"

import { useState } from "react"
import { notFound, useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { 
  Calculator, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Copy, 
  Check, 
  Tag, 
  Percent, 
  Scale, 
  Info,
  ExternalLink,
  ArrowRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mockHSCodes } from "@/lib/mock-data/hs-codes"

export default function HSCodeDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [copied, setCopied] = useState(false)

  const hsCodeData = mockHSCodes.find((c) => c.code === id)
  
  if (!hsCodeData && id) {
    notFound()
  }

  if (!hsCodeData) return null

  // Calculate combined tax impact
  const totalTaxRate = hsCodeData.cd + hsCodeData.sd + hsCodeData.vat + hsCodeData.ait + hsCodeData.rd

  // Find related codes in the same category
  const relatedCodes = mockHSCodes
    .filter(c => c.category === hsCodeData.category && c.code !== hsCodeData.code)
    .slice(0, 4)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(hsCodeData.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                {hsCodeData.code}
              </h1>
              <span className="text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> {hsCodeData.category}
              </span>
              <span className="text-xs font-mono font-medium bg-muted text-muted-foreground border border-border/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Scale className="h-3 w-3" /> UOM: {hsCodeData.uom}
              </span>
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
                <Check className="h-4 w-4 text-emerald-500" /> Copied Code
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-muted-foreground" /> Copy Code
              </>
            )}
          </Button>
          <Button 
            onClick={() => router.push(`/duty-calculator?hsCode=${hsCodeData.code}`)}
            className="h-10 text-xs font-semibold gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground shadow-md shadow-primary/20"
          >
            <Calculator className="h-4 w-4" /> Calculate Duty
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
                <Info className="h-5 w-5 text-primary" /> Product Classification Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Official Item Name</p>
                <p className="text-xl font-bold text-foreground tracking-tight">{hsCodeData.name}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description & Scope</p>
                <div className="bg-muted/40 p-4 rounded-xl border border-border/50 text-sm text-foreground/90 leading-relaxed font-normal">
                  {hsCodeData.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-background/60 p-3.5 rounded-xl border border-border/60">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit of Measure</p>
                  <p className="text-base font-bold font-mono text-foreground mt-0.5">{hsCodeData.uom}</p>
                </div>
                <div className="bg-background/60 p-3.5 rounded-xl border border-border/60">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System ID</p>
                  <p className="text-base font-bold font-mono text-primary mt-0.5">{hsCodeData.id}</p>
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
                    <Percent className="h-5 w-5 text-amber-500" /> Applicable Tariff & Tax Rates
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
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                
                <div className="bg-gradient-to-br from-card to-muted/40 border border-border/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Customs (CD)</p>
                  <p className="text-2xl font-extrabold font-mono text-foreground">{hsCodeData.cd}%</p>
                </div>

                <div className="bg-gradient-to-br from-card to-muted/40 border border-border/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Supp. (SD)</p>
                  <p className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{hsCodeData.sd}%</p>
                </div>

                <div className="bg-gradient-to-br from-card to-muted/40 border border-border/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">VAT</p>
                  <p className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{hsCodeData.vat}%</p>
                </div>

                <div className="bg-gradient-to-br from-card to-muted/40 border border-border/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">AIT</p>
                  <p className="text-2xl font-extrabold font-mono text-foreground">{hsCodeData.ait}%</p>
                </div>

                <div className="bg-gradient-to-br from-card to-muted/40 border border-border/70 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Reg. Duty (RD)</p>
                  <p className="text-2xl font-extrabold font-mono text-foreground">{hsCodeData.rd}%</p>
                </div>

              </div>

              {/* Total Calculation Note */}
              <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Estimated Total Effective Duty Rate</p>
                    <p className="text-[11px] text-muted-foreground">Cumulative sum of CD + SD + VAT + AIT + RD</p>
                  </div>
                </div>
                <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">{totalTaxRate}%</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Policy & Required Docs */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Policy Notes */}
          <Card className="rounded-xl border-amber-500/30 bg-amber-500/5 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-amber-500/15">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Import Policy Regulations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-xs leading-relaxed text-foreground/90 font-medium">
                {hsCodeData.policyNotes}
              </p>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Required Clearance Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {hsCodeData.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs font-semibold text-foreground p-2.5 rounded-xl bg-background/60 border border-border/50">
                    <span className="p-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span>{doc}</span>
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
              <Tag className="h-4 w-4 text-primary" /> Related HS Codes in &quot;{hsCodeData.category}&quot;
            </h2>
            <Link href="/hs-codes" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              Browse All HS Codes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCodes.map((rel) => (
              <Card key={rel.code} className="rounded-xl border-border/60 bg-card/70 backdrop-blur-xl hover:border-primary/40 transition-all duration-200 shadow-sm group">
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {rel.code}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-muted-foreground">CD: {rel.cd}%</span>
                    </div>
                    <p className="text-xs font-bold text-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {rel.name}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">UOM: {rel.uom}</span>
                    <Link href={`/hs-codes/${rel.code}`} className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
                      View <ExternalLink className="h-3 w-3" />
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
