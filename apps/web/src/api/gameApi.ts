import { apiClient } from '@/api/apiClient'

export async function saveGameProgress(payload: {
  gameId: string
  score: number
  completed: boolean
  completionTime: number
}) {
  const response = await apiClient.put('/progress/games', payload)
  return response.data
}
