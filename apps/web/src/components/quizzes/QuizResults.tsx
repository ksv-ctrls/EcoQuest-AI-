import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getMissionById } from '@/data/mock/mission-catalog'
import { getLessonById } from '@/data/mock/lesson-catalog'
import type { QuizSessionResult } from '@/types/quiz'
import { formatAccuracy, formatTimeTaken } from '@/lib/quiz-labels'

interface QuizResultsProps {
  result: QuizSessionResult
  sdgColor: string
  onRetake: () => void
}

export function QuizResults({ result, sdgColor, onRetake }: QuizResultsProps) {
  const lesson = getLessonById(result.recommendedLessonId)
  const mission = getMissionById(result.recommendedMissionId)

  const performanceMessage =
    result.accuracy === 100
      ? 'Perfect score! You\'re an Eco-SDG Champion.'
      : result.accuracy >= 80
        ? 'Excellent work! Strong SDG knowledge.'
        : result.accuracy >= 60
          ? 'Good effort! Review improvement areas below.'
          : 'Keep learning — revisit the linked lesson and try again.'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card variant="elevated" className="overflow-hidden p-0">
        <div className="h-2" style={{ backgroundColor: sdgColor }} />
        <div className="p-6 sm:p-8 text-center">
          <Trophy className="mx-auto mb-4 size-12 text-gold" />
          <h2 className="font-display text-2xl font-bold text-primary-dark">
            Quiz Complete!
          </h2>
          <p className="mt-2 text-sage">{result.quizTitle}</p>
          <p className="mt-4 text-lg font-medium text-primary-dark">
            {performanceMessage}
          </p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultStat icon={Target} label="Score" value={String(result.score)} />
        <ResultStat
          icon={Sparkles}
          label="Accuracy"
          value={formatAccuracy(result.accuracy)}
        />
        <ResultStat
          icon={Clock}
          label="Time taken"
          value={formatTimeTaken(result.timeTakenSeconds)}
        />
        <ResultStat
          icon={Trophy}
          label="XP earned"
          value={`+${result.xpEarned}`}
        />
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Performance breakdown</CardTitle>
        </CardHeader>
        <p className="mb-3 text-sm text-sage">
          {result.correctCount} of {result.totalQuestions} questions correct
        </p>
        <ProgressBar value={result.accuracy} variant="gold" />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary-green">
              <TrendingUp className="size-5" />
              Strength areas
            </CardTitle>
          </CardHeader>
          {result.strengthAreas.length > 0 ? (
            <ul className="space-y-2">
              {result.strengthAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-lg bg-primary-green/10 px-3 py-2 text-sm text-primary-dark"
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-sage">Complete more questions to identify strengths.</p>
          )}
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold">
              <TrendingDown className="size-5" />
              Improvement areas
            </CardTitle>
          </CardHeader>
          {result.improvementAreas.length > 0 ? (
            <ul className="space-y-2">
              {result.improvementAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-primary-dark"
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-sage">No weak topics detected — great job!</p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card variant="elevated" className="border-primary-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary-green" />
              Recommended lesson
            </CardTitle>
          </CardHeader>
          {lesson ? (
            <>
              <p className="text-sm font-medium text-primary-dark">{lesson.title}</p>
              <p className="mt-1 text-sm text-sage">{lesson.description}</p>
              <Link
                to={`/lessons/${result.sdgId}/${lesson.id}`}
                className="mt-4 inline-block"
              >
                <Button variant="primary" size="sm">
                  Review lesson
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </>
          ) : null}
        </Card>

        <Card variant="elevated" className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="default">Mission</Badge>
              Recommended mission
            </CardTitle>
          </CardHeader>
          {mission ? (
            <>
              <p className="text-sm font-medium text-primary-dark">{mission.title}</p>
              <p className="mt-1 text-sm text-sage">{mission.description}</p>
              <p className="mt-2 text-xs text-gold">
                {mission.xpReward} XP · {mission.ecoCoinReward} eco coins
              </p>
              <Link to={`/missions/${result.sdgId}/${mission.id}`}>
                <Button variant="gold" size="sm" className="mt-4">
                  Start mission
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </>
          ) : null}
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="gold" onClick={onRetake}>
          Retake quiz
        </Button>
        <Link to={`/quizzes/${result.sdgId}`}>
          <Button variant="outline">More SDG quizzes</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

function ResultStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target
  label: string
  value: string
}) {
  return (
    <Card variant="elevated" className="text-center">
      <Icon className="mx-auto mb-2 size-5 text-primary-green" />
      <p className="text-xs font-medium uppercase tracking-wide text-sage">{label}</p>
      <p className="font-display text-2xl font-bold text-primary-dark">{value}</p>
    </Card>
  )
}
