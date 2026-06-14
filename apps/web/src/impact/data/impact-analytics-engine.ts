import { GAMES_METADATA } from '@/games/configs'
import { allLessons } from '@/data/mock/lesson-catalog'
import { allMissions } from '@/data/mock/mission-catalog'
import { allQuizzes } from '@/data/mock/quiz-catalog'
import { mockSdgGoals } from '@/data/mock/sdg'
import type { AiTutorStats } from '@/ai/types/tutor'
import type { ActivityTimelineItem, BadgeState } from '@/types/gamification'
import type { GameProgress } from '@/games/types/game'
import type { LessonProgressMap } from '@/types/lesson'
import type { MissionProgressMap } from '@/types/mission'
import type { QuizSessionResult } from '@/types/quiz'
import type {
  ImpactAiInsight,
  ImpactAnalytics,
  PersonalImpactMetrics,
  SdgProgressMetric,
  WeeklySustainabilityReport,
} from '@/impact/types/impact'

interface ImpactAnalyticsInput {
  lessonProgress: LessonProgressMap
  quizResults: QuizSessionResult[]
  missionProgress: MissionProgressMap
  gameProgress: Record<string, GameProgress>
  activityTimeline: ActivityTimelineItem[]
  badges: BadgeState[]
  tutorStats: AiTutorStats
  impactRecords?: any[]
}

function percent(completed: number, total: number) {
  if (total <= 0) return 0
  return Math.min(100, Math.round((completed / total) * 100))
}

function isCompletedMission(state?: string) {
  return state === 'completed' || state === 'approved'
}

function startOfWeek(date = new Date()) {
  const next = new Date(date)
  const day = next.getDay()
  const diff = day === 0 ? -6 : 1 - day
  next.setDate(next.getDate() + diff)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfWeek(date = new Date()) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function isWithinWeek(value: string, weekStart: Date, weekEnd: Date) {
  const date = new Date(value)
  return date >= weekStart && date <= weekEnd
}

function getCompletedMissions(missionProgress: MissionProgressMap) {
  return allMissions.filter((mission) =>
    isCompletedMission(missionProgress[mission.id]?.state),
  )
}

function calculateMissionImpact(completedMissions: typeof allMissions) {
  let waterSavedLiters = 0
  let treesPlanted = 0
  let co2ReducedKg = 0
  let plasticAvoidedKg = 0

  for (const mission of completedMissions) {
    const label = mission.impactMetric.label.toLowerCase()
    const unit = mission.impactMetric.unit.toLowerCase()
    const value = mission.impactMetric.targetValue

    if (label.includes('water') || unit.includes('litre')) {
      waterSavedLiters += value
    } else if (label.includes('co') || unit.includes('co')) {
      co2ReducedKg += value
    } else if (label.includes('plastic')) {
      plasticAvoidedKg += value
    } else if (label.includes('species') || label.includes('habitat') || label.includes('green')) {
      treesPlanted += Math.max(1, Math.round(value / 10))
    }
  }

  return { waterSavedLiters, treesPlanted, co2ReducedKg, plasticAvoidedKg }
}

function calculateGameImpact(gameProgress: Record<string, GameProgress>) {
  const completedGames = GAMES_METADATA.filter((game) => gameProgress[game.id]?.isCompleted)
  let waterSavedLiters = 0
  let treesPlanted = 0
  let co2ReducedKg = 0
  let plasticAvoidedKg = 0

  for (const game of completedGames) {
    const sdgIds = new Set(game.sdgIds)
    if (sdgIds.has('6')) waterSavedLiters += 40
    if (sdgIds.has('11') || sdgIds.has('13')) co2ReducedKg += 8
    if (sdgIds.has('12') || sdgIds.has('14')) plasticAvoidedKg += 1
    if (sdgIds.has('15')) treesPlanted += 2
  }

  return { waterSavedLiters, treesPlanted, co2ReducedKg, plasticAvoidedKg }
}

function buildPersonalImpact(input: ImpactAnalyticsInput): PersonalImpactMetrics {
  const completedMissions = getCompletedMissions(input.missionProgress)
  const missionImpact = calculateMissionImpact(completedMissions)
  const gameImpact = calculateGameImpact(input.gameProgress)
  const gamesPlayed = Object.values(input.gameProgress).reduce(
    (sum, progress) => sum + progress.timesPlayed,
    0,
  )
  const completedLessonMinutes = allLessons
    .filter((lesson) => input.lessonProgress[lesson.id]?.status === 'completed')
    .reduce((sum, lesson) => sum + lesson.durationMinutes, 0)
  const quizMinutes = input.quizResults.reduce((sum, result) => sum + result.timeTakenSeconds / 60, 0)

  let dbWaterSaved = 0
  let dbTreesPlanted = 0
  let dbCo2Reduced = 0
  let dbPlasticAvoided = 0

  if (input.impactRecords && input.impactRecords.length > 0) {
    input.impactRecords.forEach((rec) => {
      dbWaterSaved += rec.waterSaved ?? 0
      dbTreesPlanted += rec.treesPlanted ?? 0
      dbCo2Reduced += rec.co2Reduced ?? 0
      dbPlasticAvoided += rec.plasticAvoided ?? 0
    })
  }

  return {
    waterSavedLiters: Math.max(missionImpact.waterSavedLiters + gameImpact.waterSavedLiters, dbWaterSaved),
    treesPlanted: Math.max(missionImpact.treesPlanted + gameImpact.treesPlanted, dbTreesPlanted),
    co2ReducedKg: Math.max(missionImpact.co2ReducedKg + gameImpact.co2ReducedKg, dbCo2Reduced),
    plasticAvoidedKg: Math.max(missionImpact.plasticAvoidedKg + gameImpact.plasticAvoidedKg, dbPlasticAvoided),
    missionsCompleted: completedMissions.length,
    quizzesCompleted: new Set(input.quizResults.map((result) => result.quizId)).size,
    gamesPlayed,
    learningHours: Math.round(((completedLessonMinutes + quizMinutes) / 60) * 10) / 10,
  }
}

function buildSdgProgress(input: ImpactAnalyticsInput): SdgProgressMetric[] {
  return mockSdgGoals.map((sdg) => {
    const lessons = allLessons.filter((lesson) => lesson.sdgId === sdg.id)
    const quizzes = allQuizzes.filter((quiz) => quiz.sdgId === sdg.id)
    const missions = allMissions.filter((mission) => mission.sdgId === sdg.id)
    const games = GAMES_METADATA.filter((game) => game.sdgIds.includes(String(sdg.number)))
    const completedLessons = lessons.filter(
      (lesson) => input.lessonProgress[lesson.id]?.status === 'completed',
    ).length
    const completedQuizzes = new Set(
      input.quizResults.filter((result) => result.sdgId === sdg.id).map((result) => result.quizId),
    ).size
    const completedMissions = missions.filter((mission) =>
      isCompletedMission(input.missionProgress[mission.id]?.state),
    ).length
    const completedGames = games.filter((game) => input.gameProgress[game.id]?.isCompleted).length

    const learningPercent = percent(completedLessons, lessons.length)
    const quizPercent = percent(completedQuizzes, quizzes.length)
    const missionPercent = percent(completedMissions, missions.length)
    const gamePercent = percent(completedGames, games.length)

    return {
      sdgId: sdg.id,
      sdgNumber: sdg.number,
      title: sdg.title,
      color: sdg.color,
      learningPercent,
      quizPercent,
      missionPercent,
      gamePercent,
      overallMasteryPercent: Math.round(
        learningPercent * 0.3 + quizPercent * 0.25 + missionPercent * 0.25 + gamePercent * 0.2,
      ),
    }
  })
}

function buildWeeklyReport(
  input: ImpactAnalyticsInput,
  personalImpact: PersonalImpactMetrics,
): WeeklySustainabilityReport {
  const weekStart = startOfWeek()
  const weekEnd = endOfWeek()
  const lessonsCompleted = allLessons.filter((lesson) => {
    const entry = input.lessonProgress[lesson.id]
    return entry?.status === 'completed' && isWithinWeek(entry.updatedAt, weekStart, weekEnd)
  }).length
  const quizzesCompleted = input.quizResults.filter((result) =>
    isWithinWeek(result.completionTime, weekStart, weekEnd),
  ).length
  const weeklyMissions = allMissions.filter((mission) => {
    const entry = input.missionProgress[mission.id]
    return isCompletedMission(entry?.state) && entry && isWithinWeek(entry.updatedAt, weekStart, weekEnd)
  })
  const gamesCompleted = GAMES_METADATA.filter((game) => {
    const progress = input.gameProgress[game.id]
    return progress?.isCompleted && progress.lastPlayedAt && isWithinWeek(progress.lastPlayedAt, weekStart, weekEnd)
  }).length
  const weeklyMissionImpact = calculateMissionImpact(weeklyMissions)

  const learningMinutes = allLessons
    .filter((lesson) => {
      const entry = input.lessonProgress[lesson.id]
      return entry?.status === 'completed' && isWithinWeek(entry.updatedAt, weekStart, weekEnd)
    })
    .reduce((sum, lesson) => sum + lesson.durationMinutes, 0)

  const learningHours = Math.round((learningMinutes / 60) * 10) / 10
  const waterSavedLiters = weeklyMissionImpact.waterSavedLiters || Math.min(personalImpact.waterSavedLiters, 30)
  const co2ReducedKg = weeklyMissionImpact.co2ReducedKg
  const plasticAvoidedKg = weeklyMissionImpact.plasticAvoidedKg

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    lessonsCompleted,
    quizzesCompleted,
    missionsCompleted: weeklyMissions.length,
    gamesCompleted,
    learningHours,
    waterSavedLiters,
    co2ReducedKg,
    plasticAvoidedKg,
    summary: `This week you completed ${lessonsCompleted} lessons, ${quizzesCompleted} quizzes, ${weeklyMissions.length} missions, and reduced an estimated ${waterSavedLiters} liters of water waste.`,
  }
}

function buildInsights(
  sdgProgress: SdgProgressMetric[],
  tutorStats: AiTutorStats,
): ImpactAiInsight[] {
  const strongest = [...sdgProgress].sort((a, b) => b.overallMasteryPercent - a.overallMasteryPercent)[0]
  const weakestActive = [...sdgProgress]
    .filter((sdg) => sdg.overallMasteryPercent > 0)
    .sort((a, b) => a.overallMasteryPercent - b.overallMasteryPercent)[0]
  const climate = sdgProgress.find((sdg) => sdg.sdgId === 'sdg-13')
  const cities = sdgProgress.find((sdg) => sdg.sdgId === 'sdg-11')

  const insights: ImpactAiInsight[] = []
  if (strongest) {
    insights.push({
      title: `Best progress: SDG ${strongest.sdgNumber}`,
      description: `You perform best in ${strongest.title} with ${strongest.overallMasteryPercent}% overall mastery.`,
      tone: 'strength',
    })
  }
  if (climate && cities && climate.overallMasteryPercent > cities.overallMasteryPercent) {
    insights.push({
      title: 'Climate strength, city growth area',
      description: 'You perform best in Climate Action topics but should spend more time on Sustainable Cities.',
      tone: 'growth',
    })
  } else if (weakestActive) {
    insights.push({
      title: `Growth area: SDG ${weakestActive.sdgNumber}`,
      description: `${weakestActive.title} is your lowest active SDG area. Try one lesson and one mission there next.`,
      tone: 'growth',
    })
  }
  insights.push({
    title: 'Tutor signal',
    description:
      tutorStats.favoriteTopics.length > 0
        ? `Eco Mentor sees repeated interest in ${tutorStats.favoriteTopics.slice(0, 2).join(' and ')}.`
        : 'Ask Eco Mentor a few questions to unlock richer study insights.',
    tone: 'next-step',
  })

  return insights
}

export function buildImpactAnalytics(input: ImpactAnalyticsInput): ImpactAnalytics {
  const personalImpact = buildPersonalImpact(input)
  const sdgProgress = buildSdgProgress(input)
  const weeklyReport = buildWeeklyReport(input, personalImpact)
  const averageSdgMastery = Math.round(
    sdgProgress.reduce((sum, sdg) => sum + sdg.overallMasteryPercent, 0) / sdgProgress.length,
  )
  const impactScore = Math.min(
    100,
    Math.round(
      personalImpact.missionsCompleted * 8 +
        personalImpact.quizzesCompleted * 4 +
        personalImpact.gamesPlayed * 2 +
        personalImpact.learningHours * 3 +
        averageSdgMastery * 0.4,
    ),
  )

  return {
    personalImpact,
    sdgProgress,
    timeline: input.activityTimeline.slice(0, 20),
    weeklyReport,
    insights: buildInsights(sdgProgress, input.tutorStats),
    impactScore,
    averageSdgMastery,
  }
}
