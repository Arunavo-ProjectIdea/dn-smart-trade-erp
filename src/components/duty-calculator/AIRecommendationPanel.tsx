"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBrain,
  faShieldAlt,
  faTag,
  faIndustry,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faTimes,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { AIMatchCandidate } from "@/actions/hs-code-ai.actions"
import { motion, AnimatePresence } from "framer-motion"

interface AIRecommendationPanelProps {
  candidate: AIMatchCandidate
  allCandidates: AIMatchCandidate[]
  onUseHSCode: (candidate: AIMatchCandidate) => void
  onAddToCompare: (candidate: AIMatchCandidate) => void
  onDismiss: () => void
  compareList: AIMatchCandidate[]
}

function getConfidenceBadge(confidence: number): {
  label: string
  color: string
  bgColor: string
  barColor: string
} {
  if (confidence >= 85)
    return { label: "High", color: "text-emerald-700 dark:text-emerald-300", bgColor: "bg-emerald-500/15 border-emerald-500/30", barColor: "bg-emerald-500" }
  if (confidence >= 65)
    return { label: "Medium", color: "text-blue-700 dark:text-blue-300", bgColor: "bg-blue-500/15 border-blue-500/30", barColor: "bg-blue-500" }
  if (confidence >= 45)
    return { label: "Low", color: "text-amber-700 dark:text-amber-300", bgColor: "bg-amber-500/15 border-amber-500/30", barColor: "bg-amber-500" }
  return { label: "Very Low", color: "text-red-700 dark:text-red-300", bgColor: "bg-red-500/15 border-red-500/30", barColor: "bg-red-500" }
}

function getImportRisk(tti: number): { level: string; description: string; color: string } {
  if (tti >= 100) return { level: "Very High", description: "Heavy duty product — significant tax burden expected at customs.", color: "text-red-600 dark:text-red-400" }
  if (tti >= 60) return { level: "High", description: "Moderate-high tariff — plan for substantial landed cost.", color: "text-orange-600 dark:text-orange-400" }
  if (tti >= 30) return { level: "Moderate", description: "Standard tariff range — typical for most consumer goods.", color: "text-amber-600 dark:text-amber-400" }
  return { level: "Low", description: "Minimal duty burden — likely essential or zero-rated category.", color: "text-emerald-600 dark:text-emerald-400" }
}

function getTypicalUsage(description: string, category: string): string {
  const desc = description.toLowerCase()
  if (desc.includes("motor") || desc.includes("engine") || desc.includes("vehicle"))
    return "Used in automotive, manufacturing, or industrial transport sectors."
  if (desc.includes("cotton") || desc.includes("textile") || desc.includes("fabric") || desc.includes("yarn"))
    return "Textile & garment manufacturing; RMG exports and domestic apparel."
  if (desc.includes("electronic") || desc.includes("computer") || desc.includes("phone") || desc.includes("digital"))
    return "Consumer electronics, IT hardware, or communications equipment."
  if (desc.includes("plastic") || desc.includes("polymer"))
    return "Packaging, construction, and light manufacturing applications."
  if (desc.includes("steel") || desc.includes("iron") || desc.includes("metal") || desc.includes("alloy"))
    return "Construction, infrastructure, and heavy industrial use."
  if (desc.includes("chemical") || desc.includes("acid") || desc.includes("compound"))
    return "Pharmaceutical, agricultural, or industrial chemical processing."
  if (desc.includes("food") || desc.includes("cereal") || desc.includes("grain") || desc.includes("sugar"))
    return "Food processing, retail consumption, or agricultural supply chain."
  if (category.toLowerCase().includes("machinery"))
    return "Industrial machinery, production equipment, and capital goods import."
  return `General commercial import under ${category || "NBR tariff schedule"}.`
}

export function AIRecommendationPanel({
  candidate,
  allCandidates,
  onUseHSCode,
  onAddToCompare,
  onDismiss,
  compareList,
}: AIRecommendationPanelProps) {
  const [showAlternatives, setShowAlternatives] = useState(false)
  const confidenceMeta = getConfidenceBadge(candidate.confidence)
  const importRisk = getImportRisk(candidate.duties.tti)
  const typicalUsage = getTypicalUsage(candidate.tariffDescription, candidate.category)
  const isInCompare = compareList.some((c) => c.hsCode === candidate.hsCode)
  const alternativeCandidates = allCandidates.filter((c) => c.hsCode !== candidate.hsCode)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="rounded-xl border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm overflow-hidden">
        <CardHeader className="border-b border-primary/20 bg-primary/5 pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-primary/15">
                <FontAwesomeIcon icon={faBrain} className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2 flex-wrap">
                  AI Recommendation
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${confidenceMeta.bgColor} ${confidenceMeta.color}`}>
                    {confidenceMeta.label} Confidence
                  </span>
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Best HS Code match for your product search
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss AI recommendation"
            >
              <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-4 pb-4 space-y-4">

          {/* AI Selected HS Code */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">AI Selected HS Code</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-black font-mono text-primary">{candidate.hsCode}</span>
                <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded border border-border/60">
                  TTI: {candidate.duties.tti}%
                </span>
              </div>
              <p className="text-xs text-foreground font-medium leading-snug mt-1 line-clamp-2">
                {candidate.tariffDescription}
              </p>
            </div>

            {/* Confidence Score */}
            <div className="flex-shrink-0 text-right space-y-1 min-w-[80px]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Confidence</p>
              <p className={`text-2xl font-black font-mono ${confidenceMeta.color}`}>{candidate.confidence}%</p>
              <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden ml-auto">
                <div
                  className={`h-full rounded-full transition-all ${confidenceMeta.barColor}`}
                  style={{ width: `${candidate.confidence}%` }}
                />
              </div>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Duty Rate Grid */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Estimated Duties</p>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
              {[
                { label: "CD", value: candidate.duties.cd, color: "bg-slate-500/15 text-foreground" },
                { label: "SD", value: candidate.duties.sd, color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
                { label: "VAT", value: candidate.duties.vat, color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
                { label: "AIT", value: candidate.duties.ait, color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
                { label: "AT", value: candidate.duties.at, color: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" },
                { label: "RD", value: candidate.duties.rd, color: "bg-purple-500/15 text-purple-700 dark:text-purple-300" },
                { label: "TTI", value: candidate.duties.tti, color: "bg-primary/15 text-primary font-extrabold" },
              ].map((d) => (
                <div key={d.label} className={`text-center rounded-lg p-1.5 border border-border/30 ${d.color}`}>
                  <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">{d.label}</p>
                  <p className="text-xs font-bold font-mono">{d.value}%</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Three Info Blocks: Industry, Risk, Usage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Recommended Industry */}
            <div className="bg-muted/40 rounded-lg p-3 border border-border/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <FontAwesomeIcon icon={faIndustry} className="h-3 w-3" />
                Recommended Industry
              </div>
              <p className="text-xs font-semibold text-foreground leading-snug">{candidate.category}</p>
            </div>

            {/* Import Risk */}
            <div className="bg-muted/40 rounded-lg p-3 border border-border/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                Import Risk
              </div>
              <p className={`text-xs font-bold ${importRisk.color}`}>{importRisk.level}</p>
              <p className="text-[10px] text-muted-foreground leading-snug hidden sm:block">{importRisk.description}</p>
            </div>

            {/* Typical Usage */}
            <div className="bg-muted/40 rounded-lg p-3 border border-border/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <FontAwesomeIcon icon={faTag} className="h-3 w-3" />
                Typical Usage
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">{typicalUsage}</p>
            </div>
          </div>

          {/* Reasoning & Keywords */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/40 space-y-2">
            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={faInfoCircle} className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">{candidate.reasoning}</p>
            </div>
            {candidate.matchedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidate.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Legal Disclaimer */}
          <div className="flex items-start gap-2 text-[10px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5">
            <FontAwesomeIcon icon={faShieldAlt} className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-amber-700 dark:text-amber-400">NBR Disclaimer:</strong> Tariff rates are
              indicative based on NBR schedule. Always verify with official Bangladesh National Board of Revenue
              (NBR) publications before finalising any customs declaration.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => onUseHSCode(candidate)}
              className="h-8 text-xs gap-1.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="h-3.5 w-3.5" />
              Use this HS Code
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddToCompare(candidate)}
              disabled={isInCompare || compareList.length >= 3}
              className="h-8 text-xs gap-1.5 border-border/80"
            >
              {isInCompare ? "In Compare List" : `+ Compare (${compareList.length}/3)`}
            </Button>
            {alternativeCandidates.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAlternatives((p) => !p)}
                className="h-8 text-xs gap-1.5 text-muted-foreground ml-auto"
              >
                {showAlternatives ? (
                  <>
                    <FontAwesomeIcon icon={faChevronUp} className="h-3 w-3" />
                    Hide Alternatives
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
                    {alternativeCandidates.length} Alternatives
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Alternative Candidates */}
          <AnimatePresence>
            {showAlternatives && alternativeCandidates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Alternative Matches</p>
                  {alternativeCandidates.map((alt) => {
                    const altConf = getConfidenceBadge(alt.confidence)
                    const altInCompare = compareList.some((c) => c.hsCode === alt.hsCode)
                    return (
                      <div
                        key={alt.hsCode}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors"
                      >
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold font-mono text-foreground">{alt.hsCode}</span>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${altConf.bgColor} ${altConf.color}`}>
                              {alt.confidence}%
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{alt.tariffDescription}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] px-2"
                            onClick={() => onUseHSCode(alt)}
                          >
                            Use
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] px-2"
                            onClick={() => onAddToCompare(alt)}
                            disabled={altInCompare || compareList.length >= 3}
                          >
                            +Compare
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
