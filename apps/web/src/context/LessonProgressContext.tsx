import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getLearningStats,
  getLessonStatus,
  allLessons,
} from '@/data/mock/lesson-catalog'
import { saveLessonProgress, getProgressSummary } from '@/api/lessonApi'
import { useAuth } from '@/context/AuthContext'
import { mockSdgGoals } from '@/data/mock/sdg'
import type {
  DashboardLessonInsight,
  LearningStats,
  Lesson,
  LessonProgressMap,
  LessonStatus,
} from '@/types/lesson'

const STORAGE_KEY = 'ecoquest-lesson-progress'

const defaultProgress: LessonProgressMap = {
  'water-conservation': {
    status: 'completed',
    updatedAt: '2026-06-01T10:00:00.000Z',
  },
  'water-quality-protection': {
    status: 'started',
    updatedAt: '2026-06-08T14:00:00.000Z',
  },
  'climate-basics': {
    status: 'completed',
    updatedAt: '2026-05-28T09:00:00.000Z',
  },
  'carbon-footprint': {
    status: 'completed',
    updatedAt: '2026-06-02T11:00:00.000Z',
  },
  'sustainable-cities': {
    status: 'in_progress',
    updatedAt: '2026-06-10T16:00:00.000Z',
  },
  'green-transport': {
    status: 'started',
    updatedAt: '2026-06-11T08:00:00.000Z',
  },
  'biodiversity-conservation': {
    status: 'in_progress',
    updatedAt: '2026-06-09T12:00:00.000Z',
  },
  'wildlife-india': {
    status: 'started',
    updatedAt: '2026-06-12T09:30:00.000Z',
  },
  'renewable-energy': {
    status: 'completed',
    updatedAt: '2026-05-20T10:00:00.000Z',
  },
}

function loadProgress(): LessonProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    return { ...defaultProgress, ...JSON.parse(raw) } as LessonProgressMap
  } catch {
    return defaultProgress
  }
}

function saveProgress(progress: LessonProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function statusProgressPercent(status: LessonStatus): number {
  switch (status) {
    case 'completed':
      return 100
    case 'in_progress':
      return 55
    case 'started':
      return 20
    default:
      return 0
  }
}

function toInsight(lesson: Lesson, progress: LessonProgressMap): DashboardLessonInsight {
  const sdg = mockSdgGoals.find((goal) => goal.id === lesson.sdgId)
  const status = getLessonStatus(lesson.id, progress)

  return {
    lesson,
    sdgId: lesson.sdgId,
    sdgTitle: sdg?.title ?? `SDG ${lesson.sdgNumber}`,
    sdgColor: sdg?.color ?? '#276152',
    status,
    progressPercent: statusProgressPercent(status),
  }
}

interface LessonProgressContextValue {
  progress: LessonProgressMap
  learningStats: LearningStats
  getStatus: (lessonId: string) => LessonStatus
  markStarted: (lessonId: string) => void
  markInProgress: (lessonId: string) => void
  markCompleted: (lessonId: string) => void
  continueLearning: DashboardLessonInsight | null
  recommendedLesson: DashboardLessonInsight | null
  recentlyCompleted: DashboardLessonInsight[]
  activeLessons: DashboardLessonInsight[]
}

const LessonProgressContext = createContext<LessonProgressContextValue | null>(
  null,
)

export function LessonProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LessonProgressMap>(loadProgress)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      getProgressSummary()
        .then((data) => {
          if (data && data.lessons) {
            setProgress((prev) => {
              const next = { ...prev }
              data.lessons.forEach((item: any) => {
                const local = prev[item.lessonId]
                if (!local || new Date(item.updatedAt || 0) > new Date(local.updatedAt || 0) || item.completed) {
                  next[item.lessonId] = {
                    status: item.completed ? 'completed' : 'started',
                    updatedAt: item.updatedAt || new Date().toISOString(),
                  }
                }
              })
              saveProgress(next)
              return next
            })
          }
        })
        .catch((err) => {
          console.warn('Failed to sync lesson progress from backend:', err)
        })
    }
  }, [isAuthenticated])

  const updateProgress = useCallback(
    (lessonId: string, status: LessonStatus) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          [lessonId]: { status, updatedAt: new Date().toISOString() },
        }
        saveProgress(next)
        void saveLessonProgress({
          lessonId,
          completed: status === 'completed',
        }).catch(() => {
          // Local storage remains the source of truth when the API is unavailable.
        })
        return next
      })
    },
    [],
  )

  const getStatus = useCallback(
    (lessonId: string) => getLessonStatus(lessonId, progress),
    [progress],
  )

  const markStarted = useCallback(
    (lessonId: string) => {
      const current = getLessonStatus(lessonId, progress)
      if (current === 'not_started') {
        updateProgress(lessonId, 'started')
      }
    },
    [progress, updateProgress],
  )

  const markInProgress = useCallback(
    (lessonId: string) => {
      const current = getLessonStatus(lessonId, progress)
      if (current !== 'completed' && current !== 'in_progress') {
        updateProgress(lessonId, 'in_progress')
      }
    },
    [progress, updateProgress],
  )

  const markCompleted = useCallback(
    (lessonId: string) => {
      updateProgress(lessonId, 'completed')
    },
    [updateProgress],
  )

  const learningStats = useMemo(
    () => getLearningStats(progress),
    [progress],
  )

  const insights = useMemo(
    () => allLessons.map((lesson) => toInsight(lesson, progress)),
    [progress],
  )

  const continueLearning = useMemo(() => {
    const priority: LessonStatus[] = ['in_progress', 'started']
    for (const status of priority) {
      const match = insights.find((item) => item.status === status)
      if (match) return match
    }
    return (
      insights.find((item) => item.status === 'not_started' && item.lesson.content) ??
      null
    )
  }, [insights])

  const recommendedLesson = useMemo(() => {
    if (continueLearning?.status === 'not_started') return continueLearning

    const incomplete = insights.filter(
      (item) =>
        item.status !== 'completed' &&
        item.lesson.content &&
        item.lesson.id !== continueLearning?.lesson.id,
    )

    return incomplete[0] ?? null
  }, [insights, continueLearning])

  const recentlyCompleted = useMemo(() => {
    return insights
      .filter((item) => item.status === 'completed')
      .sort((a, b) => {
        const aTime = progress[a.lesson.id]?.updatedAt ?? ''
        const bTime = progress[b.lesson.id]?.updatedAt ?? ''
        return bTime.localeCompare(aTime)
      })
      .slice(0, 3)
  }, [insights, progress])

  const activeLessons = useMemo(() => {
    return insights
      .filter(
        (item) =>
          item.status === 'in_progress' ||
          item.status === 'started' ||
          item.status === 'completed',
      )
      .sort((a, b) => b.progressPercent - a.progressPercent)
      .slice(0, 6)
  }, [insights])

  const value = useMemo(
    () => ({
      progress,
      learningStats,
      getStatus,
      markStarted,
      markInProgress,
      markCompleted,
      continueLearning,
      recommendedLesson,
      recentlyCompleted,
      activeLessons,
    }),
    [
      progress,
      learningStats,
      getStatus,
      markStarted,
      markInProgress,
      markCompleted,
      continueLearning,
      recommendedLesson,
      recentlyCompleted,
      activeLessons,
    ],
  )

  return (
    <LessonProgressContext.Provider value={value}>
      {children}
    </LessonProgressContext.Provider>
  )
}

export function useLessonProgress() {
  const context = useContext(LessonProgressContext)
  if (!context) {
    throw new Error('useLessonProgress must be used within LessonProgressProvider')
  }
  return context
}
