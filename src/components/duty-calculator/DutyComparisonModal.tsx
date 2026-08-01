"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartBar, faTimes, faArrowDown, faArrowUp, faMinus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AIMatchCandidate } from "@/actions/hs-code-ai.actions"

interface DutyComparisonModalProps {
  open: boolean
  onClose: () => void
  compareList: AIMatchCandidate[]
  onRemove: (hsCode: string) => void
  /** CIF base value in BDT to compute monetary differences */
  baseValueBDT: number
}

interface ComputedRow {
  candidate: AIMatchCandidate
  grandTotalRate: number // sum of all rates (%)
  grandTotalBDT: number // monetary total given baseValueBDT
}

function computeGrandTotal(candidate: AIMatchCandidate, baseValueBDT: number): ComputedRow {
  const { cd, sd, vat, ait, rd, at } = candidate.duties
  // Replicate the same stepped formula used in page.tsx
  const cdAmt = baseValueBDT * (cd / 100)
  const sdAmt = (baseValueBDT + cdAmt) * (sd / 100)
  const vatAmt = (baseValueBDT + cdAmt + sdAmt) * (vat / 100)
  const aitAmt = baseValueBDT * (ait / 100)
  const rdAmt = baseValueBDT * (rd / 100)
  const atAmt = baseValueBDT * (at / 100)
  const totalTax = cdAmt + sdAmt + vatAmt + aitAmt + rdAmt + atAmt
  return {
    candidate,
    grandTotalRate: cd + sd + vat + ait + rd + at,
    grandTotalBDT: baseValueBDT + totalTax,
  }
}

const formatBDT = (n: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n)

const formatPct = (n: number) => `${n.toFixed(1)}%`

export function DutyComparisonModal({
  open,
  onClose,
  compareList,
  onRemove,
  baseValueBDT,
}: DutyComparisonModalProps) {
  if (compareList.length === 0) return null

  const effectiveBase = baseValueBDT > 0 ? baseValueBDT : 100_000 // default 1 lac BDT for illustration

  const rows: ComputedRow[] = compareList.map((c) => computeGrandTotal(c, effectiveBase))
  const totals = rows.map((r) => r.grandTotalBDT)
  const minTotal = Math.min(...totals)
  const maxTotal = Math.max(...totals)
  const potentialSavings = maxTotal - minTotal

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl p-0 flex flex-col"
        aria-describedby="compare-desc"
      >
        <SheetHeader className="px-6 pt-5 pb-4 border-b border-border/60 bg-muted/20 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/15">
                <FontAwesomeIcon icon={faChartBar} className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold">Compare Tariff Schedules</SheetTitle>
                <SheetDescription id="compare-desc" className="text-xs text-muted-foreground mt-0.5">
                  Side-by-side comparison of up to 3 HS Codes
                  {baseValueBDT > 0 && (
                    <span className="ml-1 font-mono">
                      · Base: {formatBDT(baseValueBDT)}
                    </span>
                  )}
                  {baseValueBDT === 0 && (
                    <span className="ml-1 text-amber-600 dark:text-amber-400">
                      · Enter CIF value for monetary estimates
                    </span>
                  )}
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-5">

            {/* Potential Savings Banner */}
            {compareList.length > 1 && potentialSavings > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Potential Savings</p>
                  <p className="text-[11px] text-muted-foreground">
                    Choosing the lowest-duty HS Code saves{" "}
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {baseValueBDT > 0 ? formatBDT(potentialSavings) : `${(((maxTotal - minTotal) / effectiveBase) * 100).toFixed(1)}% of base value`}
                    </span>{" "}
                    compared to the highest-duty option.
                  </p>
                </div>
              </div>
            )}

            {/* Comparison Cards */}
            <div className={`grid gap-4 ${compareList.length === 1 ? "grid-cols-1" : compareList.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
              {rows.map((row) => {
                const isLowest = row.grandTotalBDT === minTotal && compareList.length > 1
                const isHighest = row.grandTotalBDT === maxTotal && compareList.length > 1 && maxTotal !== minTotal
                const diff = row.grandTotalBDT - minTotal
                const extraDutyBDT = diff

                let cardBorder = "border-border/60"
                let cardBg = "bg-card/70"
                let badge = null

                if (isLowest && compareList.length > 1) {
                  cardBorder = "border-emerald-500/40"
                  cardBg = "bg-emerald-500/5"
                  badge = (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500 text-white rounded-full">
                      Lowest Duty ★
                    </span>
                  )
                } else if (isHighest) {
                  cardBorder = "border-red-500/40"
                  cardBg = "bg-red-500/5"
                  badge = (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-500 text-white rounded-full">
                      Highest Duty
                    </span>
                  )
                }

                return (
                  <div
                    key={row.candidate.hsCode}
                    className={`rounded-xl border ${cardBorder} ${cardBg} overflow-hidden`}
                  >
                    {/* Card Header */}
                    <div className="px-4 py-3 border-b border-border/40 flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black font-mono text-foreground">{row.candidate.hsCode}</span>
                          {badge}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                          {row.candidate.tariffDescription}
                        </p>
                        <p className="text-[10px] font-mono text-primary">{row.candidate.category}</p>
                      </div>
                      <button
                        onClick={() => onRemove(row.candidate.hsCode)}
                        className="flex-shrink-0 p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Remove ${row.candidate.hsCode} from comparison`}
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Duty Rate Rows */}
                    <div className="divide-y divide-border/40">
                      {[
                        { label: "Customs Duty", key: "cd" as const, color: "text-foreground" },
                        { label: "Supplementary Duty", key: "sd" as const, color: "text-amber-700 dark:text-amber-300" },
                        { label: "VAT", key: "vat" as const, color: "text-blue-700 dark:text-blue-300" },
                        { label: "AIT", key: "ait" as const, color: "text-emerald-700 dark:text-emerald-300" },
                        { label: "AT", key: "at" as const, color: "text-cyan-700 dark:text-cyan-300" },
                        { label: "Regulatory Duty", key: "rd" as const, color: "text-purple-700 dark:text-purple-300" },
                        { label: "TTI", key: "tti" as const, color: "text-primary font-extrabold" },
                      ].map((d) => (
                        <div key={d.key} className="flex items-center justify-between px-4 py-1.5">
                          <span className="text-[11px] text-muted-foreground">{d.label}</span>
                          <span className={`text-xs font-bold font-mono ${d.color}`}>
                            {row.candidate.duties[d.key]}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Grand Total & Difference */}
                    <div className="px-4 py-3 bg-muted/30 border-t border-border/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">Grand Total Rate</span>
                        <span className="text-sm font-black font-mono text-foreground">
                          {formatPct(row.grandTotalRate)}
                        </span>
                      </div>

                      {baseValueBDT > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">Grand Total (BDT)</span>
                          <span className="text-sm font-black font-mono text-primary">
                            {formatBDT(row.grandTotalBDT)}
                          </span>
                        </div>
                      )}

                      {compareList.length > 1 && (
                        <div className="pt-1 border-t border-border/40 space-y-1">
                          {/* Difference */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <FontAwesomeIcon
                                icon={isLowest ? faMinus : isHighest ? faArrowUp : faArrowUp}
                                className={`h-2.5 w-2.5 ${isLowest ? "text-emerald-500" : "text-red-500"}`}
                              />
                              Difference vs Lowest
                            </span>
                            <span className={`text-[10px] font-mono font-bold ${isLowest ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                              {isLowest ? "—" : `+${formatPct(((row.grandTotalBDT - minTotal) / effectiveBase) * 100)}`}
                            </span>
                          </div>

                          {/* Extra Duty */}
                          {baseValueBDT > 0 && !isLowest && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">Extra Duty</span>
                              <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400">
                                +{formatBDT(extraDutyBDT)}
                              </span>
                            </div>
                          )}

                          {/* Potential Savings */}
                          {isHighest && baseValueBDT > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <FontAwesomeIcon icon={faArrowDown} className="h-2.5 w-2.5 text-emerald-500" />
                                Savings if switched
                              </span>
                              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {formatBDT(potentialSavings)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty state for 1 item */}
            {compareList.length === 1 && (
              <p className="text-center text-xs text-muted-foreground py-4">
                Add 1–2 more HS Codes to compare differences.
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border/60 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full h-9 text-xs">
            Close Comparison
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
