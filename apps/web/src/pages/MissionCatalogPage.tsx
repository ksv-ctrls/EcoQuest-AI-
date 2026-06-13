import { PageHeader } from '@/components/layout/PageHeader'
import { MissionStatsBar } from '@/components/missions/MissionStatsBar'
import { SDGMissionCatalogCard } from '@/components/missions/SDGMissionCatalogCard'
import { useMissionProgress } from '@/context/MissionProgressContext'
import {
  getAllSdgMissionCatalogs,
  getSdgMissionStats,
} from '@/data/mock/mission-catalog'

export function MissionCatalogPage() {
  const { progress, missionStats } = useMissionProgress()
  const catalogs = getAllSdgMissionCatalogs()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Real-World Missions"
        description="Apply what you learn through hands-on environmental actions tied to every SDG."
      />
      <MissionStatsBar stats={missionStats} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {catalogs.map((catalog) => (
          <SDGMissionCatalogCard
            key={catalog.sdgId}
            catalog={catalog}
            stats={getSdgMissionStats(catalog.sdgId, progress)!}
          />
        ))}
      </div>
    </div>
  )
}
