import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { LessonCatalogCard } from '@/components/lessons/LessonCatalogCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useLessonProgress } from '@/context/LessonProgressContext'
import {
  getLessonsBySdgId,
  getSdgCatalog,
  getSdgCatalogStats,
} from '@/data/mock/lesson-catalog'
import type { LessonStatus } from '@/types/lesson'
import { difficultyLabels, formatDuration } from '@/lib/lesson-labels'

function statusProgressPercent(status: LessonStatus): number {
  switch (status) {
    case 'completed':
      return 100
    case 'in_progress':
      return 55
    case 'started':
      return 20
    default:
      return 0
  }
}

export function SDGLessonsPage() {
  const { sdgId } = useParams<{ sdgId: string }>()
  const { progress, getStatus } = useLessonProgress()

  if (!sdgId) return <Navigate to="/lessons" replace />

  const catalog = getSdgCatalog(sdgId)
  if (!catalog) return <Navigate to="/lessons" replace />

  const stats = getSdgCatalogStats(sdgId, progress)!
  const lessons = getLessonsBySdgId(sdgId)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link to="/lessons">
        <Button variant="outline" size="sm">
          <ArrowLeft className="size-4" />
          All SDG paths
        </Button>
      </Link>

      <Card variant="elevated" className="overflow-hidden p-0">
        <div className="h-2" style={{ backgroundColor: catalog.color }} />
        <div className="p-6 sm:p-8">
          <PageHeader
            title={`SDG ${catalog.sdgNumber}: ${catalog.title}`}
            description={catalog.overview}
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Lessons" value={String(stats.lessonCount)} />
            <Stat label="Completion" value={`${stats.completionPercent}%`} />
            <Stat
              label="Difficulty"
              value={difficultyLabels[stats.difficulty]}
            />
            <Stat
              label="Est. learning time"
              value={formatDuration(stats.estimatedMinutes)}
            />
          </div>

          <div className="mt-6">
            <ProgressBar
              value={stats.completionPercent}
              variant="gold"
              label="SDG completion"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const status = getStatus(lesson.id)
          return (
            <LessonCatalogCard
              key={lesson.id}
              lesson={lesson}
              sdgColor={catalog.color}
              status={status}
              progressPercent={statusProgressPercent(status)}
            />
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-cream px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-sage">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-bold text-primary-dark">
        {value}
      </p>
    </div>
  )
}
