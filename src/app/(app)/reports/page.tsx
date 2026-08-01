import { getUserProfile } from "@/actions/auth.actions"
import { getReportKPIs, getShipmentAnalytics, getDocumentAnalytics, getClientAnalytics, getMonthlyTrends, getReportTableRows } from "@/actions/report.actions"
import ReportsClient from "./reports-client"

export const metadata = {
  title: "Reports & Analytics | DN Smart Trade ERP",
  description: "Comprehensive insights and performance metrics.",
}

export default async function ReportsPage() {
  const profileRes = await getUserProfile()
  if (!profileRes.success || !profileRes.data) return null
  
  const userRole = profileRes.data.role || "Employee"
  
  const [
    kpisRes,
    trendsRes,
    shipmentAnalyticsRes,
    documentAnalyticsRes,
    clientAnalyticsRes,
    tableRowsRes
  ] = await Promise.all([
    getReportKPIs(),
    getMonthlyTrends(),
    getShipmentAnalytics(),
    getDocumentAnalytics(),
    getClientAnalytics(),
    getReportTableRows()
  ])

  return (
    <ReportsClient 
      userRole={userRole}
      kpis={kpisRes.data}
      trends={trendsRes.data}
      shipmentAnalytics={shipmentAnalyticsRes.data}
      documentAnalytics={documentAnalyticsRes.data}
      clientAnalytics={clientAnalyticsRes.data}
      tableRows={tableRowsRes.data}
    />
  )
}
