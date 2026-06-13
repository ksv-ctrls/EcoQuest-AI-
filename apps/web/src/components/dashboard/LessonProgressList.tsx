import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useLessonProgress } from '@/context/LessonProgressContext'
import { statusLabels } from '@/lib/lesson-labels'
import { cn } from '@/lib/cn'

export function LessonProgressList() {
  const { activeLessons } = useLessonProgress()

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Lessons Progress — Environmental & SDG Topics</CardTitle>
      </CardHeader>
      <ul className="max-h-72 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
        {activeLessons.map((insight) => (
          <li key={insight.lesson.id}>
            <Link
              to={
                insight.lesson.content
                  ? `/lessons/${insight.sdgId}/${insight.lesson.id}`
                  : `/lessons/${insight.sdgId}`
              }
              className="block rounded-lg border border-border bg-cream px-4 py-3 transition-colors hover:border-primary-green/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-primary-dark">
                  {insight.lesson.title}
                </span>
                <span
                  className={cn(
                    'shrink-0 text-xs font-medium',
                    insight.status === 'completed' && 'text-primary-green',
                    (insight.status === 'in_progress' ||
                      insight.status === 'started') &&
                      'text-gold',
                  )}
                >
                  {statusLabels[insight.status]}
                </span>
              </div>
              <div className="mt-2">
                <ProgressBar value={insight.progressPercent} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
