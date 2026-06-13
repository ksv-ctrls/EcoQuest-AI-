import { Card } from '@/components/ui/Card'
import type { LearningStats } from '@/types/lesson'
import { formatLearningHours } from '@/lib/lesson-labels'
import { BookOpen, Clock, Target } from 'lucide-react'

interface LearningStatsBarProps {
  stats: LearningStats
}

export function LearningStatsBar({ stats }: LearningStatsBarProps) {
  const items = [
    {
      icon: Target,
      label: 'Lesson completion',
      value: `${stats.lessonCompletionPercent}%`,
      detail: `${stats.completedLessons} of ${stats.totalLessons} lessons`,
    },
    {
      icon: BookOpen,
      label: 'In progress',
      value: String(stats.inProgressLessons),
      detail: 'Active lessons',
    },
    {
      icon: Clock,
      label: 'Learning time',
      value: formatLearningHours(stats.totalLearningHours),
      detail: 'Estimated from progress',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} variant="elevated" className="flex items-start gap-3">
          <div className="rounded-lg bg-primary-green/10 p-2">
            <item.icon className="size-5 text-primary-green" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-sage">
              {item.label}
            </p>
            <p className="font-display text-2xl font-bold text-primary-dark">
              {item.value}
            </p>
            <p className="text-xs text-sage">{item.detail}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
