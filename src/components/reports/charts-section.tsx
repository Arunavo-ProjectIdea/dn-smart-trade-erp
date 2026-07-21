"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  PieChart as RechartsPie, Pie, Cell, 
  LineChart, Line, 
  BarChart, Bar, 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"
import { 
  shipmentStatusData, 
  monthlyShipmentData, 
  importExportData, 
  topClientsData, 
  revenueData 
} from "@/lib/mock-data/reports"
import { PieChart as PieIcon, TrendingUp, BarChart3, Users, DollarSign, Activity } from "lucide-react"

// Design System Palette
const CHART_COLORS = [
  "#FE7F2D", // Primary Brand Accent
  "#10B981", // Success / Emerald
  "#F59E0B", // Warning / Amber
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#EF4444", // Destructive / Rose
]

// Custom Frosted Glass Tooltip Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-md text-popover-foreground border border-border/80 shadow-xl rounded-xl p-3 text-xs space-y-1 z-50">
        <p className="font-semibold text-foreground border-b border-border/40 pb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2 font-medium">
            <span
              className="size-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color || item.fill }}
            />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="text-foreground font-bold">
              {prefix}
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ChartsSection() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* 1. Shipment Status Distribution */}
      <Card className="col-span-1 border border-border/80 shadow-xs hover:border-primary/40 transition-colors rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <PieIcon className="size-4 text-primary" />
              Shipment Status Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Live ratio across operational stages
            </CardDescription>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            Realtime
          </span>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={shipmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {shipmentStatusData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      className="transition-all duration-300 hover:opacity-80 stroke-background stroke-2"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip suffix=" shipments" />} />
                <Legend 
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => <span className="text-xs text-muted-foreground font-medium">{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Monthly Shipment Trend */}
      <Card className="col-span-1 border border-border/80 shadow-xs hover:border-primary/40 transition-colors rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" />
              Monthly Shipment Trend
            </CardTitle>
            <CardDescription className="text-xs">
              12-month volume progression
            </CardDescription>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            +18.4% YoY
          </span>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyShipmentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FE7F2D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FE7F2D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip suffix=" shipments" />} />
                <Line 
                  type="monotone" 
                  dataKey="shipments" 
                  name="Shipments"
                  stroke="#FE7F2D" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#FE7F2D", strokeWidth: 2, stroke: "#ffffff" }} 
                  activeDot={{ r: 7, fill: "#FE7F2D", stroke: "#ffffff", strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Import vs Export Analysis */}
      <Card className="col-span-1 border border-border/80 shadow-xs hover:border-primary/40 transition-colors rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="size-4 text-indigo-500" />
              Import vs Export Analysis
            </CardTitle>
            <CardDescription className="text-xs">
              Comparative trade category breakdown
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importExportData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip suffix=" shipments" />} />
                <Legend 
                  wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => <span className="text-xs text-muted-foreground font-medium">{value}</span>}
                />
                <Bar dataKey="Import" fill="#FE7F2D" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="Export" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 4. Top Clients by Shipment Volume */}
      <Card className="col-span-1 border border-border/80 shadow-xs hover:border-primary/40 transition-colors rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Users className="size-4 text-amber-500" />
              Top Clients by Shipment Volume
            </CardTitle>
            <CardDescription className="text-xs">
              Key client account volume leaders
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topClientsData.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip suffix=" orders" />} />
                <Bar dataKey="volume" name="Volume" fill="#10B981" radius={[0, 6, 6, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 5. Revenue Analytics */}
      <Card className="col-span-1 md:col-span-2 border border-border/80 shadow-xs hover:border-primary/40 transition-colors rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-500" />
              Revenue Analytics & Financial Growth
            </CardTitle>
            <CardDescription className="text-xs">
              Cumulative monthly gross revenue trajectories
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
              <Activity className="size-3" />
              Peak: $250k
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 15, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(val) => `$${val / 1000}k`} 
                />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Gross Revenue"
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
