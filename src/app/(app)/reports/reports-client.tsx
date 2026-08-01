"use client"

import { PageHeader } from "@/components/erp/page-header"
import { KPICards } from "@/components/reports/kpi-cards"
import { ChartsSection } from "@/components/reports/charts-section"
import { FilterPanel, FilterState } from "@/components/reports/filter-panel"
import { ReportTable } from "@/components/reports/report-table"
import { AnalyticsInsights } from "@/components/reports/analytics-insights"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { ReportKPIs, MonthlyTrend, ShipmentAnalytics, DocumentAnalytics, ClientAnalytics, ReportTableRow } from "@/actions/report.actions"

interface ReportsClientProps {
  userRole: string
  kpis?: ReportKPIs
  trends?: MonthlyTrend[]
  shipmentAnalytics?: ShipmentAnalytics
  documentAnalytics?: DocumentAnalytics
  clientAnalytics?: ClientAnalytics
  tableRows?: ReportTableRow[]
}

export default function ReportsClient({
  userRole,
  kpis,
  trends,
  shipmentAnalytics,
  documentAnalytics,
  clientAnalytics,
  tableRows
}: ReportsClientProps) {
  const [filters, setFilters] = useState<FilterState | null>(null)
  const { toast } = useToast()

  const handleExport = (type: "PDF" | "Excel") => {
    if (type === "PDF") {
      toast({ title: "Export Started", description: "Generating PDF report..." })
      window.print()
    } else if (type === "Excel") {
      if (!tableRows || tableRows.length === 0) {
        toast({ title: "Export Failed", description: "No data available to export.", variant: "destructive" })
        return
      }

      toast({ title: "Export Started", description: "Generating Excel (CSV) report..." })
      
      const headers = ["ID", "Date", "Type", "Name", "Status", "User"]
      
      const escapeCSV = (val: string | undefined | null) => {
        if (!val) return '""'
        const str = String(val)
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      const rows = tableRows.map(row => [
        escapeCSV(row.id),
        escapeCSV(row.date),
        escapeCSV(row.entityType),
        escapeCSV(row.entityName),
        escapeCSV(row.status),
        escapeCSV(row.user)
      ].join(','))

      const csvContent = [headers.join(','), ...rows].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      const dateStr = new Date().toISOString().split('T')[0]
      link.href = url
      link.setAttribute("download", `reports-export-${dateStr}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-10 animate-in fade-in duration-500">
      <PageHeader 
        title="Reports & Analytics" 
        description="Comprehensive insights and performance metrics."
        action={
          <div className="flex flex-col items-end text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border shadow-sm">
            <span className="font-medium text-foreground">Reporting Period: <span className="font-normal text-muted-foreground">This Year</span></span>
            <span className="text-[11px]">Last Updated: Today</span>
          </div>
        }
      />
      
      <div className="space-y-6">
        <FilterPanel onApply={setFilters} onExport={handleExport} />
        <KPICards data={kpis} userRole={userRole} />
        
        <div className="flex flex-col gap-6">
          <ChartsSection trends={trends} userRole={userRole} />
          {userRole !== "Client" && (
             <AnalyticsInsights 
               shipmentAnalytics={shipmentAnalytics} 
               documentAnalytics={documentAnalytics} 
               clientAnalytics={clientAnalytics} 
             />
          )}
          <ReportTable filters={filters} tableRows={tableRows} userRole={userRole} />
        </div>
      </div>
    </div>
  )
}
