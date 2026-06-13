import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { DashboardLessonInsight } from '@/types/lesson'
import { formatDuration, statusLabels } from '@/lib/lesson-labels'
import { cn } from '@/lib/cn'

interface LessonInsightCardProps {
  insight: DashboardLessonInsight
  variant?: 'default' | 'highlight' | 'compact'
}

export function LessonInsightCard({
  insight,
  variant = 'default',
}: LessonInsightCardProps) {
  const { lesson, sdgId, sdgTitle, sdgColor, status, progressPercent } =
    insight
  const path = `/lessons/${sdgId}/${lesson.id}`
  const canOpen = Boolean(lesson.content)

  if (variant === 'compact') {
    return (
      <Link
        to={canOpen ? path : `/lessons/${sdgId}`}
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-cream px-4 py-3 transition-colors hover:border-primary-green/40"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-primary-dark">
            {lesson.title}
          </p>
          <p className="text-xs text-sage">{sdgTitle}</p>
        </div>
        <span
          className={cn(
            'shrink-0 text-xs font-medium',
            status === 'completed' && 'text-primary-green',
            (status === 'in_progress' || status === 'started') && 'text-gold',
          )}
        >
          {statusLabels[status]}
        </span>
      </Link>
    )
  }

  return (
    <Card
      variant={variant === 'highlight' ? 'interactive' : 'elevated'}
      className={cn(variant === 'highlight' && 'border-gold/30 bg-gold/5')}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge
          variant="sdg"
          style={{ backgroundColor: sdgColor }}
          className="rounded-md px-2 py-0.5 text-[10px]"
        >
          SDG {lesson.sdgNumber}
        </Badge>
        <span className="text-xs text-sage">{formatDuration(lesson.durationMinutes)}</span>
      </div>

      <h4 className="font-display text-lg font-semibold text-primary-dark">
        {lesson.title}
      </h4>
      <p className="mt-1 text-sm text-sage">{sdgTitle}</p>

      {status !== 'not_started' ? (
        <div className="mt-3">
          <ProgressBar value={progressPercent} />
        </div>
      ) : null}

      {canOpen ? (
        <Link to={path} className="mt-4 inline-block">
          <Button variant={variant === 'highlight' ? 'gold' : 'primary'} size="sm">
            {status === 'completed'
              ? 'Review'
              : status === 'not_started'
                ? 'Start'
                : 'Continue'}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="secondary" size="sm" className="mt-4" disabled>
          Coming soon
        </Button>
      )}
    </Card>
  )
}

interface LessonInsightSectionProps {
  title: string
  insight: DashboardLessonInsight | null
  emptyMessage: string
  variant?: 'default' | 'highlight'
}

export function LessonInsightSection({
  title,
  insight,
  emptyMessage,
  variant = 'default',
}: LessonInsightSectionProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {insight ? (
        <LessonInsightCard insight={insight} variant={variant} />
      ) : (
        <p className="text-sm text-sage">{emptyMessage}</p>
      )}
    </Card>
  )
}
