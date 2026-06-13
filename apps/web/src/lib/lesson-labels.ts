import type { LessonDifficulty, LessonStatus } from '@/types/lesson'

export const difficultyLabels: Record<LessonDifficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const statusLabels: Record<LessonStatus, string> = {
  not_started: 'Not Started',
  started: 'Started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatLearningHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`
}
