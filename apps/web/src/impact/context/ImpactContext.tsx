import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAiTutor } from '@/ai/context/AiTutorContext'
import { useGamification } from '@/context/GamificationContext'
import { useLessonProgress } from '@/context/LessonProgressContext'
import { useMissionProgress } from '@/context/MissionProgressContext'
import { useQuizProgress } from '@/context/QuizProgressContext'
import { useGameProgress } from '@/games/context/GameProgressContext'
import { buildImpactAnalytics } from '@/impact/data/impact-analytics-engine'
import type { ImpactContextValue } from '@/impact/types/impact'
import { useAuth } from '@/context/AuthContext'
import { getProgressSummary } from '@/api/lessonApi'

const ImpactContext = createContext<ImpactContextValue | null>(null)

export function ImpactProvider({ children }: { children: ReactNode }) {
  const { progress: lessonProgress } = useLessonProgress()
  const { results: quizResults } = useQuizProgress()
  const { progress: missionProgress } = useMissionProgress()
  const { gameProgress } = useGameProgress()
  const { activityTimeline, badges } = useGamification()
  const { stats: tutorStats } = useAiTutor()
  const { isAuthenticated } = useAuth()

  const [dbImpactRecords, setDbImpactRecords] = useState<any[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      getProgressSummary()
        .then((data) => {
          if (data && data.impactRecords) {
            setDbImpactRecords(data.impactRecords)
          }
        })
        .catch((err) => {
          console.warn('Failed to sync impact records from backend:', err)
        })
    } else {
      setDbImpactRecords([])
    }
  }, [isAuthenticated, lessonProgress, quizResults, missionProgress, gameProgress])

  const value = useMemo(
    () =>
      buildImpactAnalytics({
        lessonProgress,
        quizResults,
        missionProgress,
        gameProgress,
        activityTimeline,
        badges,
        tutorStats,
        impactRecords: dbImpactRecords,
      }),
    [activityTimeline, badges, gameProgress, lessonProgress, missionProgress, quizResults, tutorStats, dbImpactRecords],
  )

  return <ImpactContext.Provider value={value}>{children}</ImpactContext.Provider>
}

export function useImpact() {
  const ctx = useContext(ImpactContext)
  if (!ctx) {
    throw new Error('useImpact must be used within ImpactProvider')
  }
  return ctx
}
