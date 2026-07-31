"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockShipments } from "@/lib/mock-data/reports"
import { StatusBadge } from "@/components/erp/status-badge"

import { FilterState } from "@/components/reports/filter-panel"

interface ReportTabsProps {
  filters?: FilterState | null
}

export function ReportTabs({ filters }: ReportTabsProps) {
  let filteredShipments = mockShipments

  if (filters) {
    // 1. Date Range Filter
    if (filters.dateRange !== "all" && filters.dateRange !== "custom") {
      const now = new Date()
      filteredShipments = filteredShipments.filter(s => {
        const d = new Date(s.date)
        if (filters.dateRange === "today") {
          return d.toDateString() === now.toDateString()
        }
        if (filters.dateRange === "this-week") {
          const startOfWeek = new Date(now)
          startOfWeek.setDate(now.getDate() - now.getDay())
          return d >= startOfWeek
        }
        if (filters.dateRange === "this-month") {
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }
        if (filters.dateRange === "this-year") {
          return d.getFullYear() === now.getFullYear()
        }
        return true
      })
    }

    // 2. Client Filter
    if (filters.client !== "all") {
      // client map based on mock data IDs: 
      // sunset -> C-1001, global -> C-1002, apex -> C-1003
      const clientMap: Record<string, string> = {
        "sunset": "C-1001",
        "global": "C-1002",
        "apex": "C-1003"
      }
      if (clientMap[filters.client]) {
        filteredShipments = filteredShipments.filter(s => s.clientId === clientMap[filters.client])
      }
    }

    // 3. Employee Filter
    if (filters.employee !== "all") {
      // employee map based on mock data IDs:
      // jane -> EMP-001, michael -> EMP-002
      const empMap: Record<string, string> = {
        "jane": "EMP-001",
        "michael": "EMP-002"
      }
      if (empMap[filters.employee]) {
        filteredShipments = filteredShipments.filter(s => s.employeeId === empMap[filters.employee])
      }
    }

    // 4. Shipment Type Filter
    if (filters.shipmentType !== "all") {
      filteredShipments = filteredShipments.filter(s => s.type.toLowerCase() === filters.shipmentType.toLowerCase())
    }
    
    // 5. Status Filter
    if (filters.status !== "all") {
      const statusMap: Record<string, string> = {
        "pending": "Pending",
        "in-transit": "In Transit",
        "customs": "Customs Clearance",
        "delivered": "Delivered",
        "delayed": "Delayed"
      }
      if (statusMap[filters.status]) {
        filteredShipments = filteredShipments.filter(s => s.status === statusMap[filters.status])
      }
    }
    
    // 6. Country Filter
    if (filters.country !== "all") {
      const countryMap: Record<string, string> = {
        "usa": "USA",
        "china": "China",
        "uk": "UK",
        "germany": "Germany",
        "uae": "UAE"
      }
      if (countryMap[filters.country]) {
        filteredShipments = filteredShipments.filter(s => 
          s.originCountry === countryMap[filters.country] || 
          s.destinationCountry === countryMap[filters.country]
        )
      }
    }
  }

  const recentShipments = filteredShipments.slice(0, 10)

  return (
    <Tabs defaultValue="operational" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="operational">Operational Reports</TabsTrigger>
        <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        <TabsTrigger value="performance">Performance Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="operational">
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>
              Detailed view of the most recent operational shipments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="py-4">Tracking No.</TableHead>
                    <TableHead className="py-4">Type</TableHead>
                    <TableHead className="py-4">Origin</TableHead>
                    <TableHead className="py-4">Destination</TableHead>
                    <TableHead className="py-4">BOE Number</TableHead>
                    <TableHead className="py-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentShipments.length > 0 ? (
                    recentShipments.map((shipment) => (
                      <TableRow key={shipment.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="font-medium py-4">{shipment.trackingNumber}</TableCell>
                        <TableCell className="py-4">{shipment.type}</TableCell>
                        <TableCell className="py-4">{shipment.originCountry}</TableCell>
                        <TableCell className="py-4">{shipment.destinationCountry}</TableCell>
                        <TableCell className="py-4">{shipment.boeNumber}</TableCell>
                        <TableCell className="py-4">
                          <StatusBadge status={shipment.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No shipments found matching the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="financial">
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>
              Revenue and outstanding payments overview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="py-4">Month</TableHead>
                    <TableHead className="py-4">Total Revenue</TableHead>
                    <TableHead className="py-4">Outstanding Payments</TableHead>
                    <TableHead className="py-4">Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { month: "January 2026", revenue: "$150,000", outstanding: "$15,000", status: "Good" },
                    { month: "February 2026", revenue: "$180,000", outstanding: "$22,000", status: "Warning" },
                    { month: "March 2026", revenue: "$120,000", outstanding: "$8,000", status: "Excellent" },
                    { month: "April 2026", revenue: "$200,000", outstanding: "$35,000", status: "Attention" },
                    { month: "May 2026", revenue: "$250,000", outstanding: "$12,000", status: "Excellent" },
                  ].map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium py-4">{row.month}</TableCell>
                      <TableCell className="py-4">{row.revenue}</TableCell>
                      <TableCell className="py-4">{row.outstanding}</TableCell>
                      <TableCell className="py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
                          row.status === "Excellent" || row.status === "Good" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" 
                            : row.status === "Warning" 
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance">
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Employee efficiency and processing times.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="py-4">Employee Name</TableHead>
                    <TableHead className="py-4">Efficiency Score</TableHead>
                    <TableHead className="py-4">Completion Rate</TableHead>
                    <TableHead className="py-4">Avg. Processing Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Jane Doe", efficiency: "98%", completion: "100%", time: "1.2 days" },
                    { name: "Michael Chen", efficiency: "92%", completion: "96%", time: "1.8 days" },
                    { name: "Sarah Johnson", efficiency: "88%", completion: "94%", time: "2.1 days" },
                    { name: "David Wilson", efficiency: "95%", completion: "98%", time: "1.5 days" },
                    { name: "Alex Mercer", efficiency: "85%", completion: "90%", time: "2.8 days" },
                  ].map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium py-4">{row.name}</TableCell>
                      <TableCell className="py-4 font-mono text-muted-foreground">{row.efficiency}</TableCell>
                      <TableCell className="py-4 font-mono text-muted-foreground">{row.completion}</TableCell>
                      <TableCell className="py-4 text-muted-foreground">{row.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
