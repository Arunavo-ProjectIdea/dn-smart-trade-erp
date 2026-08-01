"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHistory,
  faChevronDown,
  faChevronUp,
  faTrash,
  faClock,
  faCalculator,
} from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

export interface CalcHistoryEntry {
  id: string
  timestamp: string
  hsCode: string
  description: string
  assessableValue: string
  quantity: string
  currency: "USD" | "BDT"
  exchangeRate: string
  results: {
    baseValueBDT: number
    totalTaxAmount: number
    grandTotalAmount: number
  }
}

interface CalculationHistoryPanelProps {
  history: CalcHistoryEntry[]
  onRestore: (entry: CalcHistoryEntry) => void
  onClear: () => void
}

const formatBDT = (n: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n)

export function CalculationHistoryPanel({
  history,
  onRestore,
  onClear,
}: CalculationHistoryPanelProps) {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <div className="rounded-xl border border-border/60 bg-card/70 shadow-sm overflow-hidden">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
        aria-expanded={open}
        aria-label="Toggle calculation history"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-muted">
            <FontAwesomeIcon icon={faHistory} className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Calculation History</p>
            <p className="text-[11px] text-muted-foreground">
              {history.length} session {history.length === 1 ? "calculation" : "calculations"} · click to restore
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
            {history.length}/10
          </span>
          <FontAwesomeIcon
            icon={open ? faChevronUp : faChevronDown}
            className="h-3.5 w-3.5 text-muted-foreground"
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/60">
              <ScrollArea className="max-h-72">
                <div className="divide-y divide-border/40">
                  {[...history].reverse().map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => onRestore(entry)}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex-shrink-0 mt-0.5 p-1 rounded bg-muted/60">
                          <FontAwesomeIcon icon={faCalculator} className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold font-mono text-foreground">{entry.hsCode}</span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                              {entry.description}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {entry.assessableValue} {entry.currency} × {entry.quantity}
                            </span>
                            <span className="text-[10px] font-bold text-primary font-mono">
                              → {formatBDT(entry.results.grandTotalAmount)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                            <FontAwesomeIcon icon={faClock} className="h-2.5 w-2.5" />
                            {entry.timestamp}
                          </div>
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Restore →
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="px-4 py-2.5 border-t border-border/60 bg-muted/20 flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClear()
                  }}
                  className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                  Clear History
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
