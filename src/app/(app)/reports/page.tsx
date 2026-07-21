"use client"

import { PageHeader } from "@/components/erp/page-header"
import { KPICards } from "@/components/reports/kpi-cards"
import { ChartsSection } from "@/components/reports/charts-section"
import { FilterPanel, FilterState } from "@/components/reports/filter-panel"
import { ReportTabs } from "@/components/reports/report-tabs"
import { AnalyticsInsights } from "@/components/reports/analytics-insights"
import { AuthService } from "@/lib/auth"
import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function ReportsPage() {
  const [filters, setFilters] = useState<FilterState | null>(null);
  const [userRole] = useState<string | null>(() => {
    const user = AuthService.getCurrentUser();
    return user ? user.role : null;
  });

  // Show nothing while checking role (or loading state)
  if (!userRole) return null

  // Access Control: Clients have no access
  if (userRole === "Client") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="max-w-md w-full border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-700">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view the Reports & Analytics module. 
              This section is restricted to administrative and internal employee accounts.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="Reports & Analytics" 
        description="Comprehensive insights and performance metrics."
      />
      
      <div className="space-y-6 mt-4">
        <FilterPanel onApply={setFilters} />
        <KPICards />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <ChartsSection />
            <ReportTabs filters={filters} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AnalyticsInsights />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
