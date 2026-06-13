import type { MissionDifficulty, MissionState } from '@/types/mission'

export const missionDifficultyLabels: Record<MissionDifficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const missionStateLabels: Record<MissionState, string> = {
  locked: 'Locked',
  available: 'Available',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  approved: 'Approved',
  completed: 'Completed',
}

export function formatEcoCoins(amount: number): string {
  return `${amount.toLocaleString()} 🪙`
}
