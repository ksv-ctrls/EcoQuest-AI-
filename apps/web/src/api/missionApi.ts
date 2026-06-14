import { apiClient } from '@/api/apiClient'

export async function submitMissionProgress(payload: {
  missionId: string
  notes: string
  imageUrl?: string
  status?: string
}) {
  const response = await apiClient.post('/progress/missions', payload)
  return response.data
}
