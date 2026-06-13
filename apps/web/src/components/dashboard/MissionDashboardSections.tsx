import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { MissionInsightCard } from '@/components/missions/MissionCard'
import { MissionStatsBar } from '@/components/missions/MissionStatsBar'
import { useMissionProgress } from '@/context/MissionProgressContext'

export function ActiveMissionsSection() {
  const { activeMissions } = useMissionProgress()

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Active Missions</CardTitle>
      </CardHeader>
      {activeMissions.length > 0 ? (
        <ul className="space-y-2">
          {activeMissions.map((insight) => (
            <li key={insight.mission.id}>
              <MissionInsightCard {...insight} compact />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-sage">No active missions. Start one from the catalog.</p>
      )}
      <Link
        to="/missions"
        className="mt-4 inline-block text-sm font-medium text-primary-green hover:underline"
      >
        Browse all missions →
      </Link>
    </Card>
  )
}

export function MissionImpactSection() {
  const { missionStats } = useMissionProgress()

  return (
    <Card variant="elevated" className="border-primary-green/20">
      <CardHeader>
        <CardTitle>Real-World Impact</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sage">
            Completion rate
          </p>
          <p className="font-display text-3xl font-bold text-primary-dark">
            {missionStats.completionRate}%
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sage">
            Mission streak
          </p>
          <p className="font-display text-3xl font-bold text-gold">
            {missionStats.currentStreak}
            <span className="ml-1 text-base font-normal text-sage">days</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-sage">
        Environmental impact score:{' '}
        <span className="font-semibold text-primary-green">
          {missionStats.environmentalImpactScore.toLocaleString()} units
        </span>
      </p>
    </Card>
  )
}

export function RecommendedMissionSection() {
  const { recommendedMission } = useMissionProgress()

  return (
    <Card variant="elevated" className="border-gold/20 bg-gold/5">
      <CardHeader>
        <CardTitle>Recommended Mission</CardTitle>
      </CardHeader>
      {recommendedMission ? (
        <MissionInsightCard {...recommendedMission} />
      ) : (
        <p className="text-sm text-sage">All available missions completed!</p>
      )}
    </Card>
  )
}

export function MissionDashboardStatsBar() {
  const { missionStats } = useMissionProgress()
  return <MissionStatsBar stats={missionStats} />
}
