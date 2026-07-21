"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Download, 
  FileText, 
  Filter, 
  RotateCcw, 
  Calendar, 
  Building2, 
  Package, 
  Activity, 
  User, 
  Globe,
  FileSpreadsheet,
  Check
} from "lucide-react"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface FilterState {
  dateRange: string
  client: string
  shipmentType: string
  status: string
  employee: string
  country: string
}

interface FilterPanelProps {
  onApply?: (filters: FilterState) => void
}

export function FilterPanel({ onApply }: FilterPanelProps) {
  const { toast } = useToast()
  
  // Filter states
  const [dateRange, setDateRange] = useState("this-month")
  const [client, setClient] = useState("all")
  const [shipmentType, setShipmentType] = useState("all")
  const [status, setStatus] = useState("all")
  const [employee, setEmployee] = useState("all")
  const [country, setCountry] = useState("all")

  // Calculate active filter count
  const activeCount = [
    dateRange !== "this-month",
    client !== "all",
    shipmentType !== "all",
    status !== "all",
    employee !== "all",
    country !== "all"
  ].filter(Boolean).length

  const handleExport = (type: string) => {
    toast({ 
      title: `${type} Export Initiated`, 
      description: `Report summary generated. Your ${type} file download is starting...` 
    })
  }

  const handleApply = () => {
    if (onApply) {
      onApply({ dateRange, client, shipmentType, status, employee, country })
    }
    toast({
      title: "Filters Applied",
      description: "Report dataset updated based on selected criteria.",
    })
  }

  const handleReset = () => {
    setDateRange("this-month")
    setClient("all")
    setShipmentType("all")
    setStatus("all")
    setEmployee("all")
    setCountry("all")
    if (onApply) {
      onApply({ 
        dateRange: "this-month", 
        client: "all", 
        shipmentType: "all", 
        status: "all", 
        employee: "all", 
        country: "all" 
      })
    }
  }

  return (
    <Card className="border border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
      <CardContent className="p-5 space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Filter className="size-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                Report Filters & Parameters
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                    {activeCount} active
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                Refine parameters to analyze specific operational & financial cohorts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium shadow-xs"
            >
              <Check className="mr-1.5 size-4 stroke-[2.5]" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="rounded-xl border-border/80 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-1.5 size-3.5" />
              Reset
            </Button>
          </div>
        </div>

        {/* Filter Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Date Range */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              Date Range
            </Label>
            <Select value={dateRange} onValueChange={(val) => setDateRange(val || "this-month")}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs font-medium focus:ring-primary/20">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Client */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary" />
              Client
            </Label>
            <Select value={client} onValueChange={(val) => setClient(val || "all")}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs font-medium focus:ring-primary/20">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="sunset">Sunset Imports Co.</SelectItem>
                <SelectItem value="global">Global Logistics Inc.</SelectItem>
                <SelectItem value="apex">Apex Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shipment Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Package className="size-3.5 text-primary" />
              Shipment Type
            </Label>
            <Select value={shipmentType} onValueChange={(val) => setShipmentType(val || "all")}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs font-medium focus:ring-primary/20">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Activity className="size-3.5 text-primary" />
              Status
            </Label>
            <Select value={status} onValueChange={(val) => setStatus(val || "all")}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs font-medium focus:ring-primary/20">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="customs">Customs Clearance</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employee */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              Employee
            </Label>
            <Select value={employee} onValueChange={(val) => setEmployee(val || "all")}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs font-medium focus:ring-primary/20">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="jane">Jane Doe</SelectItem>
                <SelectItem value="michael">Michael Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Globe className="size-3.5 text-primary" />
              Country
            </Label>
            <Select value={country} onValueChange={(val) => setCountry(val || "all")}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background/50 text-xs font-medium focus:ring-primary/20">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="china">China</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="uae">UAE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Export Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/40">
          <span className="text-xs text-muted-foreground font-medium">
            Export dataset with applied filters:
          </span>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport("PDF")} 
              className="flex-1 sm:flex-none rounded-xl border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors text-xs font-medium"
            >
              <FileText className="mr-1.5 size-3.5 text-rose-500" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport("Excel")} 
              className="flex-1 sm:flex-none rounded-xl border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors text-xs font-medium"
            >
              <FileSpreadsheet className="mr-1.5 size-3.5 text-emerald-500" />
              Export Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport("CSV")} 
              className="flex-1 sm:flex-none rounded-xl border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors text-xs font-medium"
            >
              <Download className="mr-1.5 size-3.5 text-sky-500" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
