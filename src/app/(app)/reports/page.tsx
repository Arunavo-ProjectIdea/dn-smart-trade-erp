import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Generate and view comprehensive business intelligence reports.
          </p>
        </div>
        <Button>
          <BarChart3 className="mr-2 h-4 w-4" /> Generate New Report
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Monthly Revenue", desc: "Financial performance across all regions." },
          { title: "Shipment Volume", desc: "Total shipments categorized by logistics routes." },
          { title: "Customs Clearance Time", desc: "Average time taken for BOE clearance." },
          { title: "Client Activity", desc: "Order volumes and activity per client account." },
          { title: "Duty & Tax Summaries", desc: "Aggregate tax liabilities and payments." },
          { title: "Inventory Turnover", desc: "Warehouse stock levels and movement speeds." },
        ].map((report, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">{report.title}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{report.desc}</CardDescription>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
