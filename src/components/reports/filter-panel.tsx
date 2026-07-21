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
import { Download, FileText, Filter, RotateCcw } from "lucide-react"

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

  const handleExport = (type: string) => {
    toast({ title: "Export Started", description: `Successfully generated ${type} report! Download starting...` })
  }

  const handleApply = () => {
    if (onApply) {
      onApply({ dateRange, client, shipmentType, status, employee, country })
    }
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
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={(val) => setDateRange(val || "this-month")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range...</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={(val) => setClient(val || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="sunset">Sunset Imports Co.</SelectItem>
                <SelectItem value="global">Global Logistics Inc.</SelectItem>
                <SelectItem value="apex">Apex Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Shipment Type</Label>
            <Select value={shipmentType} onValueChange={(val) => setShipmentType(val || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="customs">Customs Clearance</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={employee} onValueChange={(val) => setEmployee(val || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="jane">Jane Doe</SelectItem>
                <SelectItem value="michael">Michael Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={(val) => setCountry(val || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="default" className="w-full sm:w-auto" onClick={handleApply}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => handleExport("PDF")} className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("Excel")} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
