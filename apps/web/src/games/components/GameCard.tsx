import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata, GameProgress } from '../types/game'

interface GameCardProps {
  game: GameMetadata
  progress?: GameProgress
}

export function GameCard({ game, progress }: GameCardProps) {
  const status = progress?.isCompleted
    ? 'Completed'
    : progress?.isUnlocked
    ? 'Unlocked'
    : 'Locked'

  return (
    <Card variant="interactive" className="group h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{game.title}</CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </div>
          <Badge variant={status === 'Completed' ? 'earned' : status === 'Unlocked' ? 'default' : 'locked'}>
            {status}
          </Badge>
        </div>
      </CardHeader>

      <div className="mt-4 space-y-3 text-sm text-sage">
        <p>
          <span className="font-semibold text-primary-dark">Engine:</span> {game.engine}
        </p>
        <p>
          <span className="font-semibold text-primary-dark">XP:</span> {game.xpReward} • <span className="font-semibold text-primary-dark">EcoCoins:</span> {game.ecoCoinReward}
        </p>
        <p>
          <span className="font-semibold text-primary-dark">Difficulty:</span> {game.difficulty === 'easy' ? 'Beginner' : game.difficulty === 'medium' ? 'Intermediate' : 'Advanced'}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          to={`/games/${game.id}`}
          className="rounded-full bg-primary-green px-4 py-2 text-sm font-semibold text-cream transition hover:bg-primary-green/90"
        >
          Play
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-sage">{game.sdgIds.map((id) => `SDG ${id}`).join(', ')}</span>
      </div>
    </Card>
  )
}
