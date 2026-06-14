import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface DragDropEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

const waterTasks = [
  { id: 'river', label: 'Protect river source', correct: true },
  { id: 'recycle', label: 'Burn recycling waste', correct: false },
  { id: 'treatment', label: 'Treat wastewater', correct: true },
  { id: 'pollute', label: 'Dump chemicals into lake', correct: false },
  { id: 'restore-wetlands', label: 'Restore wetlands and riparian buffers', correct: true },
]

export function DragDropEngine({ game, onComplete }: DragDropEngineProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const tasks = game.id === 'sdg-6-water-sort' ? waterTasks : []

  const score = tasks.reduce((sum, task) => {
    const choice = selected[task.id]
    if (choice === undefined) return sum
    return sum + (choice === task.correct ? 20 : -10)
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Water systems challenge</CardTitle>
        <CardDescription>
          Choose the best water protection actions and avoid pollution to safeguard SDG 6.
        </CardDescription>
      </CardHeader>

      <div className="space-y-4 pt-4">
        <div className="grid gap-3">
          {tasks.map((task) => (
            <Button
              key={task.id}
              variant={selected[task.id] ? 'primary' : 'secondary'}
              className="w-full text-left"
              onClick={() => setSelected((current) => ({ ...current, [task.id]: !current[task.id] }))}
            >
              <div>
                <p className="font-semibold text-primary-dark">{task.label}</p>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={() =>
              onComplete(
                Math.max(score, 0),
                `You made ${Object.keys(selected).length} water protection choices and scored ${Math.max(score, 0)}.`,
              )
            }
          >
            Submit selections
          </Button>
        </div>
      </div>
    </Card>
  )
}
