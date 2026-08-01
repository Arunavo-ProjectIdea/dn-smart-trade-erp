"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"
import type { MonthlyTrend } from "@/actions/report.actions"
import { EmptyState } from "@/components/ui/empty-state"
import { faChartLine } from "@fortawesome/free-solid-svg-icons"

interface ChartsSectionProps {
  trends?: MonthlyTrend[]
  userRole?: string
}

export function ChartsSection({ trends, userRole }: ChartsSectionProps) {
  if (!trends || trends.length === 0) {
    return <EmptyState icon={faChartLine} title="No Trend Data" description="No monthly trend data is available yet." />
  }

  // Check if there is any data > 0
  const hasData = trends.some(t => t.shipments > 0 || t.documents > 0 || t.clients > 0)
  if (!hasData) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState icon={faChartLine} title="No Activity" description="There has been no activity in the past 12 months." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Platform Trends</CardTitle>
          <CardDescription>Activity volume over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" name="Shipments" dataKey="shipments" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Documents" dataKey="documents" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                {userRole !== "Client" && (
                  <Line type="monotone" name="New Clients" dataKey="clients" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
