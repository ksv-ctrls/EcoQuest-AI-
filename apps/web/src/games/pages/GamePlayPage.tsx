import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { useGameProgress } from '@/games/context/GameProgressContext'
import { useGamification } from '@/context/GamificationContext'
import { getGameById, GAMES_METADATA } from '@/games/configs'
import { GameInstructions } from '@/games/components/GameInstructions'
import { GameStats } from '@/games/components/GameStats'
import { GameResults } from '@/games/components/GameResults'
import { DecisionEngine } from '@/games/engines/DecisionEngine'
import { SimulationEngine } from '@/games/engines/SimulationEngine'
import { ResourceEngine } from '@/games/engines/ResourceEngine'
import { DragDropEngine } from '@/games/engines/DragDropEngine'
import { PuzzleEngine } from '@/games/engines/PuzzleEngine'
import { MatchingEngine } from '@/games/engines/MatchingEngine'
import { StrategyEngine } from '@/games/engines/StrategyEngine'
import { QuizEngine } from '@/games/engines/QuizEngine'

export function GamePlayPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { gameProgress, unlockGame, recordGameAttempt, completeGame, updateGameProgress } = useGameProgress()
  const { trackGameComplete } = useGamification()
  const game = useMemo(() => getGameById(gameId ?? ''), [gameId])
  const progress = game ? gameProgress[game.id] : undefined
  const [result, setResult] = useState<{ score: number; summary: string } | null>(null)

  useEffect(() => {
    if (game) {
      unlockGame(game.id)
    }
  }, [game, unlockGame])

  useEffect(() => {
    if (progress?.isCompleted) {
      setResult({ score: progress.bestScore ?? 0, summary: game?.completedDescription ?? '' })
    }
  }, [progress, game])

  if (!game) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Game not found</CardTitle>
            <CardDescription>The requested SDG mini-game does not exist yet.</CardDescription>
          </CardHeader>
          <div className="mt-4">
            <Button onClick={() => navigate('/games')} variant="secondary">Back to game catalog</Button>
          </div>
        </Card>
      </div>
    )
  }

  const handleComplete = (score: number, summary: string) => {
    recordGameAttempt(game.id)
    completeGame(game, score)
    trackGameComplete(game.id, game.title, game.sdgIds, game.xpReward, game.ecoCoinReward)
    updateGameProgress(game.id, { progressValue: 100 })
    setResult({ score, summary })
  }

  const handleRetry = () => {
    updateGameProgress(game.id, { isCompleted: false, bestScore: undefined, progressValue: 0 })
    setResult(null)
  }

  const renderEngine = () => {
    if (result) {
      return (
        <GameResults
          score={result.score}
          summary={result.summary}
          xpEarned={game.xpReward}
          ecoCoinsEarned={game.ecoCoinReward}
          educationalFacts={game.educationalFacts}
          onRetry={handleRetry}
        />
      )
    }

    switch (game.engine) {
      case 'strategy':
        return <StrategyEngine game={game} onComplete={handleComplete} />
      case 'decision':
        return <DecisionEngine game={game} onComplete={handleComplete} />
      case 'simulation':
        return <SimulationEngine game={game} onComplete={handleComplete} />
      case 'resource':
        return <ResourceEngine game={game} onComplete={handleComplete} />
      case 'sorting':
        return <DragDropEngine game={game} onComplete={handleComplete} />
      case 'matching':
        return <MatchingEngine game={game} onComplete={handleComplete} />
      case 'quiz':
        return <QuizEngine game={game} onComplete={handleComplete} />
      case 'puzzle':
        return <PuzzleEngine game={game} onComplete={handleComplete} />
      default:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Engine unavailable</CardTitle>
              <CardDescription>This game type is not supported in the current milestone.</CardDescription>
            </CardHeader>
          </Card>
        )
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title={game.title}
        description={game.description}
      />

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <GameInstructions game={game} />
          {renderEngine()}
        </div>
        <div className="space-y-6">
          <GameStats game={game} progress={progress} />
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Other examples</CardTitle>
              <CardDescription>Jump between example SDG games.</CardDescription>
            </CardHeader>
            <ul className="space-y-3">
              {GAMES_METADATA.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Button
                    variant={item.id === game.id ? 'secondary' : 'outline'}
                    className="w-full justify-between"
                    onClick={() => navigate(`/games/${item.id}`)}
                  >
                    <span>{item.title}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-sage">SDG {item.sdgIds[0]}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
