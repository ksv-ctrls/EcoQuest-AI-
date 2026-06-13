import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuizCard } from '@/components/quizzes/QuizCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useQuizProgress } from '@/context/QuizProgressContext'
import {
  getQuizzesBySdgId,
  getSdgQuizCatalog,
  getSdgQuizStats,
} from '@/data/mock/quiz-catalog'
import { quizDifficultyLabels } from '@/lib/quiz-labels'
import { formatDuration } from '@/lib/lesson-labels'

export function SDGQuizzesPage() {
  const { sdgId } = useParams<{ sdgId: string }>()
  const { results, getBestAccuracy, hasCompleted } = useQuizProgress()

  if (!sdgId) return <Navigate to="/quizzes" replace />

  const catalog = getSdgQuizCatalog(sdgId)
  if (!catalog) return <Navigate to="/quizzes" replace />

  const stats = getSdgQuizStats(sdgId, results)!
  const quizzes = getQuizzesBySdgId(sdgId)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link to="/quizzes">
        <Button variant="outline" size="sm">
          <ArrowLeft className="size-4" />
          All quiz paths
        </Button>
      </Link>

      <Card variant="elevated" className="overflow-hidden p-0">
        <div className="h-2" style={{ backgroundColor: catalog.color }} />
        <div className="p-6 sm:p-8">
          <PageHeader
            title={`SDG ${catalog.sdgNumber}: ${catalog.title} Quizzes`}
            description={catalog.overview}
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Quizzes" value={String(stats.quizCount)} />
            <Stat label="Completion" value={`${stats.completionPercent}%`} />
            <Stat label="Difficulty" value={quizDifficultyLabels[stats.difficulty]} />
            <Stat label="Est. time" value={formatDuration(stats.estimatedMinutes)} />
          </div>

          <div className="mt-6">
            <ProgressBar
              value={stats.completionPercent}
              variant="gold"
              label="SDG quiz completion"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            sdgColor={catalog.color}
            bestAccuracy={getBestAccuracy(quiz.id)}
            hasCompleted={hasCompleted(quiz.id)}
          />
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-cream px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-sage">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-primary-dark">{value}</p>
    </div>
  )
}
