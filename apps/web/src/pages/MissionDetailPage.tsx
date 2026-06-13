import { Navigate, useParams } from 'react-router-dom'
import { MissionDetail } from '@/components/missions/MissionDetail'
import { getMissionById, getSdgMissionCatalog } from '@/data/mock/mission-catalog'

export function MissionDetailPage() {
  const { sdgId, missionId } = useParams<{ sdgId: string; missionId: string }>()

  if (!sdgId || !missionId) return <Navigate to="/missions" replace />

  const catalog = getSdgMissionCatalog(sdgId)
  const mission = getMissionById(missionId)

  if (!catalog || !mission || mission.sdgId !== sdgId) {
    return <Navigate to="/missions" replace />
  }

  return (
    <MissionDetail
      mission={mission}
      sdgTitle={catalog.title}
      sdgColor={catalog.color}
    />
  )
}
