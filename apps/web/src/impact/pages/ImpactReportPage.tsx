import { Link } from 'react-router-dom'
import { Download, FileText } from 'lucide-react'
import { AiImpactInsights } from '@/impact/components/AiImpactInsights'
import { ImpactMetricGrid } from '@/impact/components/ImpactMetricGrid'
import { SdgProgressTracker } from '@/impact/components/SdgProgressTracker'
import { WeeklyReportCard } from '@/impact/components/WeeklyReportCard'
import { useImpact } from '@/impact/context/ImpactContext'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'

export function ImpactReportPage() {
  const impact = useImpact()
  const topSdgs = [...impact.sdgProgress]
    .sort((a, b) => b.overallMasteryPercent - a.overallMasteryPercent)
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Weekly Sustainability Report"
        description="A shareable view of your learning, action, and SDG progress."
      />

      <WeeklyReportCard report={impact.weeklyReport} showAction={false} />
      <ImpactMetricGrid metrics={impact.personalImpact} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary-green">
              <FileText className="h-5 w-5" aria-hidden="true" />
              <CardTitle>Report Narrative</CardTitle>
            </div>
            <CardDescription>Generated from your completed activities.</CardDescription>
          </CardHeader>
          <div className="space-y-4 text-sm leading-relaxed text-sage">
            <p>{impact.weeklyReport.summary}</p>
            <p>
              Your current impact score is {impact.impactScore}%, with an average SDG mastery
              of {impact.averageSdgMastery}%. Keep balancing lessons, quizzes, missions, and
              games to raise both knowledge and real-world action.
            </p>
            <p>
              Estimated cumulative impact includes {impact.personalImpact.waterSavedLiters} liters
              of water saved, {impact.personalImpact.co2ReducedKg} kg CO2 reduced, and
              {impact.personalImpact.plasticAvoidedKg} kg plastic avoided.
            </p>
          </div>
        </Card>

        <AiImpactInsights insights={impact.insights} />
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Top SDG Progress</CardTitle>
          <CardDescription>Your strongest SDG mastery areas this week.</CardDescription>
        </CardHeader>
        <SdgProgressTracker progress={topSdgs} />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/impact">
          <Button variant="secondary">Back to impact</Button>
        </Link>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export coming soon
        </Button>
      </div>
    </div>
  )
}
