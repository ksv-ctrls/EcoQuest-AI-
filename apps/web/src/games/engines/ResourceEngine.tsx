import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface ResourceEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

const resources = [
  { id: 'housing', title: 'Allocate resources for housing', score: 35 },
  { id: 'healthcare', title: 'Invest in community healthcare', score: 40 },
  { id: 'education', title: 'Fund education access', score: 45 },
  { id: 'short-term-savings', title: 'Save budget for later', score: 10 },
]

export function ResourceEngine({ game, onComplete }: ResourceEngineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Resource allocation</CardTitle>
        <CardDescription>
          Choose the most impact-focused investment for SDG 1 poverty reduction.
        </CardDescription>
      </CardHeader>

      <div className="space-y-4 pt-4">
        {resources.map((resource) => (
          <Button
            key={resource.id}
            variant={selectedId === resource.id ? 'primary' : 'secondary'}
            className="w-full text-left"
            onClick={() => setSelectedId(resource.id)}
          >
            <div>
              <p className="font-semibold text-primary-dark">{resource.title}</p>
            </div>
          </Button>
        ))}

        <div className="flex justify-end gap-3">
          <Button
            disabled={!selectedId}
            onClick={() => {
              const choice = resources.find((item) => item.id === selectedId)
              if (choice) {
                onComplete(choice.score, `You allocated resources to ${choice.title}. Poverty reduction impact score: ${choice.score}.`)
              }
            }}
          >
            Allocate resources
          </Button>
        </div>
      </div>
    </Card>
  )
}
