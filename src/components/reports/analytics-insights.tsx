import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { analyticsInsights } from "@/lib/mock-data/reports"

export function AnalyticsInsights() {
  return (
    <Card className="rounded-xl border border-border/40 bg-card shadow-sm">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center text-foreground text-lg tracking-tight">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4 text-primary" />
          </div>
          Executive AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {analyticsInsights.map((insight, index) => (
            <div key={index} className="flex items-start group">
              <FontAwesomeIcon 
                icon={faChevronRight} 
                className="h-3 w-3 text-primary/40 mt-1.5 mr-3 shrink-0 group-hover:text-primary transition-colors" 
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
