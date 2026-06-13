import { Card } from '@/components/ui/Card'
import type { MissionProgressStats } from '@/types/mission'
import { formatEcoCoins } from '@/lib/mission-labels'
import { Flame, Leaf, Target, Trophy } from 'lucide-react'

interface MissionStatsBarProps {
  stats: MissionProgressStats
}

export function MissionStatsBar({ stats }: MissionStatsBarProps) {
  const items = [
    {
      icon: Target,
      label: 'Completion rate',
      value: `${stats.completionRate}%`,
      detail: `${stats.completedMissions} of ${stats.totalMissions} missions`,
    },
    {
      icon: Flame,
      label: 'Mission streak',
      value: String(stats.currentStreak),
      detail: stats.currentStreak === 1 ? 'Day active' : 'Days active',
    },
    {
      icon: Leaf,
      label: 'Impact score',
      value: stats.environmentalImpactScore.toLocaleString(),
      detail: 'Combined impact units earned',
    },
    {
      icon: Trophy,
      label: 'Rewards earned',
      value: formatEcoCoins(stats.totalEcoCoinsEarned),
      detail: `${stats.totalXpEarned} XP from missions`,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} variant="elevated" className="flex items-start gap-3">
          <div className="rounded-lg bg-primary-green/10 p-2">
            <item.icon className="size-5 text-primary-green" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-sage">
              {item.label}
            </p>
            <p className="font-display text-2xl font-bold text-primary-dark">{item.value}</p>
            <p className="text-xs text-sage">{item.detail}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
