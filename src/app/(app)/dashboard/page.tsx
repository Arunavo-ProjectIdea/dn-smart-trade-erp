"use client"

import { useState } from "react"
import { 
  Package, 
  FileText, 
  FileCheck, 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react"

import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AuthService } from "@/lib/auth"
import { mockClients } from "@/lib/mock-data/clients"
import { mockBOEList } from "@/lib/mock-data/boe"
import { mockDocumentsList } from "@/lib/mock-data/document"
import { mockEmployees } from "@/lib/mock-data/employees"
import { mockShipmentsList } from "@/lib/mock-data/shipment"

export default function DashboardPage() {
  const [role] = useState(() => {
    const user = AuthService.getCurrentUser();
    return user ? user.role : "Admin";
  });

  const stats = [
    { name: "Active Shipments", link: "/shipments?status=In Transit", value: mockShipmentsList.filter(s => s.status !== "Completed" && s.status !== "Delivered" && s.status !== "Cancelled").length.toString(), icon: Package, trend: "+12.5%", positive: true },
    { name: "Total BOE", link: "/boe", value: mockBOEList.length.toString(), icon: FileText, trend: "-2.4%", positive: false },
    { name: "Total Documents", link: "/documents", value: mockDocumentsList.length.toString(), icon: FileCheck, trend: "+5.2%", positive: true },
    { name: "Total Clients", link: "/clients", value: mockClients.length.toString(), icon: Users, trend: "+18.1%", positive: true },
    { name: "Active Employees", link: "/employees?status=Active", value: mockEmployees.filter(e => e.status === "Active").length.toString(), icon: Briefcase, trend: "0%", positive: true },
    { name: "Monthly Revenue", link: "/reports", value: "$142,500", icon: DollarSign, trend: "+24.5%", positive: true },
  ]

  const recentActivity = [
    { action: "Shipment #SHP-8472 cleared customs", time: "10 mins ago", status: "success", link: "/shipments/SHP-8472" },
    { action: "New client 'Global Logistics Inc.' onboarded", time: "1 hour ago", status: "info", link: "/clients/CL-1001" },
    { action: "BOE #BOE-2026-001 rejected due to missing docs", time: "3 hours ago", status: "danger", link: "/boe/boe-1" },
    { action: "Invoice #INV-2041 paid by 'Global Logistics Inc.'", time: "5 hours ago", status: "success", link: "/documents/doc-1" },
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{role} Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Overview of your enterprise logistics and trade operations.
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
                  <stat.icon className="size-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold text-foreground tracking-tight">{stat.value}</div>
                <div className="flex items-center mt-3 text-sm">
                  <span className={`font-semibold flex items-center px-2 py-1 rounded-md ${stat.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {stat.positive ? <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> : <TrendingDown className="h-3.5 w-3.5 mr-1.5" />}
                    {stat.trend}
                  </span>
                  <span className="text-muted-foreground ml-3 font-medium">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
          
          return stat.link ? (
            <Link href={stat.link} key={i} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[14px]">
              {cardContent}
            </Link>
          ) : (
            <div key={i} className="h-full">
              {cardContent}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Import vs Export Analytics Mock */}
        <Card className="col-span-1 lg:col-span-4 flex flex-col hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Volume Analytics</CardTitle>
            <CardDescription>Import vs Export distribution over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="h-[280px] w-full flex items-end justify-between px-2 pb-2 pt-10 border-b border-border gap-4 mt-auto">
              {[40, 60, 45, 80, 65, 90].map((height, i) => (
                <div key={i} className="w-full flex gap-1.5 h-full items-end justify-center group cursor-pointer relative">
                  <div 
                    className="w-1/2 bg-primary rounded-t-md transition-all duration-300 hover:brightness-110" 
                    style={{ height: `${height}%` }}
                  />
                  <div 
                    className="w-1/2 bg-secondary rounded-t-md transition-all duration-300 hover:brightness-110" 
                    style={{ height: `${height * 0.7}%` }}
                  />
                  {/* Tooltip mock */}
                  <div className="absolute -top-10 bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-md shadow-xl border border-border opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20">
                    Vol: {height}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm font-medium text-muted-foreground px-4">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="size-3.5 bg-primary rounded-[4px] shadow-sm" />
                <span className="text-sm font-semibold text-foreground">Imports</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3.5 bg-secondary rounded-[4px] shadow-sm" />
                <span className="text-sm font-semibold text-foreground">Exports</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-3 flex flex-col hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events and operations.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-8 mt-4">
              {recentActivity.map((activity, i) => {
                const content = (
                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="relative mt-1">
                      <div className={`size-3.5 rounded-full ${
                        activity.status === "success" ? "bg-success" : 
                        activity.status === "danger" ? "bg-destructive" : 
                        "bg-primary"
                      } ring-4 ring-background transition-transform duration-300 group-hover:scale-125 z-10 relative`} />
                      {i !== recentActivity.length - 1 && (
                        <div className="absolute top-4 left-1/2 h-12 w-[2px] bg-border/60 -translate-x-1/2" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{activity.action}</p>
                      <p className="text-xs font-medium text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );

                return activity.link ? (
                  <Link href={activity.link} key={i} className="block outline-none rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {content}
                  </Link>
                ) : (
                  <div key={i}>
                    {content}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8">
              <Link href="/notifications" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center w-full py-2 bg-primary/5 rounded-lg hover:bg-primary/10">
                View All Activity
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
