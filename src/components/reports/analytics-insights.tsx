import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { analyticsInsights } from "@/lib/mock-data/reports"

export function AnalyticsInsights() {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-100 dark:border-indigo-900">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-300 text-lg">
          <Sparkles className="mr-2 h-5 w-5" />
          AI Analytics Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {analyticsInsights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 mr-3" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {insight}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
