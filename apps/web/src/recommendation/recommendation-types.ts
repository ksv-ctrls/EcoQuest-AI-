import type { UserProfile, EcoProfile } from '@/types/user'
import type { Lesson, LessonProgressMap } from '@/types/lesson'
import type { Quiz, QuizSessionResult } from '@/types/quiz'
import type { Mission, MissionProgressMap } from '@/types/mission'
import type { GameMetadata, GameProgress } from '@/games/types/game'

export interface RecommendationItem {
  lessonId: string | null
  quizId: string | null
  missionId: string | null
  gameId: string | null
  sdgGoalId: string | null
}

export interface RecommendationRuleContext {
  profile: UserProfile | null
  ecoProfile: EcoProfile | null
  lessonProgress: LessonProgressMap
  quizResults: QuizSessionResult[]
  missionProgress: MissionProgressMap
  gameProgress: Record<string, GameProgress>
}

export interface RecommendationAnalytics {
  recommendedLesson: Lesson | null
  recommendedQuiz: Quiz | null
  recommendedMission: Mission | null
  recommendedGame: GameMetadata | null
  recommendedSdgId: string | null
}
