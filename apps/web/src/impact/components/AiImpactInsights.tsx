import { Brain, TrendingUp } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ImpactAiInsight } from '@/impact/types/impact'

interface AiImpactInsightsProps {
  insights: ImpactAiInsight[]
}

export function AiImpactInsights({ insights }: AiImpactInsightsProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary-green">
          <Brain className="h-5 w-5" aria-hidden="true" />
          <CardTitle>AI Insights</CardTitle>
        </div>
        <CardDescription>Generated from progress and AI Tutor topic history.</CardDescription>
      </CardHeader>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-lg border border-border bg-cream/70 p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary-green" aria-hidden="true" />
              <div>
                <p className="font-semibold text-primary-dark">{insight.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-sage">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
