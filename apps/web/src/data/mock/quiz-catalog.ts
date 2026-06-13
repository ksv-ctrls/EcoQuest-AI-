import { allLessons } from '@/data/mock/lesson-catalog'
import { mockSdgGoals } from '@/data/mock/sdg'
import { fullQuizQuestions } from '@/data/mock/quiz-content'
import type {
  Quiz,
  QuizDifficulty,
  QuizProgressStats,
  SDGQuizCatalog,
  SDGQuizStats,
} from '@/types/quiz'
import type { QuizSessionResult } from '@/types/quiz'

const difficultyRank: Record<QuizDifficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

function aggregateDifficulty(quizzes: Quiz[]): QuizDifficulty {
  const max = quizzes.reduce(
    (acc, quiz) => Math.max(acc, difficultyRank[quiz.difficulty]),
    1,
  )
  return (Object.entries(difficultyRank).find(([, rank]) => rank === max)?.[0] ??
    'beginner') as QuizDifficulty
}

function buildQuizFromLesson(lesson: (typeof allLessons)[number]): Quiz {
  const quizId = `${lesson.id}-quiz`
  const questions = fullQuizQuestions[quizId]
  const questionCount = questions?.length ?? 5

  return {
    id: quizId,
    lessonId: lesson.id,
    sdgId: lesson.sdgId,
    sdgNumber: lesson.sdgNumber,
    title: `${lesson.title} Quiz`,
    description: `Test your knowledge from "${lesson.title}" with adaptive questions across multiple formats.`,
    difficulty: lesson.difficulty as QuizDifficulty,
    questionCount,
    estimatedMinutes: Math.max(5, Math.ceil(questionCount * 1.5)),
    xpPerQuestion: 10,
    questions,
  }
}

export const allQuizzes: Quiz[] = allLessons.map(buildQuizFromLesson)

export function getQuizById(quizId: string): Quiz | undefined {
  return allQuizzes.find((quiz) => quiz.id === quizId)
}

export function getQuizzesBySdgId(sdgId: string): Quiz[] {
  return allQuizzes.filter((quiz) => quiz.sdgId === sdgId)
}

export function getSdgQuizCatalog(sdgId: string): SDGQuizCatalog | undefined {
  const sdg = mockSdgGoals.find((goal) => goal.id === sdgId)
  if (!sdg) return undefined

  return {
    sdgId: sdg.id,
    sdgNumber: sdg.number,
    title: sdg.title,
    overview: sdg.description,
    color: sdg.color,
    quizzes: getQuizzesBySdgId(sdgId),
  }
}

export function getAllSdgQuizCatalogs(): SDGQuizCatalog[] {
  return mockSdgGoals.map((sdg) => ({
    sdgId: sdg.id,
    sdgNumber: sdg.number,
    title: sdg.title,
    overview: sdg.description,
    color: sdg.color,
    quizzes: getQuizzesBySdgId(sdg.id),
  }))
}

export function getSdgQuizStats(
  sdgId: string,
  results: QuizSessionResult[],
): SDGQuizStats | undefined {
  const catalog = getSdgQuizCatalog(sdgId)
  if (!catalog) return undefined

  const sdgResults = results.filter((result) => result.sdgId === sdgId)
  const completedQuizIds = new Set(sdgResults.map((r) => r.quizId))
  const averageAccuracy =
    sdgResults.length === 0
      ? 0
      : Math.round(
          sdgResults.reduce((sum, r) => sum + r.accuracy, 0) / sdgResults.length,
        )

  return {
    sdgId,
    quizCount: catalog.quizzes.length,
    completionPercent:
      catalog.quizzes.length === 0
        ? 0
        : Math.round(
            (catalog.quizzes.filter((q) => completedQuizIds.has(q.id)).length /
              catalog.quizzes.length) *
              100,
          ),
    difficulty: aggregateDifficulty(catalog.quizzes),
    estimatedMinutes: catalog.quizzes.reduce(
      (sum, quiz) => sum + quiz.estimatedMinutes,
      0,
    ),
    averageAccuracy,
  }
}

export function getQuizProgressStats(
  results: QuizSessionResult[],
): QuizProgressStats {
  const totalQuizzes = allQuizzes.length
  const completedQuizIds = new Set(results.map((r) => r.quizId))
  const averageAccuracy =
    results.length === 0
      ? 0
      : Math.round(
          results.reduce((sum, r) => sum + r.accuracy, 0) / results.length,
        )

  return {
    totalQuizzes,
    completedQuizzes: completedQuizIds.size,
    averageAccuracy,
    totalXpEarned: results.reduce((sum, r) => sum + r.xpEarned, 0),
    currentStreak: calculateStreak(results),
    quizCompletionPercent:
      totalQuizzes === 0
        ? 0
        : Math.round((completedQuizIds.size / totalQuizzes) * 100),
  }
}

function calculateStreak(results: QuizSessionResult[]): number {
  if (results.length === 0) return 0

  const days = new Set(
    results.map((r) => r.completionTime.slice(0, 10)),
  )
  const sortedDays = [...days].sort().reverse()

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sortedDays.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    const expectedStr = expected.toISOString().slice(0, 10)

    if (sortedDays.includes(expectedStr)) {
      streak += 1
    } else if (i === 0 && sortedDays.includes(sortedDays[0]!)) {
      // Allow streak if latest result was yesterday
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (sortedDays[0] === yesterday.toISOString().slice(0, 10)) {
        streak += 1
        continue
      }
      break
    } else {
      break
    }
  }

  return streak
}

export function getBestResultForQuiz(
  quizId: string,
  results: QuizSessionResult[],
): QuizSessionResult | undefined {
  const quizResults = results.filter((r) => r.quizId === quizId)
  if (quizResults.length === 0) return undefined
  return quizResults.reduce((best, current) =>
    current.accuracy > best.accuracy ? current : best,
  )
}

export function hasCompletedQuiz(
  quizId: string,
  results: QuizSessionResult[],
): boolean {
  return results.some((r) => r.quizId === quizId)
}
