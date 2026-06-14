import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface StrategyAction {
  id: string
  label: string
  impact: number
  detail: string
}

interface StrategyEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

export function StrategyEngine({ game, onComplete }: StrategyEngineProps) {
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  const actions: StrategyAction[] = useMemo(() => {
    switch (game.id) {
      case 'sdg-8-jobs-lift':
        return [
          { id: 'a', label: 'Train workers for green industries', impact: 30, detail: 'Build skills for sustainable jobs.' },
          { id: 'b', label: 'Support small business innovation', impact: 20, detail: 'Help local firms grow responsibly.' },
          { id: 'c', label: 'Strengthen labor rights', impact: 25, detail: 'Create safe and fair work environments.' },
        ]
      case 'sdg-9-innovation-hub':
        return [
          { id: 'a', label: 'Invest in green infrastructure', impact: 30, detail: 'Modern systems for resilient growth.' },
          { id: 'b', label: 'Enable inclusive manufacturing', impact: 25, detail: 'Bring more communities into supply chains.' },
          { id: 'c', label: 'Accelerate research partnerships', impact: 20, detail: 'Boost innovation through collaboration.' },
        ]
      case 'sdg-17-partnership-bridge':
        return [
          { id: 'a', label: 'Share technology across borders', impact: 30, detail: 'Spread innovation for global impact.' },
          { id: 'b', label: 'Coordinate climate finance', impact: 25, detail: 'Fund high-impact sustainable projects.' },
          { id: 'c', label: 'Empower local leadership', impact: 20, detail: 'Amplify community-led progress.' },
        ]
      default:
        return []
    }
  }, [game.id])

  const currentScore = selectedActions.reduce((sum, id) => {
    const action = actions.find((item) => item.id === id)
    return sum + (action?.impact ?? 0)
  }, 0)

  const handleToggle = (id: string) => {
    setSelectedActions((current) =>
      current.includes(id) ? current.filter((action) => action !== id) : [...current, id]
    )
  }

  const handleComplete = () => {
    const score = Math.min(currentScore, actions.reduce((sum, action) => sum + action.impact, 0))
    onComplete(score, `Selected ${selectedActions.length} strategic actions for ${game.title}.`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Strategy challenge</CardTitle>
        <CardDescription>Choose the strongest actions to maximize sustainable impact.</CardDescription>
      </CardHeader>

      <div className="space-y-4 pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={selectedActions.includes(action.id) ? 'primary' : 'outline'}
              className="flex flex-col items-start gap-2 p-4 text-left"
              onClick={() => handleToggle(action.id)}
            >
              <span className="font-semibold">{action.label}</span>
              <span className="text-sm text-slate-600">{action.detail}</span>
              <span className="rounded-full bg-cream px-2 py-1 text-xs uppercase tracking-[0.2em] text-sage">
                Impact {action.impact}
              </span>
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-muted bg-muted p-4 text-sm">
          <div>
            <p className="font-semibold">Current choice power</p>
            <p>{currentScore} impact points</p>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Select the strongest combination and submit when ready.</p>
        </div>

        <div className="flex justify-end">
          <Button disabled={selectedActions.length === 0} onClick={handleComplete}>
            Complete strategy
          </Button>
        </div>
      </div>
    </Card>
  )
}
