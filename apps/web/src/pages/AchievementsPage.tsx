import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useGamification } from '@/context/GamificationContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'

export function AchievementsPage() {
  const { achievements } = useGamification()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Achievements"
        description="Track the badges and milestones you unlock while learning and taking action."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} variant={achievement.unlocked ? 'elevated' : 'interactive'}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{achievement.title}</CardTitle>
                  <CardDescription>{achievement.category.replace('_', ' ')}</CardDescription>
                </div>
                <Badge variant={achievement.unlocked ? 'earned' : 'locked'}>
                  {achievement.unlocked ? 'Unlocked' : 'Locked'}
                </Badge>
              </div>
            </CardHeader>
            <p className="text-sm text-sage">{achievement.description}</p>
            <div className="mt-4 grid gap-2 text-sm text-primary-dark">
              <span>XP reward: {achievement.xpReward}</span>
              <span>EcoCoins reward: {achievement.ecoCoinReward}</span>
              {achievement.unlocked ? (
                <span className="text-xs uppercase tracking-wide text-primary-green">Unlocked</span>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
