import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { useGameProgress } from '@/games/context/GameProgressContext'
import { GAMES_METADATA } from '@/games/configs'
import { useUserProfile } from '@/context/UserProfileContext'
import { mockSdgGoals } from '@/data/mock/sdg'

function getSdgTitle(sdgId: string) {
  return mockSdgGoals.find((goal) => goal.id === sdgId)?.title ?? sdgId
}

export function GameAnalyticsSection() {
  const { gameProgress } = useGameProgress()
  const completedGames = Object.values(gameProgress).filter((entry) => entry.isCompleted)
  const playedGames = Object.values(gameProgress).filter((entry) => entry.timesPlayed > 0)
  const averageScore = playedGames.length
    ? Math.round(
        playedGames.reduce((sum, entry) => sum + (entry.averageScore ?? 0), 0) / playedGames.length,
      )
    : 0

  const lowPerformanceGames = playedGames
    .filter((entry) => entry.averageScore > 0)
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3)

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Game analytics</CardTitle>
        <CardDescription>
          See how your SDG game practice is shaping up and where to focus next.
        </CardDescription>
      </CardHeader>
      <div className="mt-4 grid gap-4 text-sm text-sage">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-cream p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-sage">Completed games</p>
            <p className="mt-2 text-xl font-semibold text-primary-dark">{completedGames.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-sage">Games played</p>
            <p className="mt-2 text-xl font-semibold text-primary-dark">{playedGames.length}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-wide text-sage">Average score</p>
          <p className="mt-2 text-xl font-semibold text-primary-dark">{averageScore}%</p>
          <p className="mt-2">Keep playing to improve your SDG mastery across the platform.</p>
        </div>

        <div className="rounded-3xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-wide text-sage">Focus areas</p>
          {lowPerformanceGames.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm">
              {lowPerformanceGames.map((entry) => {
                const game = GAMES_METADATA.find((item) => item.id === entry.gameId)
                return (
                  <li key={entry.gameId}>
                    <span className="font-medium text-primary-dark">{game?.title ?? entry.gameId}</span>
                    <span className="ml-2 text-sage">{entry.averageScore}% average</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-2">Play any SDG mini-game to start receiving performance insights.</p>
          )}
        </div>
      </div>
    </Card>
  )
}

export function RecommendedGameSection() {
  const { profile } = useUserProfile()
  const { gameProgress } = useGameProgress()
  const preferredSdgs = profile?.impactAreas ?? []

  const recommendedGame = GAMES_METADATA.find((game) => {
    const hasPreferred = preferredSdgs.includes(`sdg-${game.sdgIds[0]}`)
    const progress = gameProgress[game.id]
    return hasPreferred && !progress?.isCompleted
  }) ?? GAMES_METADATA.find((game) => !gameProgress[game.id]?.isCompleted)

  return (
    <Card variant="elevated" className="border-gold/20 bg-gold/5">
      <CardHeader>
        <CardTitle>Recommended SDG game</CardTitle>
        <CardDescription>
          Personalized game recommendations based on your most focused SDG areas.
        </CardDescription>
      </CardHeader>
      <div className="mt-4 space-y-4 text-sm text-sage">
        {recommendedGame ? (
          <>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Title</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{recommendedGame.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">SDG focus</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendedGame.sdgIds.map((sdgId) => (
                  <Chip key={sdgId}>{getSdgTitle(`sdg-${sdgId}`)}</Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Why this game?</p>
              <p className="mt-2 text-sage">
                {preferredSdgs.length > 0
                  ? `This game helps deepen your understanding of ${getSdgTitle(preferredSdgs[0])}.`
                  : 'Choose a game to start building your SDG impact skills.'}
              </p>
            </div>
            <Link
              to={`/games/${recommendedGame.id}`}
              className="inline-flex rounded-full bg-primary-green px-4 py-2 text-sm font-semibold text-cream transition hover:bg-primary-green/90"
            >
              Play recommended game
            </Link>
          </>
        ) : (
          <p>No SDG game recommendation available yet. Complete a profile to enable recommendations.</p>
        )}
      </div>
    </Card>
  )
}
