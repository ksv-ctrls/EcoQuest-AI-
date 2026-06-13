import { Link } from 'react-router-dom'
import { Lock, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Mission, MissionState } from '@/types/mission'
import {
  formatEcoCoins,
  missionDifficultyLabels,
  missionStateLabels,
} from '@/lib/mission-labels'
import { formatDuration } from '@/lib/lesson-labels'
import { cn } from '@/lib/cn'

interface MissionCardProps {
  mission: Mission
  sdgColor: string
  state: MissionState
}

const stateStyles: Record<MissionState, string> = {
  locked: 'text-sage',
  available: 'text-primary-green',
  in_progress: 'text-gold',
  submitted: 'text-gold',
  approved: 'text-primary-green',
  completed: 'text-primary-green',
}

export function MissionCard({ mission, sdgColor, state }: MissionCardProps) {
  const path = `/missions/${mission.sdgId}/${mission.id}`
  const isLocked = state === 'locked' || mission.isPlaceholder

  return (
    <Card variant="elevated" className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge
          variant="sdg"
          style={{ backgroundColor: sdgColor }}
          className="rounded-md px-2 py-0.5 text-[10px]"
        >
          SDG {mission.sdgNumber}
        </Badge>
        <span className="rounded-full bg-primary-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-green">
          {missionDifficultyLabels[mission.difficulty]}
        </span>
      </div>

      <h3 className="font-display text-lg font-semibold text-primary-dark">
        {mission.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-sage">{mission.description}</p>

      <div className="mt-3 space-y-1 text-xs text-sage">
        <p>{formatDuration(mission.estimatedMinutes)} · {mission.impactMetric.label}</p>
        <p className="flex items-center gap-2">
          <Sparkles className="size-3 text-gold" />
          {mission.xpReward} XP · {formatEcoCoins(mission.ecoCoinReward)}
        </p>
        <p className={cn('font-medium', stateStyles[state])}>
          {missionStateLabels[state]}
        </p>
      </div>

      <div className="mt-4">
        {isLocked ? (
          <Button variant="secondary" size="sm" className="w-full" disabled>
            <Lock className="size-4" />
            Coming soon
          </Button>
        ) : (
          <Link to={path}>
            <Button variant="primary" size="sm" className="w-full">
              {state === 'completed'
                ? 'View mission'
                : state === 'in_progress' || state === 'submitted' || state === 'approved'
                  ? 'Continue'
                  : 'Start mission'}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}

interface MissionInsightCardProps {
  mission: Mission
  sdgColor: string
  state: MissionState
  compact?: boolean
}

export function MissionInsightCard({
  mission,
  sdgColor,
  state,
  compact,
}: MissionInsightCardProps) {
  const path = `/missions/${mission.sdgId}/${mission.id}`

  if (compact) {
    return (
      <Link
        to={path}
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-cream px-4 py-3 transition-colors hover:border-primary-green/40"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-primary-dark">{mission.title}</p>
          <p className={cn('text-xs font-medium', stateStyles[state])}>
            {missionStateLabels[state]}
          </p>
        </div>
        <Badge variant="sdg" style={{ backgroundColor: sdgColor }} className="shrink-0 text-[10px]">
          SDG {mission.sdgNumber}
        </Badge>
      </Link>
    )
  }

  return (
    <Card variant="elevated">
      <Badge
        variant="sdg"
        style={{ backgroundColor: sdgColor }}
        className="mb-3 rounded-md px-2 py-0.5 text-[10px]"
      >
        SDG {mission.sdgNumber}
      </Badge>
      <h4 className="font-display text-lg font-semibold text-primary-dark">{mission.title}</h4>
      <p className={cn('mt-1 text-sm font-medium', stateStyles[state])}>
        {missionStateLabels[state]}
      </p>
      <Link to={path} className="mt-4 inline-block">
        <Button variant="primary" size="sm">
          Open mission
        </Button>
      </Link>
    </Card>
  )
}
