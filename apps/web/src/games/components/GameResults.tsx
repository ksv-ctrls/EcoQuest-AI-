import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

interface GameResultsProps {
  score: number
  summary: string
  xpEarned?: number
  ecoCoinsEarned?: number
  educationalFacts?: string[]
  onRetry: () => void
}

export function GameResults({ score, summary, xpEarned, ecoCoinsEarned, educationalFacts, onRetry }: GameResultsProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Challenge complete</CardTitle>
        <CardDescription>
          You finished the game. Review your performance and your rewards.
        </CardDescription>
      </CardHeader>
      <div className="space-y-4 text-sm text-sage">
        <div>
          <p className="font-semibold text-primary-dark">Final score</p>
          <p>{score}</p>
        </div>
        {typeof xpEarned === 'number' && (
          <div>
            <p className="font-semibold text-primary-dark">XP earned</p>
            <p>{xpEarned}</p>
          </div>
        )}
        {typeof ecoCoinsEarned === 'number' && (
          <div>
            <p className="font-semibold text-primary-dark">EcoCoins earned</p>
            <p>{ecoCoinsEarned}</p>
          </div>
        )}
        <p>{summary}</p>
        {educationalFacts?.length ? (
          <div className="rounded-lg border border-muted bg-cream p-4">
            <p className="font-semibold text-primary-dark">Learning insights</p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {educationalFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="mt-5 flex justify-end">
        <Button variant="secondary" onClick={onRetry}>Play again</Button>
      </div>
    </Card>
  )
}
