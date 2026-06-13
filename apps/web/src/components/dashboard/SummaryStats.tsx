import { BookOpen, Leaf, Sparkles, Target } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { useLessonProgress } from '@/context/LessonProgressContext'
import { useMissionProgress } from '@/context/MissionProgressContext'
import { useQuizProgress } from '@/context/QuizProgressContext'
import { formatLearningHours } from '@/lib/lesson-labels'
import { formatAccuracy } from '@/lib/quiz-labels'

export function SummaryStats() {
  const { learningStats } = useLessonProgress()
  const { quizStats } = useQuizProgress()
  const { missionStats } = useMissionProgress()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Missions Completed"
        value={missionStats.completedMissions}
        note={`${missionStats.completionRate}% · ${missionStats.currentStreak}-day streak`}
        icon={Target}
      />
      <StatCard
        label="Lessons Completed"
        value={learningStats.completedLessons}
        note={`${learningStats.lessonCompletionPercent}% · ${learningStats.totalLessons} total`}
        icon={BookOpen}
      />
      <StatCard
        label="Quizzes Completed"
        value={quizStats.completedQuizzes}
        note={`${formatAccuracy(quizStats.averageAccuracy)} avg accuracy`}
        icon={Sparkles}
      />
      <StatCard
        label="Impact Score"
        value={missionStats.environmentalImpactScore}
        note={`${formatLearningHours(learningStats.totalLearningHours)} learning time`}
        icon={Leaf}
      />
    </div>
  )
}
