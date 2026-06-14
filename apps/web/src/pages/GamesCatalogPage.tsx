import { GAMES_METADATA } from '@/games/configs'
import { useGameProgress } from '@/games/context/GameProgressContext'
import { GameCard } from '@/games/components/GameCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'

export function GamesCatalogPage() {
  const { gameProgress } = useGameProgress()
  const unlockedCount = Object.values(gameProgress).filter((entry) => entry.isUnlocked).length
  const completedCount = Object.values(gameProgress).filter((entry) => entry.isCompleted).length

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="SDG Mini Games"
        description="Explore eco-challenges tied to every Sustainable Development Goal and earn XP by completing interactive games."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Total games</CardTitle>
          </CardHeader>
          <p className="mt-4 text-3xl font-semibold text-primary-dark">{GAMES_METADATA.length}</p>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Unlocked</CardTitle>
          </CardHeader>
          <p className="mt-4 text-3xl font-semibold text-primary-dark">{unlockedCount}</p>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <p className="mt-4 text-3xl font-semibold text-primary-dark">{completedCount}</p>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Reward potential</CardTitle>
          </CardHeader>
          <p className="mt-4 text-sm text-sage">
            Complete games to earn XP, EcoCoins, and SDG mastery badges.
          </p>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {GAMES_METADATA.map((game) => (
          <GameCard key={game.id} game={game} progress={gameProgress[game.id]} />
        ))}
      </div>
    </div>
  )
}
