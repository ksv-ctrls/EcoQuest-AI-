import { BookOpen, Droplets, Gamepad2, Leaf, Recycle, Sparkles, Target, TreePine } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import type { PersonalImpactMetrics } from '@/impact/types/impact'

interface ImpactMetricGridProps {
  metrics: PersonalImpactMetrics
}

export function ImpactMetricGrid({ metrics }: ImpactMetricGridProps) {
  const items = [
    { label: 'Water Saved', value: `${metrics.waterSavedLiters} L`, icon: Droplets },
    { label: 'Trees Planted', value: metrics.treesPlanted, icon: TreePine },
    { label: 'CO2 Reduced', value: `${metrics.co2ReducedKg} kg`, icon: Leaf },
    { label: 'Plastic Avoided', value: `${metrics.plasticAvoidedKg} kg`, icon: Recycle },
    { label: 'Missions Completed', value: metrics.missionsCompleted, icon: Target },
    { label: 'Quizzes Completed', value: metrics.quizzesCompleted, icon: Sparkles },
    { label: 'Games Played', value: metrics.gamesPlayed, icon: Gamepad2 },
    { label: 'Learning Hours', value: metrics.learningHours, icon: BookOpen },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label} variant="elevated">
            <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">{item.label}</CardTitle>
              <Icon className="h-5 w-5 text-primary-green" aria-hidden="true" />
            </CardHeader>
            <p className="text-2xl font-semibold text-primary-dark">{item.value}</p>
          </Card>
        )
      })}
    </div>
  )
}
