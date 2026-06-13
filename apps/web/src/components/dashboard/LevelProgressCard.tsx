import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { LevelProgress, WeeklyGoal } from '@/types/dashboard'

interface LevelProgressCardProps {
  levelProgress: LevelProgress
}

export function LevelProgressCard({ levelProgress }: LevelProgressCardProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Level Progress</CardTitle>
      </CardHeader>
      <div className="mb-2 flex justify-between text-sm text-sage">
        <span>Level {levelProgress.currentLevel}</span>
        <span>Level {levelProgress.nextLevel}</span>
      </div>
      <ProgressBar value={levelProgress.progressPercent} variant="gold" />
      <p className="mt-3 text-sm text-sage">
        {levelProgress.pointsToNext} more points to reach Level{' '}
        {levelProgress.nextLevel}
      </p>
    </Card>
  )
}

interface WeeklyGoalCardProps {
  weeklyGoal: WeeklyGoal
}

export function WeeklyGoalCard({ weeklyGoal }: WeeklyGoalCardProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Weekly Goal</CardTitle>
      </CardHeader>
      <p className="text-sm text-sage">{weeklyGoal.label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-primary-dark">
        {weeklyGoal.current}
        <span className="text-gold">/{weeklyGoal.target}</span>
      </p>
    </Card>
  )
}
