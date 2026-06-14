import { apiClient } from '@/api/apiClient'

export interface ImpactRecordPayload {
  waterSaved: number
  treesPlanted: number
  co2Reduced: number
  plasticAvoided: number
}

export async function fetchImpactRecords() {
  const response = await apiClient.get('/progress/impact')
  return response.data
}

export async function saveImpactRecord(payload: ImpactRecordPayload) {
  const response = await apiClient.post('/progress/impact', payload)
  return response.data
}
