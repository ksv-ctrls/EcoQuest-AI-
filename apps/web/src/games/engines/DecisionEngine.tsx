import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface DecisionEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

const climateDecisions = [
  {
    id: 'invest-renewables',
    title: 'Invest in renewable infrastructure',
    score: 35,
    detail: 'A strong renewable program reduces emissions and creates resilient communities.',
  },
  {
    id: 'adapt-urban-heat',
    title: 'Adapt urban heat and flood risk',
    score: 30,
    detail: 'Green infrastructure and flood protection keep people safe during climate shocks.',
  },
  {
    id: 'delay-action',
    title: 'Delay action for short-term savings',
    score: 10,
    detail: 'Postponing climate planning increases long-term costs and community vulnerability.',
  },
]

const defaultDecisions = [
  {
    id: 'strategic-investment',
    title: 'Make a strategic sustainability investment',
    score: 30,
    detail: 'Support long-term systems change with balanced policy and funding.',
  },
  {
    id: 'community-dialogue',
    title: 'Launch a community planning dialogue',
    score: 25,
    detail: 'Engagement helps build shared ownership and better outcomes.',
  },
  {
    id: 'status-quo',
    title: 'Keep the status quo',
    score: 10,
    detail: 'Avoiding change preserves the present but limits future progress.',
  },
]

export function DecisionEngine({ game, onComplete }: DecisionEngineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const decisions = game.id === 'sdg-13-climate-crisis' ? climateDecisions : defaultDecisions
  const engineDescription =
    game.id === 'sdg-13-climate-crisis'
      ? 'Choose the best climate strategy for SDG 13 and see your impact score.'
      : 'Make a sustainability decision and see how it affects your challenge score.'

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Decision challenge</CardTitle>
        <CardDescription>{engineDescription}</CardDescription>
      </CardHeader>

      <div className="space-y-4 pt-4">
        {decisions.map((decision) => (
          <Button
            key={decision.id}
            variant={selectedId === decision.id ? 'primary' : 'secondary'}
            className="w-full text-left"
            onClick={() => setSelectedId(decision.id)}
          >
            <div>
              <p className="font-semibold text-primary-dark">{decision.title}</p>
              <p className="text-sm text-sage">{decision.detail}</p>
            </div>
          </Button>
        ))}

        <div className="flex justify-end gap-3">
          <Button
            disabled={!selectedId}
            onClick={() => {
              const choice = decisions.find((item) => item.id === selectedId)
              if (choice) {
                onComplete(choice.score, `You chose: ${choice.title}. Your climate impact score is ${choice.score}.`)
              }
            }}
          >
            Submit decision
          </Button>
        </div>
      </div>
    </Card>
  )
}
