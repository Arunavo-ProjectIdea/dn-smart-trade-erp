import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBox, faFileLines, faUsers, faBriefcase, faArrowTrendUp, faArrowTrendDown, faChartLine, faTruck, faFile, faCalendarDay, faSearch } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { getUserProfile } from "@/actions/auth.actions"
import { getDashboardStats, getRecentActivities, getRecentDocuments, getRecentShipments } from "@/actions/dashboard.actions"
import { StatusBadge } from "@/components/erp/status-badge"

function EmptyState({ title, description, icon }: { title: string, description: string, icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
      <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <FontAwesomeIcon icon={icon} className="size-5 text-muted-foreground" />
      </div>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">{description}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const profileRes = await getUserProfile()
  const role = profileRes.data?.role || "Client"

  const [statsRes, activitiesRes, docsRes, shipsRes] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(),
    getRecentDocuments(),
    getRecentShipments()
  ])

  const s = statsRes.data || {
    totalClients: 0,
    totalShipments: 0,
    totalDocuments: 0,
    totalBOE: 0,
    activeEmployees: 0,
    pendingDocuments: 0,
    pendingShipments: 0,
    activeShipments: 0,
    last30DaysClients: 0,
    last30DaysShipments: 0,
    last30DaysDocuments: 0,
  }

  const recentActivities = activitiesRes.data || []
  const recentDocuments = docsRes.data || []
  const recentShipments = shipsRes.data || []

  const adminStats = [
    { name: "Active Shipments", link: "/shipments", value: s.activeShipments.toString(), icon: faTruck, trend: `+${s.last30DaysShipments}`, positive: true },
    { name: "Total BOE", link: "/boe", value: s.totalBOE.toString(), icon: faFileLines, trend: null, positive: false },
    { name: "Total Documents", link: "/documents", value: s.totalDocuments.toString(), icon: faFileLines, trend: `+${s.last30DaysDocuments}`, positive: true },
    { name: "Total Clients", link: "/clients", value: s.totalClients.toString(), icon: faUsers, trend: `+${s.last30DaysClients}`, positive: true },
    { name: "Active Employees", link: "/employees", value: s.activeEmployees.toString(), icon: faBriefcase, trend: null, positive: true },
    { name: "Pending Shipments", link: "/shipments", value: s.pendingShipments.toString(), icon: faBox, trend: null, positive: true },
  ]

  const employeeStats = [
    { name: "Active Shipments", link: "/shipments", value: s.activeShipments.toString(), icon: faTruck, trend: `+${s.last30DaysShipments}`, positive: true },
    { name: "Total BOE", link: "/boe", value: s.totalBOE.toString(), icon: faFileLines, trend: null, positive: false },
    { name: "Total Documents", link: "/documents", value: s.totalDocuments.toString(), icon: faFileLines, trend: `+${s.last30DaysDocuments}`, positive: true },
    { name: "Total Clients", link: "/clients", value: s.totalClients.toString(), icon: faUsers, trend: `+${s.last30DaysClients}`, positive: true },
  ]

  const clientStats = [
    { name: "My Active Shipments", link: "/shipments", value: s.activeShipments.toString(), icon: faTruck, trend: `+${s.last30DaysShipments}`, positive: true },
    { name: "My Total Shipments", link: "/shipments", value: s.totalShipments.toString(), icon: faTruck, trend: null, positive: true },
    { name: "My Documents", link: "/documents", value: s.totalDocuments.toString(), icon: faFileLines, trend: `+${s.last30DaysDocuments}`, positive: true },
  ]

  const stats = role === "Admin" ? adminStats : role === "Employee" ? employeeStats : clientStats

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {role === "Client" ? "My Trade Dashboard" : `${role} Dashboard`}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {role === "Client"
              ? "Track your shipments, documents, and trade activity."
              : "Overview of your enterprise logistics and trade operations."
            }
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const cardContent = (
            <Card className="hover:shadow-md transition-shadow duration-300 h-full group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.name}
                </CardTitle>
                <div className="size-12 bg-primary/10 flex items-center justify-center rounded-[10px] group-hover:bg-primary/20 transition-colors">
                  <FontAwesomeIcon icon={stat.icon} className="size-5 text-primary" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold text-foreground tracking-tight">{stat.value}</div>
                {stat.trend && (
                  <div className="flex items-center mt-3 text-sm">
                    <span className={`font-semibold flex items-center px-2 py-1 rounded-md ${stat.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {stat.positive
                        ? <FontAwesomeIcon icon={faArrowTrendUp} className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                        : <FontAwesomeIcon icon={faArrowTrendDown} className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                      }
                      {stat.trend}
                    </span>
                    <span className="text-muted-foreground ml-3 font-medium">in last 30 days</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )

          return stat.link ? (
            <Link href={stat.link} key={i} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[14px]">
              {cardContent}
            </Link>
          ) : (
            <div key={i} className="h-full">
              {cardContent}
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          
          {/* Recent Shipments */}
          <Card className="flex flex-col hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} className="size-4 text-primary" />
                  Recent Shipments
                </CardTitle>
                <Link href="/shipments" className="text-xs text-primary font-medium hover:underline">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentShipments.length === 0 ? (
                <EmptyState icon={faSearch} title="No shipments found" description="You have no recent shipments. They will appear here when created." />
              ) : (
                <div className="divide-y">
                  {recentShipments.map(ship => (
                    <div key={ship.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Link href={`/shipments/${ship.id}`} className="font-semibold text-sm hover:text-primary transition-colors">
                          {ship.shipment_number}
                        </Link>
                        {role !== "Client" && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faUsers} className="size-3" />
                            {Array.isArray(ship.clients) ? ship.clients[0]?.company_name : (ship.clients as any)?.company_name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faCalendarDay} className="size-3" />
                          Updated: {new Date(ship.updated_at || "").toLocaleDateString()}
                        </span>
                      </div>
                      <StatusBadge status={ship.status || ""} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed (Moved to Left Column) */}
          <Card className="flex flex-col hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="size-5 text-primary" aria-hidden="true" />
                Activity Feed
              </CardTitle>
              <CardDescription>
                {role === "Client" ? "Your latest shipment and document events." : "Latest system events and operations."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {recentActivities.length === 0 ? (
                <EmptyState icon={faChartLine} title="No recent activity" description="There has been no recent activity in your account." />
              ) : (
                <div className="space-y-8 mt-4">
                  {recentActivities.map((activity, i) => {
                    const content = (
                      <div className="flex items-start gap-4 group cursor-default">
                        <div className="relative mt-1">
                          <div className={`size-3.5 rounded-full ${
                            activity.type === "document" ? "bg-blue-500" :
                            activity.type === "shipment" ? "bg-amber-500" :
                            "bg-primary"
                          } ring-4 ring-background z-10 relative`} aria-hidden="true" />
                          {i !== recentActivities.length - 1 && (
                            <div className="absolute top-4 left-1/2 h-full w-[2px] bg-border/60 -translate-x-1/2" aria-hidden="true" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 pb-4 border-b border-border/40 w-full">
                          <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <div className="flex items-center justify-between mt-1">
                             <p className="text-[10px] font-medium text-primary/70">{activity.actor}</p>
                             <p className="text-[10px] font-medium text-muted-foreground">
                               {new Date(activity.timestamp).toLocaleString(undefined, {
                                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                               })}
                             </p>
                          </div>
                        </div>
                      </div>
                    )
                    return <div key={activity.id}>{content}</div>
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          
          {/* Recent Documents (Moved to Right Column) */}
          <Card className="flex flex-col hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faFileLines} className="size-4 text-primary" />
                  Recent Documents
                </CardTitle>
                <Link href="/documents" className="text-xs text-primary font-medium hover:underline">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentDocuments.length === 0 ? (
                <EmptyState icon={faFile} title="No documents found" description="You have no recent documents. Upload one to get started." />
              ) : (
                <div className="divide-y">
                  {recentDocuments.map(doc => {
                    const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date();
                    return (
                      <div key={doc.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <Link href={`/documents/${doc.id}`} className="font-semibold text-sm hover:text-primary transition-colors flex items-center gap-2">
                            {doc.name}
                            {isExpired && <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/10 text-destructive font-bold uppercase">Expired</span>}
                          </Link>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faUsers} className="size-3" />
                            By: {Array.isArray(doc.profiles) ? doc.profiles[0]?.full_name : (doc.profiles as any)?.full_name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faCalendarDay} className="size-3" />
                            {new Date(doc.upload_date || "").toLocaleDateString()}
                          </span>
                        </div>
                        <StatusBadge status={doc.status || ""} />
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
