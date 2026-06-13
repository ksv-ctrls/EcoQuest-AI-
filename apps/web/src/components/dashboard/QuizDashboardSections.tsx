import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { QuizInsightCard } from '@/components/quizzes/QuizCard'
import { useQuizProgress } from '@/context/QuizProgressContext'
import { formatAccuracy, formatTimeTaken } from '@/lib/quiz-labels'
import { cn } from '@/lib/cn'

export function RecommendedQuizSection() {
  const { recommendedQuiz } = useQuizProgress()

  return (
    <Card variant="elevated" className="border-gold/20 bg-gold/5">
      <CardHeader>
        <CardTitle>Recommended Quiz</CardTitle>
      </CardHeader>
      {recommendedQuiz ? (
        <QuizInsightCard
          quiz={recommendedQuiz.quiz}
          sdgColor={recommendedQuiz.sdgColor}
          sdgTitle={recommendedQuiz.sdgTitle}
          bestAccuracy={recommendedQuiz.bestAccuracy}
        />
      ) : (
        <p className="text-sm text-sage">All available quizzes completed!</p>
      )}
    </Card>
  )
}

export function RecentQuizResultsSection() {
  const { recentResults } = useQuizProgress()

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Recent Quiz Results</CardTitle>
      </CardHeader>
      {recentResults.length > 0 ? (
        <ul className="space-y-2">
          {recentResults.map((result) => (
            <li key={`${result.quizId}-${result.completionTime}`}>
              <Link
                to={`/quizzes/${result.sdgId}/${result.quizId}`}
                className="block rounded-lg border border-border bg-cream px-4 py-3 transition-colors hover:border-primary-green/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary-dark">
                      {result.quizTitle}
                    </p>
                    <p className="text-xs text-sage">
                      {formatTimeTaken(result.timeTakenSeconds)} · +{result.xpEarned} XP
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-sm font-semibold',
                      result.accuracy >= 80 ? 'text-primary-green' : 'text-gold',
                    )}
                  >
                    {formatAccuracy(result.accuracy)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-sage">No quiz attempts yet.</p>
      )}
      <Link
        to="/quizzes"
        className="mt-4 inline-block text-sm font-medium text-primary-green hover:underline"
      >
        Browse all quizzes →
      </Link>
    </Card>
  )
}

export function QuizAccuracySection() {
  const { quizStats } = useQuizProgress()

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Quiz Performance</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sage">
            Accuracy
          </p>
          <p className="font-display text-3xl font-bold text-primary-dark">
            {formatAccuracy(quizStats.averageAccuracy)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sage">
            Streak
          </p>
          <p className="font-display text-3xl font-bold text-gold">
            {quizStats.currentStreak}
            <span className="ml-1 text-base font-normal text-sage">days</span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-sage">
        {quizStats.completedQuizzes} quizzes completed ·{' '}
        {quizStats.totalXpEarned.toLocaleString()} XP earned
      </p>
    </Card>
  )
}
