import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface GameInstructionsProps {
  game: GameMetadata
}

export function GameInstructions({ game }: GameInstructionsProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>How to play</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <div className="space-y-3 text-sm leading-relaxed text-sage">
        {game.learningOutcome && (
          <div>
            <p className="font-semibold text-primary-dark">Learning outcome</p>
            <p>{game.learningOutcome}</p>
          </div>
        )}
        {game.completionRule && (
          <div>
            <p className="font-semibold text-primary-dark">Completion rule</p>
            <p>{game.completionRule}</p>
          </div>
        )}
        <p>
          Use sustainability decisions, resource choices, and system thinking to complete this SDG challenge.
        </p>
      </div>
    </Card>
  )
}
