import type { ActivityTimelineItem } from '@/types/gamification'

export interface PersonalImpactMetrics {
  waterSavedLiters: number
  treesPlanted: number
  co2ReducedKg: number
  plasticAvoidedKg: number
  missionsCompleted: number
  quizzesCompleted: number
  gamesPlayed: number
  learningHours: number
}

export interface SdgProgressMetric {
  sdgId: string
  sdgNumber: number
  title: string
  color: string
  learningPercent: number
  quizPercent: number
  missionPercent: number
  gamePercent: number
  overallMasteryPercent: number
}

export interface WeeklySustainabilityReport {
  weekStart: string
  weekEnd: string
  lessonsCompleted: number
  quizzesCompleted: number
  missionsCompleted: number
  gamesCompleted: number
  learningHours: number
  waterSavedLiters: number
  co2ReducedKg: number
  plasticAvoidedKg: number
  summary: string
}

export interface ImpactAiInsight {
  title: string
  description: string
  tone: 'strength' | 'growth' | 'next-step'
}

export interface ImpactAnalytics {
  personalImpact: PersonalImpactMetrics
  sdgProgress: SdgProgressMetric[]
  timeline: ActivityTimelineItem[]
  weeklyReport: WeeklySustainabilityReport
  insights: ImpactAiInsight[]
  impactScore: number
  averageSdgMastery: number
}

export interface ImpactContextValue extends ImpactAnalytics {}
