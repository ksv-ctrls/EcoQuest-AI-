import { BadgePanel } from '@/components/dashboard/BadgePanel'
import {
  ContinueLearningSection,
  RecentlyCompletedSection,
  RecommendedLessonSection,
} from '@/components/dashboard/LessonLearningSections'
import {
  ActiveMissionsSection,
  MissionImpactSection,
  RecommendedMissionSection,
} from '@/components/dashboard/MissionDashboardSections'
import {
  LevelProgressCard,
  WeeklyGoalCard,
} from '@/components/dashboard/LevelProgressCard'
import { LessonProgressList } from '@/components/dashboard/LessonProgressList'
import {
  QuizAccuracySection,
  RecentQuizResultsSection,
  RecommendedQuizSection,
} from '@/components/dashboard/QuizDashboardSections'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { SummaryStats } from '@/components/dashboard/SummaryStats'
import { PageHeader } from '@/components/layout/PageHeader'
import { mockDashboardData } from '@/data/mock/dashboard'
import { mockUser } from '@/data/mock/user'

export function DashboardPage() {
  const data = mockDashboardData

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title={`Welcome back, ${mockUser.displayName}! 🌱`}
        description="You're making great progress on your environmental journey."
      />

      <SummaryStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <ContinueLearningSection />
        <RecommendedMissionSection />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecommendedQuizSection />
        <RecommendedLessonSection />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <ActiveMissionsSection />
          <LessonProgressList />
          <RecentQuizResultsSection />
          <QuickActions />
        </div>

        <div className="space-y-6">
          <MissionImpactSection />
          <QuizAccuracySection />
          <RecentlyCompletedSection />
          <LevelProgressCard levelProgress={data.levelProgress} />
          <BadgePanel badges={data.badges} />
          <WeeklyGoalCard weeklyGoal={data.weeklyGoal} />
        </div>
      </div>
    </div>
  )
}
