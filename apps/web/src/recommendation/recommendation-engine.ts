import {
  pickNextLesson,
  pickNextQuiz,
  pickNextMission,
  pickNextGame,
  pickRecommendedSdg,
} from './recommendation-rules'
import type { RecommendationItem, RecommendationRuleContext } from './recommendation-types'
import { getLessonById } from '@/data/mock/lesson-catalog'
import { getMissionById } from '@/data/mock/mission-catalog'
import { GAMES_METADATA } from '@/games/configs'

const ANALYTICS_STORAGE_KEY = 'ecoquest-analytics'

export interface AnalyticsSummary {
  learning: {
    lessonsCompleted: number
    lessonCompletionRate: number
    learningHours: number
  }
  quiz: {
    quizzesCompleted: number
    averageAccuracy: number
    strongSdgs: string[]
    weakSdgs: string[]
  }
  mission: {
    completedMissions: number
    completionRate: number
    environmentalImpactScore: number
  }
  game: {
    bestScore: number
    favoriteSdg: string | null
    mostPlayedGame: string | null
    averagePerformance: number
  }
  overall: {
    sustainabilityScore: number
    ecoImpactScore: number
    masteryLevelBySdg: Record<string, string>
  }
}

export function loadAnalyticsSummary(): AnalyticsSummary | null {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AnalyticsSummary
  } catch {
    return null
  }
}

export function saveAnalyticsSummary(summary: AnalyticsSummary) {
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(summary))
}

export function buildRecommendationItem(context: RecommendationRuleContext): RecommendationItem {
  return {
    lessonId: pickNextLesson(context)?.id ?? null,
    quizId: pickNextQuiz(context)?.id ?? null,
    missionId: pickNextMission(context)?.id ?? null,
    gameId: pickNextGame(context)?.id ?? null,
    sdgGoalId: pickRecommendedSdg(context),
  }
}

export function buildAnalyticsSummary(context: RecommendationRuleContext) {
  const lessonsCompleted = Object.values(context.lessonProgress).filter(
    (entry) => (entry as any).status === 'completed',
  ).length
  const totalLessons = Object.keys(context.lessonProgress).length
  const lessonCompletionRate = totalLessons === 0 ? 0 : Math.round((lessonsCompleted / totalLessons) * 100)
  const learningHours = Math.round(
    (Object.values(context.lessonProgress).reduce((sum, entry) => {
      const duration = (entry as any).durationMinutes ?? 25
      const completed = (entry as any).status === 'completed'
      return sum + (completed ? duration : duration * 0.35)
    }, 0) / 60) * 10,
  ) / 10

  const quizzesCompleted = context.quizResults.length
  const averageAccuracy = quizzesCompleted === 0
    ? 0
    : Math.round(
        context.quizResults.reduce((sum, result) => sum + result.accuracy, 0) / quizzesCompleted,
      )

  const quizScoresBySdg = context.quizResults.reduce<Record<string, number[]>>((acc, result) => {
    if (!acc[result.sdgId]) acc[result.sdgId] = []
    acc[result.sdgId].push(result.accuracy)
    return acc
  }, {})

  const sdgAverageAccuracy = Object.entries(quizScoresBySdg).map(([sdgId, scores]) => ({
    sdgId,
    avg: Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length),
  }))

  const strongSdgs = sdgAverageAccuracy
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 2)
    .map((item) => item.sdgId)

  const weakSdgs = sdgAverageAccuracy
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 2)
    .map((item) => item.sdgId)

  const completedMissions = Object.values(context.missionProgress).filter(
    (entry) => entry.state === 'completed',
  ).length
  const totalMissions = Object.keys(context.missionProgress).length
  const completionRate = totalMissions === 0 ? 0 : Math.round((completedMissions / totalMissions) * 100)
  const environmentalImpactScore = Math.min(
    100,
    completedMissions * 12 + strongSdgs.length * 6,
  )

  const gameEntries = Object.values(context.gameProgress)
  const bestScore = gameEntries.reduce((max, entry) => Math.max(max, entry.bestScore ?? 0), 0)
  const mostPlayed = gameEntries
    .slice()
    .sort((a, b) => (b.timesPlayed ?? 0) - (a.timesPlayed ?? 0))[0]?.gameId ?? null
  const averagePerformance = gameEntries.length === 0
    ? 0
    : Math.round(
        gameEntries.reduce((sum, entry) => sum + (entry.averageScore ?? 0), 0) / gameEntries.length,
      )

  const sdgMastery: Record<string, string> = {}
  const sdgCompletionCounts = Object.entries(context.lessonProgress).reduce<Record<string, number>>((acc, [lessonId, entry]) => {
    const lesson = getLessonById(lessonId)
    if (!lesson) return acc
    if ((entry as any).status === 'completed') {
      acc[lesson.sdgId] = (acc[lesson.sdgId] ?? 0) + 1
    }
    return acc
  }, {})

  const gameSdgIds = Object.values(context.gameProgress)
    .map((entry) => GAMES_METADATA.find((game) => game.id === entry.gameId)?.sdgIds[0])
    .filter((id): id is string => Boolean(id))

  const missionSdgIds = Object.keys(context.missionProgress)
    .map((missionId) => getMissionById(missionId)?.sdgId)
    .filter((id): id is string => Boolean(id))

  const candidateSdgs = Array.from(
    new Set([
      ...Object.keys(sdgCompletionCounts),
      ...Object.keys(quizScoresBySdg),
      ...missionSdgIds,
      ...gameSdgIds,
    ]),
  )

  candidateSdgs.forEach((sdgId) => {
    const lessonCount = sdgCompletionCounts[sdgId] ?? 0
    const quizAverage =
      (quizScoresBySdg[sdgId]?.reduce((sum, n) => sum + n, 0) ?? 0) /
      (quizScoresBySdg[sdgId]?.length ?? 1)
    const missionComplete = Object.values(context.missionProgress).some(
      (item) => {
        const mission = getMissionById((item as any).missionId ?? '')
        return mission?.sdgId === sdgId && item.state === 'completed'
      },
    )
    const gameCompleted = Object.values(context.gameProgress).some((game) => {
      const metadata = GAMES_METADATA.find((item) => item.id === game.gameId)
      return metadata?.sdgIds[0] === sdgId && game.isCompleted
    })
    const score = lessonCount * 20 + quizAverage * 0.4 + (missionComplete ? 15 : 0) + (gameCompleted ? 15 : 0)
    if (score >= 80) sdgMastery[sdgId] = 'Champion'
    else if (score >= 60) sdgMastery[sdgId] = 'Advocate'
    else if (score >= 40) sdgMastery[sdgId] = 'Explorer'
    else if (score >= 20) sdgMastery[sdgId] = 'Beginner'
    else sdgMastery[sdgId] = 'Guardian'
  })

  const sustainabilityScore = Math.min(100, lessonCompletionRate + averageAccuracy / 2 + environmentalImpactScore / 2)
  const ecoImpactScore = Math.min(100, environmentalImpactScore + averagePerformance / 2 + Math.round(quizAverageAccuracySum(quizScoresBySdg) / 2))

  return {
    learning: {
      lessonsCompleted,
      lessonCompletionRate,
      learningHours,
    },
    quiz: {
      quizzesCompleted,
      averageAccuracy,
      strongSdgs,
      weakSdgs,
    },
    mission: {
      completedMissions,
      completionRate,
      environmentalImpactScore,
    },
    game: {
      bestScore,
      favoriteSdg: pickRecommendedSdg(context),
      mostPlayedGame: mostPlayed,
      averagePerformance,
    },
    overall: {
      sustainabilityScore,
      ecoImpactScore,
      masteryLevelBySdg: sdgMastery,
    },
  }
}

function quizAverageAccuracySum(scoresBySdg: Record<string, number[]>) {
  return Object.values(scoresBySdg).reduce((sum, scores) => sum + scores.reduce((a, b) => a + b, 0), 0)
}
