import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Lesson, LessonStatus } from '@/types/lesson'
import { difficultyLabels, formatDuration, statusLabels } from '@/lib/lesson-labels'
import { cn } from '@/lib/cn'
import { BookOpen, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LessonCatalogCardProps {
  lesson: Lesson
  sdgColor: string
  status: LessonStatus
  progressPercent: number
}

export function LessonCatalogCard({
  lesson,
  sdgColor,
  status,
  progressPercent,
}: LessonCatalogCardProps) {
  const hasContent = Boolean(lesson.content)
  const lessonPath = `/lessons/${lesson.sdgId}/${lesson.id}`

  return (
    <Card variant="elevated" className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge
          variant="sdg"
          style={{ backgroundColor: sdgColor }}
          className="rounded-md px-2 py-1 text-[10px]"
        >
          SDG {lesson.sdgNumber}
        </Badge>
        <span className="rounded-full bg-primary-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-green">
          {difficultyLabels[lesson.difficulty]}
        </span>
      </div>

      <h3 className="font-display text-lg font-semibold text-primary-dark">
        {lesson.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-sage">{lesson.description}</p>

      <div className="mt-3 flex items-center gap-3 text-xs text-sage">
        <span>{formatDuration(lesson.durationMinutes)}</span>
        <span>·</span>
        <span
          className={cn(
            'font-medium',
            status === 'completed' && 'text-primary-green',
            status === 'in_progress' && 'text-gold',
            status === 'started' && 'text-gold',
            status === 'not_started' && 'text-sage',
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      {status !== 'not_started' ? (
        <div className="mt-3">
          <ProgressBar value={progressPercent} />
        </div>
      ) : null}

      <div className="mt-4">
        {hasContent ? (
          <Link to={lessonPath}>
            <Button variant="primary" size="sm" className="w-full">
              <BookOpen className="size-4" />
              {status === 'completed'
                ? 'Review'
                : status === 'not_started'
                  ? 'Start Lesson'
                  : 'Continue'}
            </Button>
          </Link>
        ) : (
          <Button variant="secondary" size="sm" className="w-full" disabled>
            <Lock className="size-4" />
            Content coming soon
          </Button>
        )}
      </div>
    </Card>
  )
}
