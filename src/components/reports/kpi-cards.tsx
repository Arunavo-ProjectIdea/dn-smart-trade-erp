import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBox, faFileLines, faUpload, faArrowTrendUp, faArrowTrendDown, faCircleCheck, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { kpiData } from "@/lib/mock-data/reports"
import Link from "next/link"

export function KPICards() {
  const primaryCards = [
    {
      title: "Active Shipments",
      value: kpiData.activeShipments.value,
      change: kpiData.activeShipments.change,
      trend: kpiData.activeShipments.trend,
      icon: faBox,
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
      title: "Completed Shipments",
      value: kpiData.completedShipments.value,
      change: kpiData.completedShipments.change,
      trend: kpiData.completedShipments.trend,
      icon: faCircleCheck,
      href: "/shipments",
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

  const secondaryCards = [
    {
      title: "Total Clients",
      value: kpiData.totalClients.value,
      change: kpiData.totalClients.change,
      trend: kpiData.totalClients.trend,
      icon: faUsers,
      href: "/clients",
    },
    {
      title: "BOE Processed",
      value: kpiData.boeProcessed.value,
      change: kpiData.boeProcessed.change,
      trend: kpiData.boeProcessed.trend,
      icon: faFileLines,
      href: "/boe",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Primary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {primaryCards.map((card, index) => {
          const isUp = card.trend === "up"
          return (
            <Link key={index} href={card.href} className="block group">
              <Card className="h-full rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1 hover:border-primary/20 hover:bg-card">
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

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {secondaryCards.map((card, index) => {
          const isUp = card.trend === "up"
          return (
            <Link key={index} href={card.href} className="block group lg:col-span-1">
              <Card className="h-full rounded-xl border border-border/40 bg-muted/10 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {card.title}
                  </CardTitle>
                  <FontAwesomeIcon icon={card.icon} className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors duration-300" />
                </CardHeader>
                <CardContent className="p-4 pt-1 flex items-baseline justify-between">
                  <div className="text-xl font-semibold tracking-tight">{card.value}</div>
                  <p className={`text-[10px] flex items-center font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <FontAwesomeIcon icon={isUp ? faArrowTrendUp : faArrowTrendDown} className="h-2.5 w-2.5 mr-1" />
                    {card.change}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
