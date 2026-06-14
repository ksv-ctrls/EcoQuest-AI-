import { Link } from 'react-router-dom'
import { Activity, BarChart3, FileText, Trophy } from 'lucide-react'
import { AiImpactInsights } from '@/impact/components/AiImpactInsights'
import { EcoJourneyTimeline } from '@/impact/components/EcoJourneyTimeline'
import { ImpactMetricGrid } from '@/impact/components/ImpactMetricGrid'
import { SdgProgressTracker } from '@/impact/components/SdgProgressTracker'
import { WeeklyReportCard } from '@/impact/components/WeeklyReportCard'
import { useImpact } from '@/impact/context/ImpactContext'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'

export function ImpactDashboardPage() {
  const impact = useImpact()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Impact Analytics"
        description="Track your personal sustainability outcomes and SDG mastery."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Impact Score</CardTitle>
            <CardDescription>Combined learning and action score.</CardDescription>
          </CardHeader>
          <p className="text-3xl font-semibold text-primary-dark">{impact.impactScore}%</p>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>SDG Mastery</CardTitle>
            <CardDescription>Average progress across all 17 goals.</CardDescription>
          </CardHeader>
          <p className="text-3xl font-semibold text-primary-dark">{impact.averageSdgMastery}%</p>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Weekly Report</CardTitle>
            <CardDescription>Summarized sustainability activity.</CardDescription>
          </CardHeader>
          <Link to="/impact/report">
            <Button>
              <FileText className="h-4 w-4" aria-hidden="true" />
              Open report
            </Button>
          </Link>
        </Card>
      </div>

      <ImpactMetricGrid metrics={impact.personalImpact} />

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary-green">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
              <CardTitle>SDG Progress Tracker</CardTitle>
            </div>
            <CardDescription>Learning, quiz, mission, game, and overall mastery for every SDG.</CardDescription>
          </CardHeader>
          <SdgProgressTracker progress={impact.sdgProgress} />
        </Card>

        <div className="space-y-6">
          <WeeklyReportCard report={impact.weeklyReport} />
          <AiImpactInsights insights={impact.insights} />
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary-green">
            <Activity className="h-5 w-5" aria-hidden="true" />
            <CardTitle>Eco Journey Timeline</CardTitle>
          </div>
          <CardDescription>Recent lessons, quizzes, missions, badges, and games.</CardDescription>
        </CardHeader>
        <EcoJourneyTimeline items={impact.timeline} />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard">
          <Button variant="secondary">Back to dashboard</Button>
        </Link>
        <Link to="/achievements">
          <Button variant="outline">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            View achievements
          </Button>
        </Link>
      </div>
    </div>
  )
}
