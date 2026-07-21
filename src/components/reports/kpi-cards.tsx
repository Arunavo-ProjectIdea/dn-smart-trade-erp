import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, CheckCircle, DollarSign, FileText, Upload, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
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
      subtitle: "Active partner accounts",
    },
    {
      title: "Active Shipments",
      value: kpiData.activeShipments.value,
      change: kpiData.activeShipments.change,
      trend: kpiData.activeShipments.trend,
      icon: Package,
      href: "/shipments",
      subtitle: "In-transit & processing",
    },
    {
      title: "Completed Shipments",
      value: kpiData.completedShipments.value,
      change: kpiData.completedShipments.change,
      trend: kpiData.completedShipments.trend,
      icon: CheckCircle,
      href: "/shipments",
      subtitle: "Successfully delivered",
    },
    {
      title: "Revenue Generated",
      value: kpiData.revenueGenerated.value,
      change: kpiData.revenueGenerated.change,
      trend: kpiData.revenueGenerated.trend,
      icon: DollarSign,
      href: "/reports",
      subtitle: "Current billing period",
    },
    {
      title: "BOE Processed",
      value: kpiData.boeProcessed.value,
      change: kpiData.boeProcessed.change,
      trend: kpiData.boeProcessed.trend,
      icon: FileText,
      href: "/boe",
      subtitle: "Bill of Entry filings",
    },
    {
      title: "Documents Uploaded",
      value: kpiData.documentsUploaded.value,
      change: kpiData.documentsUploaded.change,
      trend: kpiData.documentsUploaded.trend,
      icon: Upload,
      href: "/documents",
      subtitle: "Verified trade docs",
    },
  ]

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isUp = card.trend === "up"

        return (
          <Link key={index} href={card.href} className="block group focus:outline-none">
            <Card className="h-full relative overflow-hidden border border-border/80 bg-card hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xs">
                  <Icon className="size-5 transition-transform group-hover:scale-110" />
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300" />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border ${
                        isUp
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {isUp ? (
                        <TrendingUp className="size-3.5 stroke-[2.5]" />
                      ) : (
                        <TrendingDown className="size-3.5 stroke-[2.5]" />
                      )}
                      {card.change}
                    </span>
                    <span className="text-muted-foreground font-medium">vs last month</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground/80 font-normal hidden xl:inline">
                    {card.subtitle}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
