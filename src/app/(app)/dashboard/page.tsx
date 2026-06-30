"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { 
  Ship, 
  FileCheck, 
  Bot,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  ArrowUp,
  ArrowRight
} from "lucide-react"

import { AuthService, UserRole } from "@/lib/auth"
import { ShaderBackground } from "@/components/ui/shader-background"

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>("Admin")

  useEffect(() => {
    const initRole = async () => {
      const user = AuthService.getCurrentUser()
      if (user) {
        setRole(user.role)
      }
    }
    initRole()
  }, [])

  const stats = [
    { name: "Active Shipments", value: "1,284", icon: Ship, trend: "+12%", positive: true },
    { name: "Pending Clearance", value: "42", icon: FileCheck, trend: "", positive: false },
  ]

  const recentActivity = [
    { 
      action: "Customs Cleared", 
      time: "10:42 AM", 
      description: "Shipment #SHP-9921 (Electronics) cleared at Port of Rotterdam.", 
      status: "success",
      icon: CheckCircle
    },
    { 
      action: "AI Route Optimization", 
      time: "08:15 AM", 
      description: "Applied new route for Fleet Beta saving approx 12 hours transit time.", 
      status: "info",
      icon: Bot
    },
    { 
      action: "Document Rejected", 
      time: "Yesterday", 
      description: "Commercial Invoice for BOE-441 missing signature. Resubmission required.", 
      status: "danger",
      icon: AlertTriangle
    },
  ]

  const StatIcon0 = stats[0].icon
  const StatIcon1 = stats[1].icon

  return (
    <div className="relative min-h-[calc(100vh-100px)] text-on-background font-body-md rounded-xl overflow-hidden shadow-2xl bg-background -m-4 sm:-m-6 lg:-m-8">
      {/* Background Animation Layer */}
      <ShaderBackground className="absolute inset-0 z-0" />
      
      {/* Scrollable Canvas */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 pb-32">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          <div className="mb-8">
             <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">{role} Dashboard Overview</h1>
             <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Real-time trade analytics and automated operations.</p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
            
            {/* KPI 1: Active Shipments */}
            <Link href="/shipments" className="glass-panel rounded-xl p-6 md:col-span-3 lg:col-span-3 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">{stats[0].name}</p>
                  <h3 className="text-display-lg font-display-lg text-on-surface mt-2 group-hover:text-primary transition-colors">{stats[0].value}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <StatIcon0 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-body-sm">
                <span className="flex items-center text-secondary bg-secondary/10 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <ArrowUp className="w-3 h-3 mr-1" /> {stats[0].trend}
                </span>
                <span className="text-outline-variant">vs last month</span>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
            </Link>

            {/* KPI 2: Pending Clearance */}
            <Link href="/boe" className="glass-panel rounded-xl p-6 md:col-span-3 lg:col-span-3 flex flex-col justify-between relative overflow-hidden group hover:border-error/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">{stats[1].name}</p>
                  <h3 className="text-display-lg font-display-lg text-on-surface mt-2 group-hover:text-error transition-colors">{stats[1].value}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center text-error">
                  <StatIcon1 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-error"></span> High Priority</span>
                  <span className="font-code text-on-surface">12</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Standard</span>
                  <span className="font-code text-on-surface">30</span>
                </div>
              </div>
            </Link>

            {/* AI Insights Panel (Bento Span) */}
            <div className="glass-panel rounded-xl p-6 md:col-span-6 lg:col-span-6 ai-glow relative overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-tertiary animate-pulse" />
                <h3 className="text-label-md font-label-md text-tertiary uppercase tracking-wider">Copilot Insights</h3>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Insight Card 1 */}
                <div className="bg-surface-container-highest/50 rounded-lg p-4 border border-outline-variant/20 hover:border-tertiary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
                    <div>
                      <h4 className="text-body-sm font-label-md text-on-surface">Potential Delay</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Vessel 'Oceanic V' facing severe weather near Port of Singapore. ETA adjusted by +48h.</p>
                      <button disabled className="mt-2 text-xs text-tertiary/50 cursor-not-allowed font-semibold flex items-center">Reroute Options <ArrowRight className="w-3 h-3 ml-1" /></button>
                    </div>
                  </div>
                </div>
                {/* Insight Card 2 */}
                <div className="bg-surface-container-highest/50 rounded-lg p-4 border border-outline-variant/20 hover:border-secondary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <h4 className="text-body-sm font-label-md text-on-surface">Tax Saving Opportunity</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Detected FTA eligibility for 15 upcoming electronics shipments from Vietnam. Potential saving: $12.4k.</p>
                      <button disabled className="mt-2 text-xs text-secondary/50 cursor-not-allowed font-semibold flex items-center">Apply FTA <ArrowRight className="w-3 h-3 ml-1" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Overview Chart */}
            <div className="glass-panel rounded-xl p-6 md:col-span-6 lg:col-span-8 row-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-headline-md font-headline-md text-on-surface">Revenue Overview</h2>
                  <p className="text-body-sm text-on-surface-variant">Monthly trade volume vs operational costs</p>
                </div>
                <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/20">
                  <button disabled className="px-3 py-1 text-xs font-label-md text-on-surface-variant/50 cursor-not-allowed transition-colors">1W</button>
                  <button disabled className="px-3 py-1 text-xs font-label-md bg-surface-variant/50 text-on-surface/50 cursor-not-allowed rounded shadow-sm">1M</button>
                  <button disabled className="px-3 py-1 text-xs font-label-md text-on-surface-variant/50 cursor-not-allowed transition-colors">1Y</button>
                </div>
              </div>
              
              {/* Pseudo Chart Area */}
              <div className="flex-1 relative w-full min-h-[250px] border-b border-l border-outline-variant/30 flex items-end pt-4 pr-4">
                <div className="absolute left-[-40px] top-0 bottom-0 flex flex-col justify-between text-[10px] text-outline-variant font-code py-4">
                  <span>$1M</span>
                  <span>$750k</span>
                  <span>$500k</span>
                  <span>$250k</span>
                  <span>0</span>
                </div>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0 pt-4 pl-0 pr-4">
                  <div className="w-full h-px bg-outline-variant/10"></div>
                  <div className="w-full h-px bg-outline-variant/10"></div>
                  <div className="w-full h-px bg-outline-variant/10"></div>
                  <div className="w-full h-px bg-outline-variant/10"></div>
                  <div className="w-full h-px bg-transparent"></div>
                </div>
                <div className="w-full h-full relative flex items-end justify-between px-2 gap-2">
                  {[
                    { rev: 40, cost: 20 },
                    { rev: 55, cost: 25 },
                    { rev: 45, cost: 22 },
                    { rev: 70, cost: 30 },
                    { rev: 65, cost: 35 },
                    { rev: 85, cost: 40, tooltip: "Rev: $850k" }
                  ].map((data, i) => (
                    <div key={i} className="w-full flex justify-center gap-1 items-end h-full group relative">
                      <div className="w-1/3 bg-primary/80 rounded-t-sm group-hover:bg-primary transition-colors" style={{ height: `${data.rev}%` }}>
                        {data.tooltip && (
                          <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-high border border-outline-variant/50 px-2 py-1 rounded text-xs text-on-surface whitespace-nowrap z-10 shadow-lg">
                            {data.tooltip}
                          </div>
                        )}
                      </div>
                      <div className="w-1/3 bg-outline-variant/50 rounded-t-sm group-hover:bg-outline-variant transition-colors" style={{ height: `${data.cost}%` }}></div>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-outline-variant px-4">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-10 text-xs">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary"></span><span className="text-on-surface">Revenue</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-outline-variant/50"></span><span className="text-on-surface-variant">Costs</span></div>
              </div>
            </div>

            {/* Circular Gauges container */}
            <div className="md:col-span-6 lg:col-span-4 row-span-2 flex flex-col gap-6">
              {/* Profit Margin (Gauge) */}
              <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col items-center justify-center relative">
                <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider absolute top-6 left-6">Profit Margin</h3>
                <div className="mt-8 relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(43, 58, 76, 0.5)" strokeWidth="8"></circle>
                    <circle className="drop-shadow-[0_0_8px_rgba(78,222,163,0.4)]" cx="50" cy="50" fill="transparent" r="40" stroke="#4edea3" strokeDasharray="251.2" strokeDashoffset="80.38" strokeLinecap="round" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-headline-lg font-headline-lg text-on-surface">68%</span>
                    <span className="text-[10px] text-secondary flex items-center"><ArrowUp className="w-3 h-3" /> 2.4%</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mt-4 text-center">Exceeds Q3 target by 5%.</p>
              </div>

              {/* Shipment Status (Donut) */}
              <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col relative">
                <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-4">Shipment Status</h3>
                <div className="flex items-center justify-between flex-1">
                  <div className="relative w-28 h-28">
                    <div className="w-full h-full rounded-full border-[8px] border-surface-container-highest relative overflow-hidden">
                      <div className="absolute inset-0 rounded-full border-[8px] border-primary" style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)" }}></div>
                      <div className="absolute inset-0 rounded-full border-[8px] border-tertiary" style={{ clipPath: "polygon(50% 50%, 0 50%, 0 0, 50% 0)" }}></div>
                      <div className="absolute inset-0 rounded-full border-[8px] border-error" style={{ clipPath: "polygon(50% 50%, 50% 0, 100% 0)", transform: "rotate(45deg)" }}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-body-sm font-label-md text-on-surface">1.2k</div>
                  </div>
                  <div className="space-y-3 flex-1 ml-6">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> <span className="text-on-surface">In Transit</span></div>
                      <span className="font-code">65%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary"></span> <span className="text-on-surface">Customs</span></div>
                      <span className="font-code">25%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-error"></span> <span className="text-on-surface">Delayed</span></div>
                      <span className="font-code">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities Timeline */}
            <div className="glass-panel rounded-xl p-6 md:col-span-12 lg:col-span-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-headline-md font-headline-md text-on-surface">Recent Activities</h2>
                <button disabled className="text-sm font-label-md text-primary/50 cursor-not-allowed transition-colors">View All</button>
              </div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
                
                {recentActivity.map((activity, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(5,20,36,1)] z-10 ${
                      activity.status === 'success' ? 'bg-secondary text-on-secondary' :
                      activity.status === 'info' ? 'bg-surface-container-highest text-tertiary' :
                      'bg-error-container text-error'
                    }`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-surface-container-high border border-outline-variant/20 transition-colors shadow-sm ml-4 md:ml-0 md:group-odd:mr-8 md:group-even:ml-8 ${
                      activity.status === 'success' ? 'hover:border-secondary/50' :
                      activity.status === 'info' ? 'hover:border-tertiary/50' :
                      'hover:border-error/50'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                        <h4 className={`text-label-md font-label-md ${
                          activity.status === 'success' ? 'text-on-surface' :
                          activity.status === 'info' ? 'text-tertiary' :
                          'text-error'
                        }`}>{activity.action}</h4>
                        <time className="text-xs font-code text-on-surface-variant">{activity.time}</time>
                      </div>
                      <p className="text-body-sm text-on-surface-variant">{activity.description}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
