import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { GameMetadata, GameProgress } from '../types/game'

interface GameStatsProps {
  game: GameMetadata
  progress?: GameProgress
}

export function GameStats({ game, progress }: GameStatsProps) {
  const score = progress?.bestScore ?? 0
  const progressValue = progress?.progressValue ?? 0
  const timesPlayed = progress?.timesPlayed ?? 0
  const averageScore = progress?.averageScore ?? 0

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Game stats</CardTitle>
        <CardDescription>Track your performance and reward progress.</CardDescription>
      </CardHeader>

      <div className="space-y-4 text-sm text-sage">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-primary-dark">XP reward</p>
            <p>{game.xpReward}</p>
          </div>
          <div>
            <p className="font-semibold text-primary-dark">EcoCoins reward</p>
            <p>{game.ecoCoinReward}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-primary-dark">Best score</p>
            <p>{score}</p>
          </div>
          <div>
            <p className="font-semibold text-primary-dark">Progress</p>
            <p>{progress?.isCompleted ? 'Completed' : progress?.isUnlocked ? `${progressValue}%` : 'Locked'}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-primary-dark">Times played</p>
            <p>{timesPlayed}</p>
          </div>
          <div>
            <p className="font-semibold text-primary-dark">Average score</p>
            <p>{averageScore}</p>
          </div>
        </div>

        <ProgressBar value={progressValue} label="Completion" />
      </div>
    </Card>
  )
}
