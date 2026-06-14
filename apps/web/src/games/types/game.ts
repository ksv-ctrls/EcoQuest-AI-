export type GameEngineType =
  | 'matching'
  | 'sorting'
  | 'puzzle'
  | 'strategy'
  | 'simulation'
  | 'quiz'
  | 'decision'
  | 'resource'
  | 'drag-drop'

export interface GameMetadata {
  id: string
  title: string
  description: string
  sdgIds: string[]
  engine: GameEngineType
  xpReward: number
  ecoCoinReward: number
  completedDescription: string
  difficulty: 'easy' | 'medium' | 'hard'
  badgeId?: string
  learningOutcome?: string
  completionRule?: string
  educationalFacts?: string[]
}

export interface GameProgress {
  gameId: string
  isUnlocked: boolean
  isCompleted: boolean
  bestScore?: number
  lastPlayedAt?: string
  progressValue?: number
  timesPlayed: number
  completionCount: number
  averageScore: number
}

export interface GameSessionState {
  gameId: string
  currentLevel?: number
  score: number
  movesRemaining?: number
  challengeIndex?: number
  statePayload?: Record<string, unknown>
}
