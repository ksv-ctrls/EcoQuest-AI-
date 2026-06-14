import { apiClient } from '@/api/apiClient'

export async function fetchRecommendations() {
  const response = await apiClient.get('/recommendations')
  return response.data
}
