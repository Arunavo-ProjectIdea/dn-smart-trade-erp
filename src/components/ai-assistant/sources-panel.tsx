"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Database, ShieldCheck, ExternalLink, BookOpen, Layers } from "lucide-react"

export function SourcesPanel() {
  const sources = [
    {
      id: "1",
      title: "HS Tariff Manual 2026",
      subtitle: "Heading 8703 - Motor Vehicles",
      match: "99.2% Match",
      type: "Official Tariff",
      status: "Verified",
      icon: BookOpen,
      iconColor: "text-sky-500",
      badgeStyle: "bg-sky-500/10 text-sky-600 border-sky-500/20"
    },
    {
      id: "2",
      title: "BOE-2026-491 Archive Log",
      subtitle: "Customs Entry Port #4",
      match: "96.5% Match",
      type: "Filing Log",
      status: "Verified",
      icon: FileText,
      iconColor: "text-emerald-500",
      badgeStyle: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    },
    {
      id: "3",
      title: "Global Duty Rates DB",
      subtitle: "Electric & Hybrid Vehicle Tax",
      match: "94.8% Match",
      type: "Tax Schedule",
      status: "Verified",
      icon: Database,
      iconColor: "text-purple-500",
      badgeStyle: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    }
  ]

  return (
    <Card className="flex flex-col h-full bg-card border border-border/80 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="p-4 pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="size-4 stroke-[2.5]" />
            </div>
            Cited Sources & Context
          </CardTitle>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="size-3" />
            Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto">
        <p className="text-xs text-muted-foreground leading-relaxed">
          The AI Assistant synthesizes answers using verified enterprise databases and official trade tariff guidelines:
        </p>

        <div className="space-y-2.5 pt-1">
          {sources.map((source) => {
            const IconComponent = source.icon

            return (
              <div
                key={source.id}
                className="p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors space-y-2 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`size-4 ${source.iconColor}`} />
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {source.title}
                    </span>
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-[11px] text-muted-foreground">
                  {source.subtitle}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-md font-semibold border ${source.badgeStyle}`}>
                    {source.type}
                  </span>
                  <span className="font-bold text-foreground font-mono">
                    {source.match}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
