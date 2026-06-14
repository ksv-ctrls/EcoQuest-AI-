import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { GameMetadata } from '../types/game'

interface SimulationEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

const cityPlannerOptions = [
  { id: 'public-transport', title: 'Expand public transport', description: 'Reduces traffic emissions and boosts access for all.', value: 30 },
  { id: 'green-roofs', title: 'Add green roofs and parks', description: 'Improves flood resilience and urban wellbeing.', value: 25 },
  { id: 'waste-management', title: 'Improve waste management', description: 'Cuts pollution and supports circular use of materials.', value: 20 },
  { id: 'affordable-housing', title: 'Build affordable housing with transit', description: 'Enhances equity and supports compact smart growth.', value: 25 },
]

const forestGuardOptions = [
  { id: 'habitat-restoration', title: 'Restore wildlife habitat', description: 'Rebuilds forest ecosystems and supports biodiversity.', value: 30 },
  { id: 'sustainable-logging', title: 'Implement sustainable forestry', description: 'Balances community needs with ecosystem health.', value: 25 },
  { id: 'invasive-removal', title: 'Remove invasive species', description: 'Protects native plants and animals from threats.', value: 20 },
  { id: 'river-buffer', title: 'Protect river buffers', description: 'Keeps waterways clean and supports connected habitats.', value: 25 },
]

export function SimulationEngine({ game, onComplete }: SimulationEngineProps) {
  const [selected, setSelected] = useState<string[]>([])
  const options =
    game.id === 'sdg-11-city-planner'
      ? cityPlannerOptions
      : game.id === 'sdg-15-forest-guard'
      ? forestGuardOptions
      : cityPlannerOptions

  const score = selected.reduce((sum, id) => {
    const option = options.find((item) => item.id === id)
    return sum + (option?.value ?? 0)
  }, 0)

  const engineDescription =
    game.id === 'sdg-11-city-planner'
      ? 'Select planning actions to make your city safer, more inclusive, and more resilient.'
      : game.id === 'sdg-15-forest-guard'
      ? 'Choose actions that restore healthy forests while balancing community and ecosystem needs.'
      : 'Choose the actions that best improve system resilience.'

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Simulation challenge</CardTitle>
        <CardDescription>{engineDescription}</CardDescription>
      </CardHeader>

      <div className="space-y-4 pt-4">
        <div className="space-y-3">
          {options.map((option) => (
            <Button
              key={option.id}
              variant={selected.includes(option.id) ? 'primary' : 'secondary'}
              className="w-full text-left"
              onClick={() => {
                setSelected((current) =>
                  current.includes(option.id)
                    ? current.filter((item) => item !== option.id)
                    : [...current, option.id],
                )
              }}
            >
              <div>
                <p className="font-semibold text-primary-dark">{option.title}</p>
                <p className="text-sm text-sage">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>

        <ProgressBar value={score} max={100} label="Impact score" />

        <div className="flex justify-end gap-3">
          <Button
            onClick={() =>
              onComplete(
                score,
                `You selected ${selected.length} actions with an impact score of ${score}.`,
              )
            }
          >
            Finish simulation
          </Button>
        </div>
      </div>
    </Card>
  )
}
