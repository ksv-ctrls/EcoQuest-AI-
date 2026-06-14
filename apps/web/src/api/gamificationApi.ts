import { apiClient } from '@/api/apiClient'

export async function syncGamificationState(payload: {
  xp: number
  level: number
  ecoCoins: number
}) {
  const response = await apiClient.put('/progress/user-gamification', payload)
  return response.data
}
