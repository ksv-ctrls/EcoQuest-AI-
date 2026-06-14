import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface PuzzleEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

const puzzleSteps = [
  { id: 'access', label: 'Expand school access for every child' },
  { id: 'curriculum', label: 'Update curriculum with sustainability skills' },
  { id: 'teachers', label: 'Train teachers in inclusive learning methods' },
]

export function PuzzleEngine({ game, onComplete }: PuzzleEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    if (currentIndex < puzzleSteps.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return
    }
    onComplete(100, 'You mapped a complete SDG 4 learning ecosystem.')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Puzzle journey</CardTitle>
        <CardDescription>
          Complete the step-by-step education puzzle for SDG 4.
        </CardDescription>
      </CardHeader>

      <div className="space-y-4 pt-4">
        <div className="rounded-3xl border border-border bg-cream p-5 text-sm text-sage">
          <p className="font-semibold text-primary-dark">Step {currentIndex + 1}</p>
          <p>{puzzleSteps[currentIndex].label}</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={handleNext}>{currentIndex < puzzleSteps.length - 1 ? 'Next step' : 'Finish puzzle'}</Button>
        </div>
      </div>
    </Card>
  )
}
