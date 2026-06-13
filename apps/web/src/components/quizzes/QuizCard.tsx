import { Link } from 'react-router-dom'
import { BookOpen, Lock, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Quiz } from '@/types/quiz'
import { quizDifficultyLabels } from '@/lib/quiz-labels'
import { formatDuration } from '@/lib/lesson-labels'
import { cn } from '@/lib/cn'

interface QuizCardProps {
  quiz: Quiz
  sdgColor: string
  bestAccuracy: number
  hasCompleted: boolean
}

export function QuizCard({
  quiz,
  sdgColor,
  bestAccuracy,
  hasCompleted,
}: QuizCardProps) {
  const hasContent = Boolean(quiz.questions?.length)
  const quizPath = `/quizzes/${quiz.sdgId}/${quiz.id}`

  return (
    <Card variant="elevated" className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge
          variant="sdg"
          style={{ backgroundColor: sdgColor }}
          className="rounded-md px-2 py-0.5 text-[10px]"
        >
          SDG {quiz.sdgNumber}
        </Badge>
        <span className="rounded-full bg-primary-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-green">
          {quizDifficultyLabels[quiz.difficulty]}
        </span>
      </div>

      <h3 className="font-display text-lg font-semibold text-primary-dark">
        {quiz.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-sage">{quiz.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-sage">
        <span>{quiz.questionCount} questions</span>
        <span>·</span>
        <span>{formatDuration(quiz.estimatedMinutes)}</span>
        <span>·</span>
        <span className="flex items-center gap-1 text-gold">
          <Sparkles className="size-3" />
          {quiz.xpPerQuestion * quiz.questionCount} XP max
        </span>
      </div>

      <Link
        to={`/lessons/${quiz.sdgId}/${quiz.lessonId}`}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-green hover:underline"
      >
        <BookOpen className="size-3" />
        Linked lesson
      </Link>

      {hasCompleted && bestAccuracy > 0 ? (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-sage">
            <span>Best accuracy</span>
            <span className="font-medium text-primary-dark">{bestAccuracy}%</span>
          </div>
          <ProgressBar value={bestAccuracy} variant="gold" />
        </div>
      ) : null}

      <div className="mt-4">
        {hasContent ? (
          <Link to={quizPath}>
            <Button variant="primary" size="sm" className="w-full">
              {hasCompleted ? 'Retake Quiz' : 'Start Quiz'}
            </Button>
          </Link>
        ) : (
          <Button variant="secondary" size="sm" className="w-full" disabled>
            <Lock className="size-4" />
            Questions coming soon
          </Button>
        )}
      </div>
    </Card>
  )
}

interface QuizInsightCardProps {
  quiz: Quiz
  sdgColor: string
  sdgTitle: string
  bestAccuracy: number
  compact?: boolean
}

export function QuizInsightCard({
  quiz,
  sdgColor,
  sdgTitle,
  bestAccuracy,
  compact,
}: QuizInsightCardProps) {
  const path = `/quizzes/${quiz.sdgId}/${quiz.id}`
  const hasContent = Boolean(quiz.questions?.length)

  if (compact) {
    return (
      <Link
        to={hasContent ? path : `/quizzes/${quiz.sdgId}`}
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-cream px-4 py-3 transition-colors hover:border-primary-green/40"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-primary-dark">
            {quiz.title}
          </p>
          <p className="text-xs text-sage">{sdgTitle}</p>
        </div>
        {bestAccuracy > 0 ? (
          <span className="shrink-0 text-xs font-semibold text-gold">
            {bestAccuracy}%
          </span>
        ) : (
          <span className="shrink-0 text-xs text-sage">New</span>
        )}
      </Link>
    )
  }

  return (
    <Card variant="elevated">
      <Badge
        variant="sdg"
        style={{ backgroundColor: sdgColor }}
        className="mb-3 rounded-md px-2 py-0.5 text-[10px]"
      >
        SDG {quiz.sdgNumber}
      </Badge>
      <h4 className="font-display text-lg font-semibold text-primary-dark">
        {quiz.title}
      </h4>
      <p className="mt-1 text-sm text-sage">{sdgTitle}</p>
      {bestAccuracy > 0 ? (
        <p className={cn('mt-2 text-sm text-gold')}>Best: {bestAccuracy}%</p>
      ) : null}
      {hasContent ? (
        <Link to={path} className="mt-4 inline-block">
          <Button variant="primary" size="sm">
            Start Quiz
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
