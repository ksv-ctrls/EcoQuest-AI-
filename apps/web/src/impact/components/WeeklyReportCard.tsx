import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { WeeklySustainabilityReport } from '@/impact/types/impact'

interface WeeklyReportCardProps {
  report: WeeklySustainabilityReport
  showAction?: boolean
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value))
}

export function WeeklyReportCard({ report, showAction = true }: WeeklyReportCardProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary-green">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
          <CardTitle>Weekly Sustainability Report</CardTitle>
        </div>
        <CardDescription>
          {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
        </CardDescription>
      </CardHeader>
      <p className="text-sm leading-relaxed text-sage">{report.summary}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-primary-green/10 p-3">
          <p className="text-xs uppercase tracking-wide text-sage">Learning</p>
          <p className="mt-1 font-semibold text-primary-dark">
            {report.lessonsCompleted} lessons, {report.quizzesCompleted} quizzes
          </p>
        </div>
        <div className="rounded-lg bg-gold/10 p-3">
          <p className="text-xs uppercase tracking-wide text-sage">Action</p>
          <p className="mt-1 font-semibold text-primary-dark">
            {report.missionsCompleted} missions, {report.gamesCompleted} games
          </p>
        </div>
      </div>
      {showAction && (
        <Link to="/impact/report" className="mt-4 inline-flex">
          <Button variant="secondary">View report</Button>
        </Link>
      )}
    </Card>
  )
}
