import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import type { Challenge } from '@/types/dashboard'

const difficultyStyles = {
  easy: 'bg-primary-green/15 text-primary-green',
  medium: 'bg-gold/15 text-gold',
  hard: 'bg-primary-dark/10 text-primary-dark',
} as const

interface ChallengeListProps {
  challenges: Challenge[]
}

export function ChallengeList({ challenges }: ChallengeListProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Active Challenges</CardTitle>
      </CardHeader>
      <ul className="space-y-3">
        {challenges.map((challenge) => (
          <li
            key={challenge.id}
            className="rounded-lg border border-primary-green/20 bg-primary-green/5 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-primary-dark">{challenge.title}</h4>
              <span
                className={cn(
                  'rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                  difficultyStyles[challenge.difficulty],
                )}
              >
                {challenge.difficulty}
              </span>
              <span className="ml-auto text-sm font-semibold text-gold">
                {challenge.points} pts
              </span>
            </div>
            <p className="mt-1 text-sm text-sage">{challenge.description}</p>
            <Button size="sm" className="mt-3" disabled>
              Start
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
