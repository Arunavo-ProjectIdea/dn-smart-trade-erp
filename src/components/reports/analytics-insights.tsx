import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, Building2, ShieldCheck, Target, ArrowRight, Zap } from "lucide-react"
import { analyticsInsights } from "@/lib/mock-data/reports"

export function AnalyticsInsights() {
  const icons = [TrendingUp, Building2, ShieldCheck, Target]
  const badges = ["Volume Shift", "Client Impact", "Efficiency Gain", "Forecast"]
  const badgeStyles = [
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  ]

  return (
    <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-card shadow-md rounded-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-foreground font-bold text-base">
            <div className="size-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center mr-2.5 shadow-xs">
              <Sparkles className="size-4 animate-pulse text-primary" />
            </div>
            AI Executive Insights
          </CardTitle>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary text-primary-foreground">
            Automated
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 relative z-10">
        {analyticsInsights.map((insight, index) => {
          const IconComponent = icons[index % icons.length]
          const badgeText = badges[index % badges.length]
          const badgeStyle = badgeStyles[index % badgeStyles.length]

          return (
            <div
              key={index}
              className="p-3.5 rounded-xl border border-border/60 bg-card/80 hover:bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-300 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badgeStyle}`}>
                  {badgeText}
                </span>
                <IconComponent className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                {insight}
              </p>
            </div>
          )
        })}

        {/* Action Callout Footer */}
        <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs flex items-center justify-between text-primary font-medium">
          <span className="flex items-center gap-1.5">
            <Zap className="size-4 fill-primary text-primary" />
            Optimized routing strategy recommended
          </span>
          <ArrowRight className="size-3.5 shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
}
