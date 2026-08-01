import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faChevronRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import type { ShipmentAnalytics, DocumentAnalytics, ClientAnalytics } from "@/actions/report.actions"
import { EmptyState } from "@/components/ui/empty-state"

interface AnalyticsInsightsProps {
  shipmentAnalytics?: ShipmentAnalytics
  documentAnalytics?: DocumentAnalytics
  clientAnalytics?: ClientAnalytics
}

export function AnalyticsInsights({ shipmentAnalytics, documentAnalytics, clientAnalytics }: AnalyticsInsightsProps) {
  const insights: string[] = []

  if (shipmentAnalytics) {
    const completed = shipmentAnalytics.byStatus["Completed"] || 0
    const inTransit = shipmentAnalytics.byStatus["In Transit"] || 0
    if (completed > 0) insights.push(`${completed} shipments have been successfully completed.`)
    if (inTransit > 0) insights.push(`${inTransit} shipments are currently in transit.`)
    
    const air = shipmentAnalytics.byTransportType["Air"] || 0
    const sea = shipmentAnalytics.byTransportType["Sea"] || 0
    if (air > sea) insights.push(`Air freight is currently the most popular transport method (${air} shipments).`)
    else if (sea > 0) insights.push(`Sea freight is currently the most popular transport method (${sea} shipments).`)
  }

  if (documentAnalytics) {
    const pending = documentAnalytics.byStatus["Pending Review"] || 0
    if (pending > 0) insights.push(`There are ${pending} documents pending review.`)
  }

  if (clientAnalytics) {
    const active = clientAnalytics.byStatus["Active"] || 0
    if (active > 0) insights.push(`${active} active clients on the platform.`)
  }

  if (insights.length === 0) {
    return <EmptyState icon={faInfoCircle} title="No Insights" description="No analytical insights can be generated from the current data." />
  }

  return (
    <Card className="rounded-xl border border-border/40 bg-card shadow-sm">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center text-foreground text-lg tracking-tight">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4 text-primary" />
          </div>
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start group">
              <FontAwesomeIcon 
                icon={faChevronRight} 
                className="h-3 w-3 text-primary/40 mt-1.5 mr-3 shrink-0 group-hover:text-primary transition-colors" 
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
