import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBox, faFileLines, faUpload, faArrowTrendUp, faArrowTrendDown, faCircleCheck, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link"
import type { ReportKPIs } from "@/actions/report.actions"
import { EmptyState } from "@/components/ui/empty-state"

interface KPICardsProps {
  data?: ReportKPIs
  userRole?: string
}

export function KPICards({ data, userRole }: KPICardsProps) {
  if (!data) return <EmptyState icon={faBox} title="No Data Available" description="No KPI metrics to display." />

  const primaryCards = [
    {
      title: "Active Shipments",
      value: data.activeShipments.toString(),
      icon: faBox,
      href: "/shipments",
    },
    {
      title: "Completed Shipments",
      value: data.completedShipments.toString(),
      icon: faCircleCheck,
      href: "/shipments",
    },
    {
      title: "Documents Uploaded",
      value: data.totalDocuments.toString(),
      icon: faUpload,
      href: "/documents",
    },
  ]

  const secondaryCards = [
    {
      title: "Total Clients",
      value: data.totalClients.toString(),
      icon: faUsers,
      href: "/clients",
      hideForClient: true
    },
    {
      title: "BOE Processed",
      value: data.totalBOE.toString(),
      icon: faFileLines,
      href: "/boe",
      hideForClient: true
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Primary KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        {primaryCards.map((card, index) => {
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
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Secondary KPIs */}
      {userRole !== "Client" && (
        <div className="grid gap-4 md:grid-cols-2">
          {secondaryCards.map((card, index) => {
            if (card.hideForClient && userRole === "Client") return null
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
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
