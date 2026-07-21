import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBox, faFileLines, faUpload, faArrowTrendUp, faArrowTrendDown, faCircleCheck, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { kpiData } from "@/lib/mock-data/reports"
import Link from "next/link"

export function KPICards() {
  const cards = [
    {
      title: "Total Clients",
      value: kpiData.totalClients.value,
      change: kpiData.totalClients.change,
      trend: kpiData.totalClients.trend,
      icon: faUsers,
      href: "/clients",
    },
    {
      title: "Active Shipments",
      value: kpiData.activeShipments.value,
      change: kpiData.activeShipments.change,
      trend: kpiData.activeShipments.trend,
      icon: faBox,
      href: "/shipments",
    },
    {
      title: "Completed Shipments",
      value: kpiData.completedShipments.value,
      change: kpiData.completedShipments.change,
      trend: kpiData.completedShipments.trend,
      icon: faCircleCheck,
      href: "/shipments",
    },
    {
      title: "Revenue Generated",
      value: kpiData.revenueGenerated.value,
      change: kpiData.revenueGenerated.change,
      trend: kpiData.revenueGenerated.trend,
      icon: faDollarSign,
      href: "/reports",
    },
    {
      title: "BOE Processed",
      value: kpiData.boeProcessed.value,
      change: kpiData.boeProcessed.change,
      trend: kpiData.boeProcessed.trend,
      icon: faFileLines,
      href: "/boe",
    },
    {
      title: "Documents Uploaded",
      value: kpiData.documentsUploaded.value,
      change: kpiData.documentsUploaded.change,
      trend: kpiData.documentsUploaded.trend,
      icon: faUpload,
      href: "/documents",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const isUp = card.trend === "up"
        
        return (
          <Link key={index} href={card.href} className="block group">
            <Card className="h-full rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-primary/20 hover:bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {card.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <FontAwesomeIcon icon={card.icon} className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight mt-1">{card.value}</div>
                <p className={`text-xs flex items-center mt-3 font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  <FontAwesomeIcon icon={isUp ? faArrowTrendUp : faArrowTrendDown} className="h-3 w-3 mr-1.5" />
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
