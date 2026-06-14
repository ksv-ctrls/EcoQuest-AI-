import { apiClient } from '@/api/apiClient'

export async function saveLessonProgress(payload: {
  lessonId: string
  completed: boolean
}) {
  const response = await apiClient.put('/progress/lessons', payload)
  return response.data
}

export async function getProgressSummary() {
  const response = await apiClient.get<{
    lessons: any[]
    quizzes: any[]
    missions: any[]
    games: any[]
    achievements: any[]
    impactRecords: any[]
  }>('/progress')
  return response.data
}
