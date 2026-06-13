import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { SDGCatalogStats, SDGLessonCatalog } from '@/types/lesson'
import { difficultyLabels, formatDuration } from '@/lib/lesson-labels'
import { cn } from '@/lib/cn'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SDGCatalogCardProps {
  catalog: SDGLessonCatalog
  stats: SDGCatalogStats
}

export function SDGCatalogCard({ catalog, stats }: SDGCatalogCardProps) {
  return (
    <Link to={`/lessons/${catalog.sdgId}`} className="block h-full">
      <Card
        variant="interactive"
        className="flex h-full flex-col overflow-hidden p-0"
      >
        <div className="h-2" style={{ backgroundColor: catalog.color }} />
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <Badge
              variant="sdg"
              style={{ backgroundColor: catalog.color }}
              className="rounded-md px-2 py-1"
            >
              SDG {catalog.sdgNumber}
            </Badge>
            <span className="text-xs font-medium text-sage">
              {difficultyLabels[stats.difficulty]}
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold text-primary-dark">
            {catalog.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-sage">
            {catalog.overview}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-sage">
            <div>
              <p className="font-medium text-primary-dark">{stats.lessonCount}</p>
              <p>Lessons</p>
            </div>
            <div>
              <p className="font-medium text-primary-dark">
                {formatDuration(stats.estimatedMinutes)}
              </p>
              <p>Est. time</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-sage">Completion</span>
              <span className="font-medium text-primary-dark">
                {stats.completionPercent}%
              </span>
            </div>
            <ProgressBar value={stats.completionPercent} />
          </div>

          <span
            className={cn(
              'mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-green',
            )}
          >
            View lessons
            <ChevronRight className="size-4" />
          </span>
        </div>
      </Card>
    </Link>
  )
}
