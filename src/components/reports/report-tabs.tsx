"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockShipments } from "@/lib/mock-data/reports"
import { StatusBadge } from "@/components/erp/status-badge"
import { FilterState } from "@/components/reports/filter-panel"
import { Layers, DollarSign, TrendingUp, Package, ArrowUpRight, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"

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
    <Tabs defaultValue="operational" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-3 p-1.5 bg-muted/60 rounded-2xl h-auto gap-1 border border-border/60">
        <TabsTrigger 
          value="operational"
          className="rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
        >
          <Layers className="size-4" />
          <span className="hidden sm:inline">Operational Reports</span>
          <span className="sm:hidden">Operational</span>
        </TabsTrigger>
        <TabsTrigger 
          value="financial"
          className="rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
        >
          <DollarSign className="size-4" />
          <span className="hidden sm:inline">Financial Reports</span>
          <span className="sm:hidden">Financial</span>
        </TabsTrigger>
        <TabsTrigger 
          value="performance"
          className="rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
        >
          <TrendingUp className="size-4" />
          <span className="hidden sm:inline">Performance Reports</span>
          <span className="sm:hidden">Performance</span>
        </TabsTrigger>
      </TabsList>
      
      {/* 1. Operational Reports */}
      <TabsContent value="operational">
        <Card className="border border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
          <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Package className="size-4 text-primary" />
                  Recent Operational Shipments
                </CardTitle>
                <CardDescription className="text-xs">
                  Detailed view of operational log movements ({filteredShipments.length} matching total)
                </CardDescription>
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/80 self-start sm:self-auto">
                Showing top 10 records
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tracking No.</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Origin</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">BOE Number</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentShipments.length > 0 ? (
                    recentShipments.map((shipment) => (
                      <TableRow key={shipment.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold text-xs">
                          <Link 
                            href={`/shipments`} 
                            className="inline-flex items-center gap-1 text-primary hover:underline group"
                          >
                            {shipment.trackingNumber}
                            <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                            shipment.type === "Import"
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                              : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                          }`}>
                            {shipment.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">{shipment.originCountry}</TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">{shipment.destinationCountry}</TableCell>
                        <TableCell className="text-xs font-mono font-medium">{shipment.boeNumber}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <StatusBadge status={shipment.status} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-28 text-center text-muted-foreground text-xs">
                        No operational shipments match the active parameters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 2. Financial Reports */}
      <TabsContent value="financial" className="space-y-4">
        {/* Financial Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Period Revenue</span>
            <div className="text-2xl font-bold tracking-tight text-foreground">$900,000</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              +14.2% trajectory
            </span>
          </div>
          <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Outstanding</span>
            <div className="text-2xl font-bold tracking-tight text-foreground">$92,000</div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
              Requires clearance
            </span>
          </div>
          <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">On-Time Collection Rate</span>
            <div className="text-2xl font-bold tracking-tight text-foreground">90.8%</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              Above target benchmark
            </span>
          </div>
        </div>

        <Card className="border border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
          <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-500" />
              Monthly Financial Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Revenue and outstanding receivable audit overview
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Month</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Revenue</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Outstanding Payments</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Payment Status</TableHead>
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
                    <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-xs text-foreground">{row.month}</TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{row.revenue}</TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{row.outstanding}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          row.status === "Excellent" || row.status === "Good" 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                            : row.status === "Warning" 
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
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

      {/* 3. Performance Reports */}
      <TabsContent value="performance">
        <Card className="border border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
          <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-purple-500" />
              Employee Productivity & Processing Efficiency
            </CardTitle>
            <CardDescription className="text-xs">
              Staff throughput rating and clearance velocity metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee Name</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Efficiency Score</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completion Rate</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Avg. Processing Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Jane Doe", efficiency: 98, completion: 100, time: "1.2 days" },
                    { name: "Michael Chen", efficiency: 92, completion: 96, time: "1.8 days" },
                    { name: "Sarah Johnson", efficiency: 88, completion: 94, time: "2.1 days" },
                    { name: "David Wilson", efficiency: 95, completion: 98, time: "1.5 days" },
                    { name: "Alex Mercer", efficiency: 85, completion: 90, time: "2.8 days" },
                  ].map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-xs text-foreground">{row.name}</TableCell>
                      
                      {/* Efficiency Progress Bar */}
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2.5 min-w-[130px]">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500" 
                              style={{ width: `${row.efficiency}%` }} 
                            />
                          </div>
                          <span className="font-semibold text-foreground text-xs w-8 text-right">{row.efficiency}%</span>
                        </div>
                      </TableCell>

                      {/* Completion Progress Bar */}
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2.5 min-w-[130px]">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                              style={{ width: `${row.completion}%` }} 
                            />
                          </div>
                          <span className="font-semibold text-foreground text-xs w-8 text-right">{row.completion}%</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-foreground border border-border/60">
                          <Clock className="size-3 text-muted-foreground" />
                          {row.time}
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
    </Tabs>
  )
}
