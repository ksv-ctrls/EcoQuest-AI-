import { Card } from '@/components/ui/Card'
import type { QuizProgressStats } from '@/types/quiz'
import { formatAccuracy } from '@/lib/quiz-labels'
import { Flame, Sparkles, Target, Trophy } from 'lucide-react'

interface QuizStatsBarProps {
  stats: QuizProgressStats
}

export function QuizStatsBar({ stats }: QuizStatsBarProps) {
  const items = [
    {
      icon: Target,
      label: 'Quiz completion',
      value: `${stats.quizCompletionPercent}%`,
      detail: `${stats.completedQuizzes} of ${stats.totalQuizzes} quizzes`,
    },
    {
      icon: Trophy,
      label: 'Quiz accuracy',
      value: formatAccuracy(stats.averageAccuracy),
      detail: 'Average across all attempts',
    },
    {
      icon: Flame,
      label: 'Quiz streak',
      value: String(stats.currentStreak),
      detail: stats.currentStreak === 1 ? 'Day in a row' : 'Days in a row',
    },
    {
      icon: Sparkles,
      label: 'XP earned',
      value: stats.totalXpEarned.toLocaleString(),
      detail: 'From quiz sessions',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} variant="elevated" className="flex items-start gap-3">
          <div className="rounded-lg bg-gold/10 p-2">
            <item.icon className="size-5 text-gold" />
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
