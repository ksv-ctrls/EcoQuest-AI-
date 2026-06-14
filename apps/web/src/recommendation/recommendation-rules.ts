import { allLessons } from '@/data/mock/lesson-catalog'
import { allQuizzes } from '@/data/mock/quiz-catalog'
import { allMissions } from '@/data/mock/mission-catalog'
import { GAMES_METADATA } from '@/games/configs'
import { mockSdgGoals } from '@/data/mock/sdg'
import type { RecommendationRuleContext } from './recommendation-types'

export function getPreferredSdgIds(context: RecommendationRuleContext) {
  if (!context.ecoProfile) return []
  return [
    context.ecoProfile.primarySdgFocusId,
    context.ecoProfile.secondarySdgFocusId,
    ...context.profile?.impactAreas ?? [],
  ].filter(Boolean)
}

export function pickNextLesson(context: RecommendationRuleContext) {
  const preferredSdgs = getPreferredSdgIds(context)
  const seenLessonIds = new Set(Object.keys(context.lessonProgress))
  const candidate = allLessons.find((lesson) =>
    !seenLessonIds.has(lesson.id) && preferredSdgs.includes(lesson.sdgId),
  )
  return candidate ?? allLessons.find((lesson) => !seenLessonIds.has(lesson.id)) ?? null
}

export function pickNextQuiz(context: RecommendationRuleContext) {
  const preferredSdgs = getPreferredSdgIds(context)
  const completedQuizIds = new Set(context.quizResults.map((result) => result.quizId))
  const target = allQuizzes.find((quiz) =>
    preferredSdgs.includes(quiz.sdgId) && !completedQuizIds.has(quiz.id),
  )
  if (target) return target

  const scoresBySdg = context.quizResults.reduce<Record<string, number>>((acc, result) => {
    acc[result.sdgId] = Math.max(acc[result.sdgId] ?? 0, result.accuracy)
    return acc
  }, {})

  const weakSdg = Object.entries(scoresBySdg)
    .sort((a, b) => a[1] - b[1])[0]?.[0]
  if (weakSdg) {
    return allQuizzes.find((quiz) => quiz.sdgId === weakSdg && !completedQuizIds.has(quiz.id)) ?? null
  }

  return allQuizzes.find((quiz) => !completedQuizIds.has(quiz.id)) ?? allQuizzes[0] ?? null
}

export function pickNextMission(context: RecommendationRuleContext) {
  const preferredSdgs = getPreferredSdgIds(context)
  const activeMissionIds = new Set(Object.keys(context.missionProgress))
  const candidate = allMissions.find((mission) =>
    preferredSdgs.includes(mission.sdgId) && !activeMissionIds.has(mission.id),
  )
  return candidate ?? allMissions.find((mission) => !activeMissionIds.has(mission.id)) ?? allMissions[0] ?? null
}

export function pickNextGame(context: RecommendationRuleContext) {
  const preferredSdgs = getPreferredSdgIds(context)
  const completedGameIds = new Set(
    Object.values(context.gameProgress)
      .filter((progress) => progress.isCompleted)
      .map((progress) => progress.gameId),
  )
  const candidate = GAMES_METADATA.find((game) =>
    preferredSdgs.includes(game.sdgIds[0]) && !completedGameIds.has(game.id),
  )
  if (candidate) return candidate

  return GAMES_METADATA.find((game) => !completedGameIds.has(game.id)) ?? GAMES_METADATA[0]
}

export function pickRecommendedSdg(context: RecommendationRuleContext) {
  const preferredSdgs = getPreferredSdgIds(context)
  if (preferredSdgs.length > 0) return preferredSdgs[0]

  const quizBySdg = context.quizResults.reduce<Record<string, number>>((acc, result) => {
    acc[result.sdgId] = Math.max(acc[result.sdgId] ?? 0, result.accuracy)
    return acc
  }, {})

  const weakSdg = Object.entries(quizBySdg)
    .sort((a, b) => a[1] - b[1])[0]?.[0]
  if (weakSdg) return weakSdg

  return mockSdgGoals[0]?.id ?? null
}
