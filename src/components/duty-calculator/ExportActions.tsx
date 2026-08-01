"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCopy,
  faPrint,
  faDownload,
  faCheck,
} from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export interface ExportData {
  hsCode: string
  description: string
  quantity: string
  assessableValue: string
  currency: string
  exchangeRate: string
  baseValueBDT: number
  cdRate: number
  sdRate: number
  vatRate: number
  aitRate: number
  rdRate: number
  cdAmount: number
  sdAmount: number
  vatAmount: number
  aitAmount: number
  rdAmount: number
  totalTaxAmount: number
  grandTotalAmount: number
}

interface ExportActionsProps {
  data: ExportData
  onPrint: () => void
}

function buildCopySummary(d: ExportData): string {
  return `DUTY CALCULATOR REPORT
-------------------------------
HS Code: ${d.hsCode} - ${d.description}
Quantity: ${d.quantity}
Assessable Value: ${d.assessableValue} ${d.currency} (Rate: ${d.exchangeRate})
Base Landed Value: BDT ${d.baseValueBDT.toFixed(2)}
-------------------------------
Customs Duty (CD ${d.cdRate}%): BDT ${d.cdAmount.toFixed(2)}
Supplementary Duty (SD ${d.sdRate}%): BDT ${d.sdAmount.toFixed(2)}
VAT (${d.vatRate}%): BDT ${d.vatAmount.toFixed(2)}
Advance Income Tax (AIT ${d.aitRate}%): BDT ${d.aitAmount.toFixed(2)}
Regulatory Duty (RD ${d.rdRate}%): BDT ${d.rdAmount.toFixed(2)}
-------------------------------
TOTAL TAXES: BDT ${d.totalTaxAmount.toFixed(2)}
GRAND TOTAL: BDT ${d.grandTotalAmount.toFixed(2)}`
}

function buildCSV(d: ExportData): string {
  const header = "Field,Value"
  const rows = [
    `HS Code,${d.hsCode}`,
    `Description,"${d.description}"`,
    `Quantity,${d.quantity}`,
    `Assessable Value,${d.assessableValue} ${d.currency}`,
    `Exchange Rate,${d.exchangeRate}`,
    `Base Landed Value (BDT),${d.baseValueBDT.toFixed(2)}`,
    `Customs Duty Rate (%),${d.cdRate}`,
    `Customs Duty (BDT),${d.cdAmount.toFixed(2)}`,
    `Supplementary Duty Rate (%),${d.sdRate}`,
    `Supplementary Duty (BDT),${d.sdAmount.toFixed(2)}`,
    `VAT Rate (%),${d.vatRate}`,
    `VAT (BDT),${d.vatAmount.toFixed(2)}`,
    `AIT Rate (%),${d.aitRate}`,
    `AIT (BDT),${d.aitAmount.toFixed(2)}`,
    `Regulatory Duty Rate (%),${d.rdRate}`,
    `Regulatory Duty (BDT),${d.rdAmount.toFixed(2)}`,
    `Total Taxes (BDT),${d.totalTaxAmount.toFixed(2)}`,
    `Grand Total Landed Cost (BDT),${d.grandTotalAmount.toFixed(2)}`,
    `Generated,${new Date().toLocaleString("en-BD")}`,
    `Disclaimer,"Rates are indicative per NBR tariff schedule. Verify with official NBR publications."`,
  ]
  return [header, ...rows].join("\n")
}

export function ExportActions({ data, onPrint }: ExportActionsProps) {
  const [copied, setCopied] = useState(false)
  const [exported, setExported] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopySummary(data))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportCSV = () => {
    const csv = buildCSV(data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `duty-calc-${data.hsCode}-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-8 text-xs gap-1.5 border-border/80"
        aria-label="Copy calculation report to clipboard"
      >
        {copied ? (
          <>
            <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5 text-emerald-500" />
            Copied
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCopy} className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Report
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        className="h-8 text-xs gap-1.5 border-border/80"
        aria-label="Export calculation as CSV file"
      >
        {exported ? (
          <>
            <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5 text-emerald-500" />
            Exported
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faDownload} className="h-3.5 w-3.5 text-muted-foreground" />
            Export CSV
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onPrint}
        className="h-8 text-xs gap-1.5 border-border/80"
        aria-label="Print calculation report"
      >
        <FontAwesomeIcon icon={faPrint} className="h-3.5 w-3.5 text-muted-foreground" />
        Print
      </Button>
    </div>
  )
}
