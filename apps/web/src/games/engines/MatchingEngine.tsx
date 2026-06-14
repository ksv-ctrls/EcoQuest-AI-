import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface MatchPair {
  id: string
  left: string
  right: string
}

interface MatchingEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

export function MatchingEngine({ game, onComplete }: MatchingEngineProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [completedPairs, setCompletedPairs] = useState<string[]>([])
  const [incorrectCount, setIncorrectCount] = useState(0)

  const pairs: MatchPair[] = useMemo(() => {
    switch (game.id) {
      case 'sdg-2-food-chain':
        return [
          { id: 'a', left: 'Sustainable farming', right: 'Healthy food access' },
          { id: 'b', left: 'Crop diversity', right: 'Resilient harvests' },
          { id: 'c', left: 'Waste reduction', right: 'Lower food loss' },
        ]
      case 'sdg-5-equality-match':
        return [
          { id: 'a', left: 'Equal pay policies', right: 'Fair workplace' },
          { id: 'b', left: 'Leadership mentoring', right: 'More women in decision-making' },
          { id: 'c', left: 'Education access', right: 'Stronger gender equity' },
        ]
      case 'sdg-14-ocean-keeper':
        return [
          { id: 'a', left: 'Marine protected areas', right: 'Healthy coral reefs' },
          { id: 'b', left: 'Sustainable fishing', right: 'Stable seafood supply' },
          { id: 'c', left: 'Pollution control', right: 'Cleaner coastal waters' },
        ]
      default:
        return []
    }
  }, [game.id])

  const leftOptions = pairs.map((pair) => ({ value: pair.id, label: pair.left }))
  const rightOptions = pairs.map((pair) => ({ value: pair.id, label: pair.right }))

  const completedCount = completedPairs.length
  const score = completedCount * 30 - incorrectCount * 10
  const isComplete = completedCount === pairs.length

  const description =
    game.id === 'sdg-2-food-chain'
      ? 'Match food system solutions to resilient outcomes for Zero Hunger.'
      : game.id === 'sdg-5-equality-match'
      ? 'Pair equality actions with the right social outcomes to support gender justice.'
      : 'Match ocean protection actions with healthy marine results.'

  const handleSelection = () => {
    if (selectedLeft && selectedRight) {
      const match = pairs.find((pair) => pair.id === selectedLeft && pair.id === selectedRight)
      if (match && !completedPairs.includes(match.id)) {
        setCompletedPairs((current) => [...current, match.id])
      } else {
        setIncorrectCount((current) => current + 1)
      }
      setSelectedLeft(null)
      setSelectedRight(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Matching challenge</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <div className="space-y-5 pt-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="font-semibold text-primary-dark">Options</p>
            {leftOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedLeft === option.value ? 'primary' : completedPairs.includes(option.value) ? 'secondary' : 'outline'}
                className="w-full text-left"
                onClick={() => setSelectedLeft(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-primary-dark">Matches</p>
            {rightOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedRight === option.value ? 'primary' : completedPairs.includes(option.value) ? 'secondary' : 'outline'}
                className="w-full text-left"
                onClick={() => setSelectedRight(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-cream px-3 py-2 text-xs uppercase tracking-[0.3em] text-sage">
            Matches completed: {completedCount}/{pairs.length}
          </span>
          <span className="rounded-full bg-cream px-3 py-2 text-xs uppercase tracking-[0.3em] text-sage">
            Incorrect attempts: {incorrectCount}
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            disabled={!selectedLeft || !selectedRight}
            onClick={handleSelection}
          >
            Confirm pair
          </Button>
          <Button
            variant="secondary"
            disabled={!isComplete}
            onClick={() => onComplete(Math.max(score, 0), `Matched ${completedCount} pairs with a score of ${Math.max(score, 0)}.`)}
          >
            Complete matching
          </Button>
        </div>
      </div>
    </Card>
  )
}
