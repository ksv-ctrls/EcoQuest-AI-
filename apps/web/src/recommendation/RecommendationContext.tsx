import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { buildRecommendationItem, buildAnalyticsSummary, saveAnalyticsSummary } from './recommendation-engine'
import type { RecommendationAnalytics, RecommendationRuleContext } from './recommendation-types'
import { useUserProfile } from '@/context/UserProfileContext'
import { useLessonProgress } from '@/context/LessonProgressContext'
import { useQuizProgress } from '@/context/QuizProgressContext'
import { useMissionProgress } from '@/context/MissionProgressContext'
import { useGameProgress } from '@/games/context/GameProgressContext'
import { getLessonById } from '@/data/mock/lesson-catalog'
import { getQuizById } from '@/data/mock/quiz-catalog'
import { getMissionById } from '@/data/mock/mission-catalog'
import { GAMES_METADATA } from '@/games/configs'
import { useAuth } from '@/context/AuthContext'
import { fetchRecommendations } from '@/api/recommendationApi'

interface RecommendationContextValue {
  recommendation: RecommendationAnalytics
  analyticsSummary: ReturnType<typeof buildAnalyticsSummary>
}

const RecommendationContext = createContext<RecommendationContextValue | null>(null)

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const { profile, ecoProfile } = useUserProfile()
  const { progress: lessonProgress } = useLessonProgress()
  const { results: quizResults } = useQuizProgress()
  const { progress: missionProgress } = useMissionProgress()
  const { gameProgress } = useGameProgress()
  const { isAuthenticated } = useAuth()

  const [backendRec, setBackendRec] = useState<{
    recommendedSdgId: string | null
    recommendedLessonId: string | null
    recommendedQuizId: string | null
    recommendedMissionId: string | null
    recommendedGameId: string | null
  } | null>(null)

  const ruleContext = useMemo<RecommendationRuleContext>(
    () => ({ profile, ecoProfile, lessonProgress, quizResults, missionProgress, gameProgress }),
    [profile, ecoProfile, lessonProgress, quizResults, missionProgress, gameProgress],
  )

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendations()
        .then((data) => {
          if (data) {
            setBackendRec(data)
          }
        })
        .catch((err) => {
          console.warn('Failed to fetch recommendations from backend:', err)
        })
    } else {
      setBackendRec(null)
    }
  }, [isAuthenticated, ruleContext])

  const recommendation = useMemo(() => {
    if (backendRec) {
      return {
        recommendedLesson: backendRec.recommendedLessonId ? getLessonById(backendRec.recommendedLessonId) ?? null : null,
        recommendedQuiz: backendRec.recommendedQuizId ? getQuizById(backendRec.recommendedQuizId) ?? null : null,
        recommendedMission: backendRec.recommendedMissionId ? getMissionById(backendRec.recommendedMissionId) ?? null : null,
        recommendedGame: backendRec.recommendedGameId ? GAMES_METADATA.find((game) => game.id === backendRec.recommendedGameId) ?? null : null,
        recommendedSdgId: backendRec.recommendedSdgId,
      }
    }

    const item = buildRecommendationItem(ruleContext)
    return {
      recommendedLesson: item.lessonId ? getLessonById(item.lessonId) ?? null : null,
      recommendedQuiz: item.quizId ? getQuizById(item.quizId) ?? null : null,
      recommendedMission: item.missionId ? getMissionById(item.missionId) ?? null : null,
      recommendedGame: item.gameId ? GAMES_METADATA.find((game) => game.id === item.gameId) ?? null : null,
      recommendedSdgId: item.sdgGoalId,
    }
  }, [backendRec, ruleContext])

  const analyticsSummary = useMemo(() => buildAnalyticsSummary(ruleContext), [ruleContext])

  useEffect(() => {
    saveAnalyticsSummary(analyticsSummary)
  }, [analyticsSummary])

  return (
    <RecommendationContext.Provider value={{ recommendation, analyticsSummary }}>
      {children}
    </RecommendationContext.Provider>
  )
}

export function useRecommendation() {
  const ctx = useContext(RecommendationContext)
  if (!ctx) {
    throw new Error('useRecommendation must be used within RecommendationProvider')
  }
  return ctx
}
