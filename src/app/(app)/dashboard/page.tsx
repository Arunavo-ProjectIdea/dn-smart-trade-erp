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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{role} Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your enterprise logistics and trade operations.
          </p>
        </div>
      </div>
      
      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const cardContent = (
            <Card className="hover:shadow-md transition-all h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-xl">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center mt-1 text-sm">
                  <span className={`font-medium flex items-center ${stat.positive ? "text-success" : "text-destructive"}`}>
                    {stat.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {stat.trend}
                  </span>
                  <span className="text-muted-foreground ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
          
          return stat.link ? (
            <Link href={stat.link} key={i} className="block h-full">
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
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Import vs Export Analytics</CardTitle>
            <CardDescription>Volume analysis over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-card rounded-lg flex items-end justify-between px-4 pb-4 pt-10 border-b border-border gap-2">
              {[40, 60, 45, 80, 65, 90].map((height, i) => (
                <div key={i} className="w-full flex gap-1 h-full items-end justify-center group cursor-pointer relative">
                  <div 
                    className="w-1/2 bg-primary rounded-t-sm transition-all duration-300 group-hover:bg-primary/80" 
                    style={{ height: `${height}%` }}
                  />
                  <div 
                    className="w-1/2 bg-secondary rounded-t-sm transition-all duration-300 group-hover:bg-secondary/80" 
                    style={{ height: `${height * 0.7}%` }}
                  />
                  {/* Tooltip mock */}
                  <div className="absolute -top-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Vol: {height}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-muted-foreground px-4">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-primary rounded-full" />
                <span className="text-sm font-medium">Imports</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-secondary rounded-full" />
                <span className="text-sm font-medium">Exports</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events and operations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity, i) => {
                const content = (
                  <div className="flex items-start gap-4 group">
                    <div className="relative mt-1">
                      <div className={`h-3 w-3 rounded-full ${
                        activity.status === "success" ? "bg-success" : 
                        activity.status === "danger" ? "bg-destructive" : 
                        "bg-primary"
                      } ring-4 ring-background transition-transform group-hover:scale-125`} />
                      {i !== recentActivity.length - 1 && (
                        <div className="absolute top-3 left-1.5 h-full w-px bg-border -translate-x-1/2" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );

                return activity.link ? (
                  <Link href={activity.link} key={i} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={i}>
                    {content}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
