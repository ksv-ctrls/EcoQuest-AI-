export type GamificationEventType =
  | 'lesson_start'
  | 'lesson_complete'
  | 'quiz_complete'
  | 'quiz_bonus'
  | 'mission_start'
  | 'mission_submit'
  | 'mission_complete'
  | 'game_complete'
  | 'daily_login'
  | 'streak_bonus'
  | 'achievement_unlock'
  | 'badge_collect'
  | 'challenge_complete'
  | 'reward_purchase'

export interface GamificationEvent {
  id: string
  eventType: GamificationEventType
  label: string
  description: string
  xpPoints: number
  ecoCoins: number
  createdAt: string
  metadata?: Record<string, unknown>
}

export type AchievementCategory = 'learning' | 'quiz' | 'mission' | 'general'

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  category: AchievementCategory
  xpReward: number
  ecoCoinReward: number
}

export interface AchievementState extends AchievementDefinition {
  unlocked: boolean
  unlockedAt?: string
}

export type BadgeCategory =
  | 'beginner'
  | 'water'
  | 'climate'
  | 'forest'
  | 'champion'

export interface BadgeDefinition {
  id: string
  name: string
  icon: string
  description: string
  category: BadgeCategory
}

export interface BadgeState extends BadgeDefinition {
  unlocked: boolean
  unlockedAt?: string
}

export type RewardCategory = 'avatar' | 'title' | 'theme'

export interface RewardDefinition {
  id: string
  title: string
  description: string
  category: RewardCategory
  cost: number
  icon: string
}

export interface RewardPurchase {
  rewardId: string
  purchasedAt: string
}

export type ChallengeEventType =
  | 'lesson_complete'
  | 'quiz_complete'
  | 'mission_complete'
  | 'daily_login'

export interface DailyChallengeDefinition {
  id: string
  title: string
  description: string
  eventType: ChallengeEventType
  target: number
  xpReward: number
  ecoCoinReward: number
}

export interface DailyChallengeStatus extends DailyChallengeDefinition {
  progress: number
  completed: boolean
  completedAt?: string
}

export interface StreakSummary {
  currentStreak: number
  weeklyStreak: number
  longestStreak: number
  nextBonusDate: string | null
}

export interface LevelSummary {
  currentLevel: number
  totalXp: number
  xpToNextLevel: number
  progressPercent: number
  nextLevel: number
  nextRewardPreview: string
}

export interface EcoCoinSummary {
  balance: number
  lifetimeEarned: number
  lifetimeSpent: number
}

export interface ActivityTimelineItem {
  id: string
  type: string
  title: string
  description: string
  date: string
}

import type { QuizSessionResult } from '@/types/quiz'

export interface GamificationContextValue {
  totalXp: number
  levelSummary: LevelSummary
  ecoCoinSummary: EcoCoinSummary
  streakSummary: StreakSummary
  activityTimeline: ActivityTimelineItem[]
  achievements: AchievementState[]
  badges: BadgeState[]
  dailyChallenges: DailyChallengeStatus[]
  rewardPurchases: RewardPurchase[]
  availableRewards: RewardDefinition[]
  trackLessonStart: (lessonId: string, sdgId: string) => void
  trackLessonComplete: (lessonId: string, sdgId: string) => void
  trackQuizComplete: (result: QuizSessionResult) => void
  trackMissionStart: (missionId: string, sdgId: string) => void
  trackMissionSubmit: (missionId: string, sdgId: string) => void
  trackMissionComplete: (missionId: string, sdgId: string) => void
  trackGameComplete: (gameId: string, gameTitle: string, sdgIds: string[], xpReward: number, ecoCoinReward: number) => void
  purchaseReward: (rewardId: string) => void
}
