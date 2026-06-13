import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  allQuizzes,
  getBestResultForQuiz,
  getQuizById,
  getQuizProgressStats,
} from '@/data/mock/quiz-catalog'
import { getMissionForSdg } from '@/data/mock/mission-catalog'
import { mockSdgGoals } from '@/data/mock/sdg'
import { buildQuizResult } from '@/lib/quiz-engine'
import type {
  DashboardQuizInsight,
  Quiz,
  QuizAnswer,
  QuizQuestion,
  QuizSessionResult,
} from '@/types/quiz'
import { gradeAnswer } from '@/lib/quiz-engine'

const STORAGE_KEY = 'ecoquest-quiz-results'

const defaultResults: QuizSessionResult[] = [
  {
    quizId: 'climate-basics-quiz',
    lessonId: 'climate-basics',
    sdgId: 'sdg-13',
    sdgNumber: 13,
    quizTitle: 'Climate Change Basics Quiz',
    startTime: '2026-06-11T10:00:00.000Z',
    completionTime: '2026-06-11T10:08:30.000Z',
    timeTakenSeconds: 510,
    correctCount: 4,
    totalQuestions: 5,
    score: 40,
    accuracy: 80,
    xpEarned: 40,
    strengthAreas: ['Climate fundamentals', 'Climate action'],
    improvementAreas: ['Weather vs climate'],
    recommendedLessonId: 'carbon-footprint',
    recommendedMissionId: 'climate-action-week',
  },
  {
    quizId: 'water-conservation-quiz',
    lessonId: 'water-conservation',
    sdgId: 'sdg-6',
    sdgNumber: 6,
    quizTitle: 'Water Conservation Strategies Quiz',
    startTime: '2026-06-10T14:00:00.000Z',
    completionTime: '2026-06-10T14:06:00.000Z',
    timeTakenSeconds: 360,
    correctCount: 5,
    totalQuestions: 5,
    score: 50,
    accuracy: 100,
    xpEarned: 50,
    strengthAreas: [
      'Fresh water availability',
      'Household conservation',
      'Water-saving methods',
    ],
    improvementAreas: [],
    recommendedLessonId: 'water-quality-protection',
    recommendedMissionId: 'water-week',
  },
]

function loadResults(): QuizSessionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultResults
    const parsed = JSON.parse(raw) as QuizSessionResult[]
    return parsed.length > 0 ? parsed : defaultResults
  } catch {
    return defaultResults
  }
}

function saveResults(results: QuizSessionResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
}

function toInsight(quiz: Quiz, results: QuizSessionResult[]): DashboardQuizInsight {
  const sdg = mockSdgGoals.find((goal) => goal.id === quiz.sdgId)
  const best = getBestResultForQuiz(quiz.id, results)

  return {
    quiz,
    sdgId: quiz.sdgId,
    sdgTitle: sdg?.title ?? `SDG ${quiz.sdgNumber}`,
    sdgColor: sdg?.color ?? '#276152',
    lastResult: results
      .filter((r) => r.quizId === quiz.id)
      .sort((a, b) => b.completionTime.localeCompare(a.completionTime))[0],
    bestAccuracy: best?.accuracy ?? 0,
  }
}

interface ActiveSession {
  quizId: string
  startTime: string
  answers: QuizAnswer[]
  currentIndex: number
}

interface QuizProgressContextValue {
  results: QuizSessionResult[]
  quizStats: ReturnType<typeof getQuizProgressStats>
  recentResults: QuizSessionResult[]
  recommendedQuiz: DashboardQuizInsight | null
  getBestAccuracy: (quizId: string) => number
  hasCompleted: (quizId: string) => boolean
  startSession: (quizId: string) => ActiveSession | null
  submitAnswer: (
    session: ActiveSession,
    question: QuizQuestion,
    value: QuizAnswer['value'],
  ) => QuizAnswer
  completeSession: (
    session: ActiveSession,
    quiz: Quiz,
  ) => QuizSessionResult
  saveResult: (result: QuizSessionResult) => void
}

const QuizProgressContext = createContext<QuizProgressContextValue | null>(null)

export function QuizProgressProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<QuizSessionResult[]>(loadResults)

  const quizStats = useMemo(() => getQuizProgressStats(results), [results])

  const recentResults = useMemo(
    () =>
      [...results]
        .sort((a, b) => b.completionTime.localeCompare(a.completionTime))
        .slice(0, 3),
    [results],
  )

  const insights = useMemo(
    () => allQuizzes.map((quiz) => toInsight(quiz, results)),
    [results],
  )

  const recommendedQuiz = useMemo(() => {
    const withContent = insights.filter((item) => item.quiz.questions?.length)
    const notCompleted = withContent.filter((item) => !item.lastResult)
    if (notCompleted.length > 0) return notCompleted[0]!

    const lowestScore = withContent
      .filter((item) => item.bestAccuracy > 0 && item.bestAccuracy < 100)
      .sort((a, b) => a.bestAccuracy - b.bestAccuracy)
    return lowestScore[0] ?? withContent[0] ?? null
  }, [insights])

  const getBestAccuracy = useCallback(
    (quizId: string) => getBestResultForQuiz(quizId, results)?.accuracy ?? 0,
    [results],
  )

  const hasCompleted = useCallback(
    (quizId: string) => results.some((r) => r.quizId === quizId),
    [results],
  )

  const startSession = useCallback((quizId: string): ActiveSession | null => {
    const quiz = getQuizById(quizId)
    if (!quiz?.questions?.length) return null

    return {
      quizId,
      startTime: new Date().toISOString(),
      answers: [],
      currentIndex: 0,
    }
  }, [])

  const submitAnswer = useCallback(
    (
      _session: ActiveSession,
      question: QuizQuestion,
      value: QuizAnswer['value'],
    ): QuizAnswer => {
      const isCorrect = gradeAnswer(question, value)
      return { questionId: question.id, isCorrect, value }
    },
    [],
  )

  const completeSession = useCallback(
    (session: ActiveSession, quiz: Quiz): QuizSessionResult => {
      const mission =
        getMissionForSdg(quiz.sdgId) ?? { id: 'climate-action-week' }
      const lessonFallback = quiz.lessonId

      const improvementTopics = session.answers
        .map((a, i) => ({
          correct: a.isCorrect,
          topic: quiz.questions![i]?.topic ?? '',
        }))
        .filter((t) => !t.correct)
        .map((t) => t.topic)

      const recommendedLessonId =
        improvementTopics.length > 0
          ? quiz.lessonId
          : getQuizzesBySdgLesson(quiz.sdgId, quiz.lessonId) ?? lessonFallback

      return buildQuizResult(
        quiz,
        session.answers,
        session.startTime,
        new Date().toISOString(),
        recommendedLessonId,
        mission.id,
      )
    },
    [],
  )

  const saveResult = useCallback((result: QuizSessionResult) => {
    setResults((prev) => {
      const next = [result, ...prev]
      saveResults(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      results,
      quizStats,
      recentResults,
      recommendedQuiz,
      getBestAccuracy,
      hasCompleted,
      startSession,
      submitAnswer,
      completeSession,
      saveResult,
    }),
    [
      results,
      quizStats,
      recentResults,
      recommendedQuiz,
      getBestAccuracy,
      hasCompleted,
      startSession,
      submitAnswer,
      completeSession,
      saveResult,
    ],
  )

  return (
    <QuizProgressContext.Provider value={value}>
      {children}
    </QuizProgressContext.Provider>
  )
}

function getQuizzesBySdgLesson(sdgId: string, currentLessonId: string): string | undefined {
  const sdgQuizzes = allQuizzes.filter((q) => q.sdgId === sdgId)
  const next = sdgQuizzes.find((q) => q.lessonId !== currentLessonId)
  return next?.lessonId
}

export function useQuizProgress() {
  const context = useContext(QuizProgressContext)
  if (!context) {
    throw new Error('useQuizProgress must be used within QuizProgressProvider')
  }
  return context
}

export type { ActiveSession }
