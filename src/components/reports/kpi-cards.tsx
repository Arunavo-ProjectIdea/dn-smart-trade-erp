import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, CheckCircle, DollarSign, FileText, Upload, TrendingUp, TrendingDown } from "lucide-react"
import { kpiData } from "@/lib/mock-data/reports"
import Link from "next/link"

export function KPICards() {
  const cards = [
    {
      title: "Total Clients",
      value: kpiData.totalClients.value,
      change: kpiData.totalClients.change,
      trend: kpiData.totalClients.trend,
      icon: Users,
      href: "/clients",
    },
    {
      title: "Active Shipments",
      value: kpiData.activeShipments.value,
      change: kpiData.activeShipments.change,
      trend: kpiData.activeShipments.trend,
      icon: Package,
      href: "/shipments",
    },
    {
      title: "Completed Shipments",
      value: kpiData.completedShipments.value,
      change: kpiData.completedShipments.change,
      trend: kpiData.completedShipments.trend,
      icon: CheckCircle,
      href: "/shipments",
    },
    {
      title: "Revenue Generated",
      value: kpiData.revenueGenerated.value,
      change: kpiData.revenueGenerated.change,
      trend: kpiData.revenueGenerated.trend,
      icon: DollarSign,
      href: "/reports",
    },
    {
      title: "BOE Processed",
      value: kpiData.boeProcessed.value,
      change: kpiData.boeProcessed.change,
      trend: kpiData.boeProcessed.trend,
      icon: FileText,
      href: "/boe",
    },
    {
      title: "Documents Uploaded",
      value: kpiData.documentsUploaded.value,
      change: kpiData.documentsUploaded.change,
      trend: kpiData.documentsUploaded.trend,
      icon: Upload,
      href: "/documents",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isUp = card.trend === "up"
        
        return (
          <Link key={index} href={card.href} className="block transition-transform hover:scale-[1.02]">
            <Card className="h-full rounded-xl border-border/60 shadow-sm hover:border-primary/50 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className={`text-xs flex items-center mt-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {card.change} from last month
                </p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
