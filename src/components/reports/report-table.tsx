"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/erp/status-badge"
import { FilterState } from "@/components/reports/filter-panel"
import type { ReportTableRow } from "@/actions/report.actions"
import { EmptyState } from "@/components/ui/empty-state"
import { faTableList } from "@fortawesome/free-solid-svg-icons"

interface ReportTableProps {
  filters?: FilterState | null
  tableRows?: ReportTableRow[]
  userRole?: string
}

export function ReportTable({ filters, tableRows, userRole }: ReportTableProps) {
  if (!tableRows || tableRows.length === 0) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity Report</CardTitle>
          <CardDescription>
            Detailed view of recent system activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState icon={faTableList} title="No Data Found" description="There are no recent activities to display." />
        </CardContent>
      </Card>
    )
  }

  // Simple client-side filtering placeholder if we need it
  let filteredRows = tableRows
  if (filters?.status && filters.status !== "all") {
    const s = filters.status.toLowerCase().replace("-", " ")
    filteredRows = filteredRows.filter(r => r.status.toLowerCase() === s)
  }

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity Report</CardTitle>
        <CardDescription>
          Detailed view of recent system activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="py-4">Date</TableHead>
                <TableHead className="py-4">Entity Type</TableHead>
                <TableHead className="py-4">Entity Name</TableHead>
                <TableHead className="py-4">User/Client</TableHead>
                <TableHead className="py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium py-4">
                      {new Date(row.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4">{row.entityType}</TableCell>
                    <TableCell className="py-4">{row.entityName}</TableCell>
                    <TableCell className="py-4">{row.user}</TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={row.status as any} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No records found matching the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
