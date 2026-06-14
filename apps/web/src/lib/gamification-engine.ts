import { badgeDefinitions } from '@/data/mock/badges'
import { achievementDefinitions } from '@/data/mock/achievements'
import type {
  AchievementDefinition,
  BadgeDefinition,
  LevelSummary,
  StreakSummary,
} from '@/types/gamification'

const levelThresholds: number[] = [0, 200, 500, 900, 1400, 2000, 2700, 3500, 4400, 5500]

export function getLevelSummary(totalXp: number): LevelSummary {
  const currentLevel = levelThresholds.reduce(
    (level, threshold, index) =>
      totalXp >= threshold ? index + 1 : level,
    1,
  )

  const nextLevel = Math.min(currentLevel + 1, levelThresholds.length)
  const currentThreshold = levelThresholds[currentLevel - 1] ?? 0
  const nextThreshold = levelThresholds[nextLevel - 1] ?? currentThreshold
  const xpToNextLevel = Math.max(0, nextThreshold - totalXp)
  const progressPercent =
    nextThreshold === currentThreshold
      ? 100
      : Math.round(((totalXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)

  const nextRewardPreview = `Unlocks a new badge or reward at Level ${nextLevel}`

  return {
    currentLevel,
    totalXp,
    xpToNextLevel,
    progressPercent,
    nextLevel,
    nextRewardPreview,
  }
}

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return achievementDefinitions.find((achievement) => achievement.id === id)
}

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return badgeDefinitions.find((badge) => badge.id === id)
}

export function getStreakSummary(activityDates: string[]): StreakSummary {
  const sortedDates = [...new Set(activityDates)].sort()
  const today = new Date().toISOString().slice(0, 10)
  const currentStreak = sortedDates.includes(today)
    ? countConsecutiveDays(sortedDates)
    : 0
  const weeklyStreak = countRecentDays(sortedDates, 7)
  const longestStreak = countLongestStreak(sortedDates)
  const nextBonusDate = currentStreak > 0 ? addDays(today, 1) : today

  return {
    currentStreak,
    weeklyStreak,
    longestStreak,
    nextBonusDate,
  }
}

function countConsecutiveDays(dates: string[]) {
  let streak = 0
  let previous = ''

  for (let i = dates.length - 1; i >= 0; i -= 1) {
    const date = dates[i]
    if (!previous) {
      streak = 1
      previous = date
      continue
    }

    const expected = addDays(previous, -1)
    if (date === expected) {
      streak += 1
      previous = date
    } else {
      break
    }
  }

  return streak
}

function countRecentDays(dates: string[], span: number) {
  const today = new Date().toISOString().slice(0, 10)
  const keys = new Set(dates.slice(-span))
  let count = 0
  for (let offset = 0; offset < span; offset += 1) {
    const date = addDays(today, -offset)
    if (keys.has(date)) count += 1
  }
  return count
}

function countLongestStreak(dates: string[]) {
  let longest = 0
  let current = 0
  let previous = ''

  for (const date of dates) {
    if (!previous) {
      current = 1
      previous = date
      longest = Math.max(longest, current)
      continue
    }

    const expected = addDays(previous, 1)
    if (date === expected) {
      current += 1
    } else {
      current = 1
    }
    previous = date
    longest = Math.max(longest, current)
  }

  return longest
}

function addDays(dateString: string, days: number) {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
