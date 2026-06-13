import type { QuizDifficulty, QuestionType } from '@/types/quiz'

export const quizDifficultyLabels: Record<QuizDifficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  match: 'Match the Following',
  scenario: 'Scenario-Based',
}

export function formatTimeTaken(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy)}%`
}
