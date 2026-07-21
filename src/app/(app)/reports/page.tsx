"use client"

import { PageHeader } from "@/components/erp/page-header"
import { KPICards } from "@/components/reports/kpi-cards"
import { ChartsSection } from "@/components/reports/charts-section"
import { FilterPanel, FilterState } from "@/components/reports/filter-panel"
import { ReportTabs } from "@/components/reports/report-tabs"
import { AnalyticsInsights } from "@/components/reports/analytics-insights"
import { AuthService } from "@/lib/auth"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, BarChart2, CheckCircle2, Clock, DollarSign, Activity, FileSpreadsheet } from "lucide-react"

export default function ReportsPage() {
  const [filters, setFilters] = useState<FilterState | null>(null)
  const [userRole] = useState<string | null>(() => {
    const user = AuthService.getCurrentUser()
    return user ? user.role : null
  })

  // Show nothing while checking role (or loading state)
  if (!userRole) return null

  // Access Control: Clients have no access
  if (userRole === "Client") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="max-w-md w-full border-destructive/30 rounded-2xl shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto size-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="size-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive font-bold text-xl">Access Restricted</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-2">
              You do not have permission to view the Reports & Analytics module. 
              This section is reserved for administrative and authorized operations staff.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <PageHeader 
        title="Reports & Analytics" 
        description="Comprehensive trade operational insights, financial performance metrics, and intelligence analytics."
      />

      {/* Executive Summary Banner */}
      <Card className="border border-border/80 bg-gradient-to-r from-card via-primary/5 to-card rounded-2xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Executive Overview
              </span>
              <span className="text-xs text-muted-foreground font-medium">Q3 2026 Reporting Cycle</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Enterprise Performance Briefing
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time audit of trade volumes, customs filings, client contributions, and projected financial trajectories across active global corridors.
            </p>
          </div>

          {/* Quick Callout Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 shrink-0">
            <div className="p-3 rounded-xl bg-background/80 border border-border/60 backdrop-blur-xs space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <DollarSign className="size-3.5 text-emerald-500" />
                Gross Revenue
              </div>
              <div className="text-lg font-bold text-foreground">$2.4M</div>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border/60 backdrop-blur-xs space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <BarChart2 className="size-3.5 text-primary" />
                Active Loads
              </div>
              <div className="text-lg font-bold text-foreground">432</div>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border/60 backdrop-blur-xs space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <CheckCircle2 className="size-3.5 text-sky-500" />
                Clearance Rate
              </div>
              <div className="text-lg font-bold text-foreground">96.4%</div>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border/60 backdrop-blur-xs space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Clock className="size-3.5 text-purple-500" />
                Avg Latency
              </div>
              <div className="text-lg font-bold text-foreground">1.2 Days</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Control Center */}
      <FilterPanel onApply={setFilters} />

      {/* KPI Metrics Grid */}
      <KPICards />

      {/* Main Grid Section (12 columns: 8 main, 4 sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <ChartsSection />
          <ReportTabs filters={filters} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6 space-y-6">
            <AnalyticsInsights />

            {/* Quick Status / Operations Audit Widget */}
            <Card className="border border-border/80 shadow-xs rounded-2xl bg-card overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Activity className="size-4 text-primary" />
                  System Health & Audit Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">BOE System Sync:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Customs Clearance API:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Daily Report Backup:</span>
                  <span className="font-bold text-foreground font-mono">02:00 UTC (Success)</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <FileSpreadsheet className="size-3.5 text-primary" />
                    Active Dataset:
                  </span>
                  <span className="font-semibold text-primary">50 Log Records</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
