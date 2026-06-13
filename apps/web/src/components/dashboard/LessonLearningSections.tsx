import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  LessonInsightCard,
  LessonInsightSection,
} from '@/components/lessons/LessonInsightCard'
import { useLessonProgress } from '@/context/LessonProgressContext'

export function ContinueLearningSection() {
  const { continueLearning } = useLessonProgress()

  return (
    <LessonInsightSection
      title="Continue Learning"
      insight={continueLearning}
      emptyMessage="Start a lesson from the catalog to begin your journey."
      variant="highlight"
    />
  )
}

export function RecommendedLessonSection() {
  const { recommendedLesson } = useLessonProgress()

  return (
    <LessonInsightSection
      title="Recommended Lesson"
      insight={recommendedLesson}
      emptyMessage="Complete more lessons to unlock personalized recommendations."
    />
  )
}

export function RecentlyCompletedSection() {
  const { recentlyCompleted } = useLessonProgress()

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Recently Completed</CardTitle>
      </CardHeader>
      {recentlyCompleted.length > 0 ? (
        <ul className="space-y-2">
          {recentlyCompleted.map((insight) => (
            <li key={insight.lesson.id}>
              <LessonInsightCard insight={insight} variant="compact" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-sage">No completed lessons yet.</p>
      )}
      <Link
        to="/lessons"
        className="mt-4 inline-block text-sm font-medium text-primary-green hover:underline"
      >
        Browse all lessons →
      </Link>
    </Card>
  )
}
