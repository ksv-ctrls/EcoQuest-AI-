export type MissionDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type MissionState =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'completed'

export interface ImpactMetric {
  label: string
  unit: string
  targetValue: number
  description: string
}

export interface Mission {
  id: string
  sdgId: string
  sdgNumber: number
  title: string
  description: string
  difficulty: MissionDifficulty
  estimatedMinutes: number
  xpReward: number
  ecoCoinReward: number
  impactMetric: ImpactMetric
  objectives: string[]
  instructions: string[]
  environmentalImpact: string
  relatedLessonId?: string
  relatedQuizId?: string
  isPlaceholder?: boolean
}

export interface MissionSubmission {
  notes: string
  photoName?: string
  photoPreview?: string
  submittedAt: string
}

export interface MissionProgressEntry {
  state: MissionState
  updatedAt: string
  submission?: MissionSubmission
}

export type MissionProgressMap = Record<string, MissionProgressEntry>

export interface SDGMissionCatalog {
  sdgId: string
  sdgNumber: number
  title: string
  overview: string
  color: string
  missions: Mission[]
}

export interface SDGMissionStats {
  sdgId: string
  missionCount: number
  completionPercent: number
  difficulty: MissionDifficulty
  estimatedMinutes: number
  completedCount: number
}

export interface MissionProgressStats {
  totalMissions: number
  completedMissions: number
  completionRate: number
  currentStreak: number
  environmentalImpactScore: number
  activeCount: number
  totalXpEarned: number
  totalEcoCoinsEarned: number
}

export interface DashboardMissionInsight {
  mission: Mission
  sdgColor: string
  state: MissionState
}
