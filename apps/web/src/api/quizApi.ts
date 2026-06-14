import { apiClient } from '@/api/apiClient'

export async function saveQuizResult(payload: {
  quizId: string
  score: number
  accuracy: number
  timeTaken: number
}) {
  const response = await apiClient.post('/progress/quizzes', payload)
  return response.data
}
