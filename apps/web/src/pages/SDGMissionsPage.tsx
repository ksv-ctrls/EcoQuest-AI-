import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { MissionCard } from '@/components/missions/MissionCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useMissionProgress } from '@/context/MissionProgressContext'
import {
  getMissionsBySdgId,
  getSdgMissionCatalog,
  getSdgMissionStats,
} from '@/data/mock/mission-catalog'
import { missionDifficultyLabels } from '@/lib/mission-labels'
import { formatDuration } from '@/lib/lesson-labels'

export function SDGMissionsPage() {
  const { sdgId } = useParams<{ sdgId: string }>()
  const { progress, getState } = useMissionProgress()

  if (!sdgId) return <Navigate to="/missions" replace />

  const catalog = getSdgMissionCatalog(sdgId)
  if (!catalog) return <Navigate to="/missions" replace />

  const stats = getSdgMissionStats(sdgId, progress)!
  const missions = getMissionsBySdgId(sdgId)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link to="/missions">
        <Button variant="outline" size="sm">
          <ArrowLeft className="size-4" />
          All mission paths
        </Button>
      </Link>

      <Card variant="elevated" className="overflow-hidden p-0">
        <div className="h-2" style={{ backgroundColor: catalog.color }} />
        <div className="p-6 sm:p-8">
          <PageHeader
            title={`SDG ${catalog.sdgNumber}: ${catalog.title} Missions`}
            description={catalog.overview}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Missions" value={String(stats.missionCount)} />
            <Stat label="Completion" value={`${stats.completionPercent}%`} />
            <Stat label="Difficulty" value={missionDifficultyLabels[stats.difficulty]} />
            <Stat label="Est. time" value={formatDuration(stats.estimatedMinutes)} />
          </div>
          <div className="mt-6">
            <ProgressBar
              value={stats.completionPercent}
              variant="gold"
              label="SDG mission completion"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            sdgColor={catalog.color}
            state={getState(mission.id)}
          />
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-cream px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-sage">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-primary-dark">{value}</p>
    </div>
  )
}
