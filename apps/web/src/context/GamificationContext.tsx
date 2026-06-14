import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { achievementDefinitions } from '@/data/mock/achievements'
import { badgeDefinitions } from '@/data/mock/badges'
import { rewardDefinitions } from '@/data/mock/rewards'
import { dailyChallengeDefinitions } from '@/data/mock/daily-challenges'
import {
  getLevelSummary,
  getStreakSummary,
} from '@/lib/gamification-engine'
import type {
  AchievementState,
  BadgeState,
  DailyChallengeStatus,
  RewardDefinition,
  RewardPurchase,
  ActivityTimelineItem,
  GamificationContextValue,
  GamificationEventType,
} from '@/types/gamification'
import type { QuizSessionResult } from '@/types/quiz'
import { useAuth } from '@/context/AuthContext'
import { getProgressSummary } from '@/api/lessonApi'
import { saveGameProgress } from '@/api/gameApi'
import { syncGamificationState } from '@/api/gamificationApi'
import { saveImpactRecord } from '@/api/impactApi'
import { getMissionById } from '@/data/mock/mission-catalog'

const STORAGE_KEY = 'ecoquest-gamification-state'

interface GamificationInternalState {
  totalXp: number
  ecoCoinsBalance: number
  lifetimeEcoCoinsEarned: number
  lifetimeEcoCoinsSpent: number
  activityDates: string[]
  activityTimeline: ActivityTimelineItem[]
  achievements: AchievementState[]
  badges: BadgeState[]
  dailyChallenges: DailyChallengeStatus[]
  rewardPurchases: RewardPurchase[]
  lastChallengeDate: string
  lessonStartedIds: string[]
  lessonCompletedIds: string[]
  lessonCompletedSdgs: string[]
  quizCompletedIds: string[]
  quizCompletionDates: string[]
  perfectScoreQuizIds: string[]
  missionStartedIds: string[]
  missionCompletedIds: string[]
  missionCompletedSdgs: string[]
  gameCompletedIds: string[]
  gameCompletedSdgs: string[]
}

const defaultState: GamificationInternalState = {
  totalXp: 120,
  ecoCoinsBalance: 160,
  lifetimeEcoCoinsEarned: 160,
  lifetimeEcoCoinsSpent: 0,
  activityDates: [new Date().toISOString().slice(0, 10)],
  activityTimeline: [
    {
      id: 'intro-activity',
      type: 'achievement_unlock',
      title: 'Welcome to EcoQuest Rewards',
      description: 'Your gamification engine is ready to record progress, streaks, and achievements.',
      date: new Date().toISOString(),
    },
  ],
  achievements: achievementDefinitions.map((achievement) => ({
    ...achievement,
    unlocked: false,
  })),
  badges: badgeDefinitions.map((badge) => ({
    ...badge,
    unlocked: false,
  })),
  dailyChallenges: dailyChallengeDefinitions.map((challenge) => ({
    ...challenge,
    progress: 0,
    completed: false,
  })),
  rewardPurchases: [],
  lastChallengeDate: new Date().toISOString().slice(0, 10),
  lessonStartedIds: [],
  lessonCompletedIds: [],
  lessonCompletedSdgs: [],
  quizCompletedIds: [],
  quizCompletionDates: [],
  perfectScoreQuizIds: [],
  missionStartedIds: [],
  missionCompletedIds: [],
  missionCompletedSdgs: [],
  gameCompletedIds: [],
  gameCompletedSdgs: [],
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function loadState(): GamificationInternalState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as GamificationInternalState
    const today = getTodayKey()
    const dailyChallenges = parsed.lastChallengeDate !== today
      ? dailyChallengeDefinitions.map((challenge) => ({
          ...challenge,
          progress: 0,
          completed: false,
        }))
      : parsed.dailyChallenges

    return {
      ...defaultState,
      ...parsed,
      dailyChallenges,
      lastChallengeDate: today,
    }
  } catch {
    return defaultState
  }
}

function saveState(state: GamificationInternalState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function buildTimelineItem(
  type: GamificationEventType,
  title: string,
  description: string,
): ActivityTimelineItem {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    description,
    date: new Date().toISOString(),
  }
}

function createDailyChallengeStatuses(): DailyChallengeStatus[] {
  return dailyChallengeDefinitions.map((challenge) => ({
    ...challenge,
    progress: 0,
    completed: false,
  }))
}

const GamificationContext = createContext<GamificationContextValue | null>(null)

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationInternalState>(loadState)
  const { isAuthenticated } = useAuth()
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  // ── Mount-time hydration from backend ──────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      getProgressSummary()
        .then((data) => {
          if (!data) return
          setState((prev) => {
            let next = { ...prev }

            // Merge game completions from backend
            if (data.games && data.games.length > 0) {
              data.games.forEach((item: any) => {
                if (item.completed && item.gameId && !next.gameCompletedIds.includes(item.gameId)) {
                  next = {
                    ...next,
                    gameCompletedIds: [...next.gameCompletedIds, item.gameId],
                  }
                }
              })
            }

            // Merge achievement unlocks from backend
            if (data.achievements && data.achievements.length > 0) {
              data.achievements.forEach((item: any) => {
                if (item.achievementId) {
                  next = {
                    ...next,
                    achievements: next.achievements.map((a) =>
                      a.id === item.achievementId && !a.unlocked
                        ? { ...a, unlocked: true, unlockedAt: item.unlockedAt }
                        : a,
                    ),
                  }
                }
              })
            }

            saveState(next)
            return next
          })
        })
        .catch((err) => {
          console.warn('Failed to sync gamification state from backend:', err)
        })
    }
  }, [isAuthenticated])

  // ── Debounced write-through of XP/level/ecoCoins to backend ────────
  useEffect(() => {
    if (!isAuthenticated) return
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      const level = getLevelSummary(state.totalXp).currentLevel
      syncGamificationState({
        xp: state.totalXp,
        level,
        ecoCoins: state.ecoCoinsBalance,
      }).catch((err) => {
        console.warn('Failed to sync gamification to backend:', err)
      })
    }, 2000)
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [isAuthenticated, state.totalXp, state.ecoCoinsBalance])

  const currentLevelSummary = useMemo(() => getLevelSummary(state.totalXp), [state.totalXp])
  const streakSummary = useMemo(() => getStreakSummary(state.activityDates), [state.activityDates])
  const ecoCoinSummary = useMemo(
    () => ({
      balance: state.ecoCoinsBalance,
      lifetimeEarned: state.lifetimeEcoCoinsEarned,
      lifetimeSpent: state.lifetimeEcoCoinsSpent,
    }),
    [state.ecoCoinsBalance, state.lifetimeEcoCoinsEarned, state.lifetimeEcoCoinsSpent],
  )


  const evaluateAchievements = useCallback(
    (nextState: GamificationInternalState): GamificationInternalState => {
      const achievements = nextState.achievements
      const completedLessonCount = nextState.lessonCompletedIds.length
      const completedSdgCount = new Set(nextState.lessonCompletedSdgs).size
      const completedQuizCount = nextState.quizCompletedIds.length
      const quizStreak = calculateConsecutiveDays(nextState.quizCompletionDates)
      const hasWaterMission = nextState.missionCompletedSdgs.includes('sdg-6')
      const hasClimateMission = nextState.missionCompletedSdgs.includes('sdg-13')
      const hasForestMission = nextState.missionCompletedSdgs.includes('sdg-15')
      const hasWaterGame = nextState.gameCompletedSdgs.includes('sdg-6')
      const hasClimateGame = nextState.gameCompletedSdgs.includes('sdg-13')
      const hasForestGame = nextState.gameCompletedSdgs.includes('sdg-15')
      const completedGameCount = nextState.gameCompletedIds.length
      const newState = { ...nextState }

      achievements.forEach((achievement) => {
        if (achievement.unlocked) return

        let shouldUnlock = false

        switch (achievement.id) {
          case 'first_lesson':
            shouldUnlock = completedLessonCount >= 1
            break
          case 'five_lessons':
            shouldUnlock = completedLessonCount >= 5
            break
          case 'ten_lessons':
            shouldUnlock = completedLessonCount >= 10
            break
          case 'sdg_explorer':
            shouldUnlock = completedSdgCount >= 3
            break
          case 'first_quiz':
            shouldUnlock = completedQuizCount >= 1
            break
          case 'quiz_master':
            shouldUnlock = completedQuizCount >= 5
            break
          case 'perfect_score':
            shouldUnlock = nextState.perfectScoreQuizIds.length >= 1
            break
          case 'quiz_streak':
            shouldUnlock = quizStreak >= 5
            break
          case 'first_mission':
            shouldUnlock = nextState.missionStartedIds.length >= 1
            break
          case 'community_hero':
            shouldUnlock = hasWaterMission || hasClimateMission || hasForestMission || hasWaterGame || hasClimateGame || hasForestGame
            break
          case 'climate_champion':
            shouldUnlock = hasClimateMission || hasClimateGame
            break
          case 'water_warrior':
            shouldUnlock = hasWaterMission || hasWaterGame
            break
          case 'eco_explorer':
            shouldUnlock = nextState.totalXp >= 500
            break
          case 'first_game':
            shouldUnlock = completedGameCount >= 1
            break
          case 'sdg_game_explorer':
            shouldUnlock = completedGameCount >= 3
            break
          case 'early_adopter':
            shouldUnlock = nextState.activityDates.length >= 1
            break
          case 'sustainability_advocate':
            shouldUnlock = nextState.lifetimeEcoCoinsEarned >= 200
            break
          default:
            break
        }

        if (shouldUnlock) {
          const unlockedAt = new Date().toISOString()
          newState.achievements = newState.achievements.map((item) =>
            item.id === achievement.id
              ? { ...item, unlocked: true, unlockedAt }
              : item,
          )
          newState.totalXp += achievement.xpReward
          newState.ecoCoinsBalance += achievement.ecoCoinReward
          newState.lifetimeEcoCoinsEarned += achievement.ecoCoinReward
          newState.activityTimeline = [
            buildTimelineItem(
              'achievement_unlock',
              `Achievement: ${achievement.title}`,
              achievement.description,
            ),
            ...newState.activityTimeline,
          ].slice(0, 20)
        }
      })

      return newState
    },
    [],
  )

  const evaluateBadges = useCallback(
    (nextState: GamificationInternalState): GamificationInternalState => {
      const level = getLevelSummary(nextState.totalXp).currentLevel
      const unlockedAchievementCount = nextState.achievements.filter((item) => item.unlocked).length
      const nextStateCopy = { ...nextState }

      nextState.badges.forEach((badge) => {
        if (badge.unlocked) return

        let shouldUnlock = false

        switch (badge.id) {
          case 'green_beginner':
            shouldUnlock = level >= 2 || unlockedAchievementCount >= 1
            break
          case 'water_guardian':
            shouldUnlock = nextState.missionCompletedSdgs.includes('sdg-6') || nextState.gameCompletedSdgs.includes('sdg-6')
            break
          case 'climate_defender':
            shouldUnlock = nextState.missionCompletedSdgs.includes('sdg-13') || nextState.gameCompletedSdgs.includes('sdg-13')
            break
          case 'forest_protector':
            shouldUnlock = nextState.missionCompletedSdgs.includes('sdg-15') || nextState.gameCompletedSdgs.includes('sdg-15')
            break
          case 'sustainability_champion':
            shouldUnlock = nextState.badges.filter((item) => item.unlocked).length >= 3
            break
          default:
            break
        }

        if (shouldUnlock) {
          const unlockedAt = new Date().toISOString()
          nextStateCopy.badges = nextStateCopy.badges.map((item) =>
            item.id === badge.id
              ? { ...item, unlocked: true, unlockedAt }
              : item,
          )
          nextStateCopy.activityTimeline = [
            buildTimelineItem(
              'badge_collect',
              `Badge: ${badge.name}`,
              badge.description,
            ),
            ...nextStateCopy.activityTimeline,
          ].slice(0, 20)
        }
      })

      return nextStateCopy
    },
    [],
  )

  const processNewState = useCallback(
    (nextState: GamificationInternalState): GamificationInternalState => {
      const achievementState = evaluateAchievements(nextState)
      const badgeState = evaluateBadges(achievementState)
      return badgeState
    },
    [evaluateAchievements, evaluateBadges],
  )

  const trackDailyChallengeProgress = useCallback(
    (eventType: GamificationEventType) => {
      setState((prev) => {
        const today = getTodayKey()
        const challenges = prev.dailyChallenges.map((challenge) => {
          if (challenge.completed || challenge.eventType !== eventType) return challenge
          const nextProgress = Math.min(challenge.progress + 1, challenge.target)
          const completed = nextProgress >= challenge.target

          return {
            ...challenge,
            progress: nextProgress,
            completed,
            completedAt: completed ? new Date().toISOString() : challenge.completedAt,
          }
        })

        let nextState = { ...prev, dailyChallenges: challenges, lastChallengeDate: today }
        challenges.forEach((challenge) => {
          if (challenge.completed && challenge.progress === challenge.target) {
            nextState = {
              ...nextState,
              totalXp: nextState.totalXp + challenge.xpReward,
              ecoCoinsBalance: nextState.ecoCoinsBalance + challenge.ecoCoinReward,
              lifetimeEcoCoinsEarned:
                nextState.lifetimeEcoCoinsEarned + challenge.ecoCoinReward,
              activityTimeline: [
                buildTimelineItem(
                  'challenge_complete',
                  `Daily challenge complete: ${challenge.title}`,
                  challenge.description,
                ),
                ...nextState.activityTimeline,
              ].slice(0, 20),
            }
          }
        })

        return processNewState(nextState)
      })
    },
    [processNewState],
  )

  const trackLessonStart = useCallback(
    (lessonId: string, sdgId: string) => {
      setState((prev) => {
        if (prev.lessonStartedIds.includes(lessonId)) return prev
        const nextState = {
          ...prev,
          lessonStartedIds: [...prev.lessonStartedIds, lessonId],
          totalXp: prev.totalXp + 5,
          activityDates: Array.from(
            new Set([...prev.activityDates, getTodayKey()]),
          ),
          activityTimeline: [
            buildTimelineItem(
              'lesson_start',
              'Lesson started',
              `Started lesson ${lessonId} for ${sdgId}.`,
            ),
            ...prev.activityTimeline,
          ].slice(0, 20),
        }

        return processNewState(nextState)
      })
      trackDailyChallengeProgress('lesson_start')
    },
    [processNewState, trackDailyChallengeProgress],
  )

  const trackLessonComplete = useCallback(
    (lessonId: string, sdgId: string) => {
      setState((prev) => {
        if (prev.lessonCompletedIds.includes(lessonId)) return prev
        const nextLessonCompletedSdgs = [...new Set([...prev.lessonCompletedSdgs, sdgId])]
        const nextState = {
          ...prev,
          lessonCompletedIds: [...prev.lessonCompletedIds, lessonId],
          lessonCompletedSdgs: nextLessonCompletedSdgs,
          totalXp: prev.totalXp + 25,
          activityDates: Array.from(
            new Set([...prev.activityDates, getTodayKey()]),
          ),
          activityTimeline: [
            buildTimelineItem(
              'lesson_complete',
              'Lesson completed',
              `Completed lesson ${lessonId}.`,
            ),
            ...prev.activityTimeline,
          ].slice(0, 20),
        }

        return processNewState(nextState)
      })
      trackDailyChallengeProgress('lesson_complete')
    },
    [processNewState, trackDailyChallengeProgress],
  )

  const trackQuizComplete = useCallback(
    (result: QuizSessionResult) => {
      setState((prev) => {
        if (prev.quizCompletedIds.includes(result.quizId)) return prev
        const nextQuizCompletedIds = [...prev.quizCompletedIds, result.quizId]
        const nextQuizCompletionDates = [...prev.quizCompletionDates, getTodayKey()]
        const nextPerfectQuizIds = result.accuracy === 100
          ? [...new Set([...prev.perfectScoreQuizIds, result.quizId])]
          : prev.perfectScoreQuizIds
        const baseXp = 50
        const bonusXp = result.accuracy > 80 ? 20 : 0
        const nextState = {
          ...prev,
          quizCompletedIds: nextQuizCompletedIds,
          quizCompletionDates: nextQuizCompletionDates,
          perfectScoreQuizIds: nextPerfectQuizIds,
          totalXp: prev.totalXp + baseXp + bonusXp,
          activityDates: Array.from(
            new Set([...prev.activityDates, getTodayKey()]),
          ),
          activityTimeline: [
            buildTimelineItem(
              'quiz_complete',
              'Quiz completed',
              `Completed quiz ${result.quizTitle} with ${result.accuracy.toFixed(0)}% accuracy.`,
            ),
            ...(bonusXp > 0
              ? [
                  buildTimelineItem(
                    'quiz_bonus',
                    'Accuracy bonus',
                    `Earned ${bonusXp} bonus XP for scoring above 80%.`,
                  ),
                ]
              : []),
            ...prev.activityTimeline,
          ].slice(0, 20),
        }

        return processNewState(nextState)
      })
      trackDailyChallengeProgress('quiz_complete')
    },
    [processNewState, trackDailyChallengeProgress],
  )

  const trackMissionStart = useCallback(
    (missionId: string, sdgId: string) => {
      setState((prev) => {
        if (prev.missionStartedIds.includes(missionId)) return prev
        const nextState = {
          ...prev,
          missionStartedIds: [...prev.missionStartedIds, missionId],
          totalXp: prev.totalXp + 10,
          activityDates: Array.from(
            new Set([...prev.activityDates, getTodayKey()]),
          ),
          activityTimeline: [
            buildTimelineItem(
              'mission_start',
              'Mission started',
              `Started mission ${missionId} for ${sdgId}.`,
            ),
            ...prev.activityTimeline,
          ].slice(0, 20),
        }

        return processNewState(nextState)
      })
      trackDailyChallengeProgress('mission_start')
    },
    [processNewState, trackDailyChallengeProgress],
  )

  const trackMissionSubmit = useCallback(
    (missionId: string, sdgId: string) => {
      setState((prev) => {
        const nextState = {
          ...prev,
          totalXp: prev.totalXp + 30,
          activityDates: Array.from(
            new Set([...prev.activityDates, getTodayKey()]),
          ),
          activityTimeline: [
            buildTimelineItem(
              'mission_submit',
              'Mission submitted',
              `Submitted mission ${missionId} for ${sdgId}.`,
            ),
            ...prev.activityTimeline,
          ].slice(0, 20),
        }

        return processNewState(nextState)
      })
      trackDailyChallengeProgress('mission_submit')
    },
    [processNewState, trackDailyChallengeProgress],
  )

  const trackMissionComplete = useCallback(
    (missionId: string, sdgId: string) => {
      setState((prev) => {
        if (prev.missionCompletedIds.includes(missionId)) return prev
        const nextMissionCompletedSdgs = [...new Set([...prev.missionCompletedSdgs, sdgId])]
        const nextState = {
          ...prev,
          missionCompletedIds: [...prev.missionCompletedIds, missionId],
          missionCompletedSdgs: nextMissionCompletedSdgs,
          totalXp: prev.totalXp + 100,
          activityDates: Array.from(
            new Set([...prev.activityDates, getTodayKey()]),
          ),
          activityTimeline: [
            buildTimelineItem(
              'mission_complete',
              'Mission completed',
              `Completed mission ${missionId}.`,
            ),
            ...prev.activityTimeline,
          ].slice(0, 20),
        }

        return processNewState(nextState)
      })
      trackDailyChallengeProgress('mission_complete')

      const mission = getMissionById(missionId)
      if (mission) {
        let waterSaved = 0
        let treesPlanted = 0
        let co2Reduced = 0
        let plasticAvoided = 0

        const label = mission.impactMetric.label.toLowerCase()
        const unit = mission.impactMetric.unit.toLowerCase()
        const value = mission.impactMetric.targetValue

        if (label.includes('water') || unit.includes('litre')) {
          waterSaved = value
        } else if (label.includes('co') || unit.includes('co')) {
          co2Reduced = value
        } else if (label.includes('plastic')) {
          plasticAvoided = value
        } else if (label.includes('species') || label.includes('habitat') || label.includes('green')) {
          treesPlanted = Math.max(1, Math.round(value / 10))
        }

        if (waterSaved > 0 || treesPlanted > 0 || co2Reduced > 0 || plasticAvoided > 0) {
          saveImpactRecord({
            waterSaved,
            treesPlanted,
            co2Reduced,
            plasticAvoided,
          }).catch((err) => {
            console.warn('Failed to sync mission impact to backend:', err)
          })
        }
      }
    },
    [processNewState, trackDailyChallengeProgress],
  )

  const trackGameComplete = useCallback(
    (gameId: string, gameTitle: string, sdgIds: string[], xpReward: number, ecoCoinReward: number) => {
      setState((prev) => {
        if (prev.gameCompletedIds.includes(gameId)) return prev
        const nextGameCompletedSdgs = Array.from(new Set([...prev.gameCompletedSdgs, ...sdgIds]))
        const nextState = {
          ...prev,
          gameCompletedIds: [...prev.gameCompletedIds, gameId],
          gameCompletedSdgs: nextGameCompletedSdgs,
          totalXp: prev.totalXp + xpReward,
          ecoCoinsBalance: prev.ecoCoinsBalance + ecoCoinReward,
          lifetimeEcoCoinsEarned: prev.lifetimeEcoCoinsEarned + ecoCoinReward,
          activityDates: Array.from(new Set([...prev.activityDates, getTodayKey()])),
          activityTimeline: [
            buildTimelineItem(
              'game_complete',
              `Game completed: ${gameTitle}`,
              `Completed ${gameTitle} and earned ${xpReward} XP + ${ecoCoinReward} EcoCoins.`,
            ),
            ...prev.activityTimeline,
          ].slice(0, 20),
        }

        return processNewState(nextState)
      })

      // ── Write-through to backend ──────────────────────────────────
      saveGameProgress({
        gameId,
        score: xpReward,
        completed: true,
        completionTime: 0,
      }).catch((err) => {
        console.warn('Failed to sync game progress to backend:', err)
      })

      let waterSaved = 0
      let treesPlanted = 0
      let co2Reduced = 0
      let plasticAvoided = 0

      const sdgIdsSet = new Set(sdgIds)
      if (sdgIdsSet.has('6')) waterSaved += 40
      if (sdgIdsSet.has('11') || sdgIdsSet.has('13')) co2Reduced += 8
      if (sdgIdsSet.has('12') || sdgIdsSet.has('14')) plasticAvoided += 1
      if (sdgIdsSet.has('15')) treesPlanted += 2

      if (waterSaved > 0 || treesPlanted > 0 || co2Reduced > 0 || plasticAvoided > 0) {
        saveImpactRecord({
          waterSaved,
          treesPlanted,
          co2Reduced,
          plasticAvoided,
        }).catch((err) => {
          console.warn('Failed to sync game impact record to backend:', err)
        })
      }
    },
    [processNewState],
  )

  const purchaseReward = useCallback((rewardId: string) => {
    const reward = rewardDefinitions.find((item) => item.id === rewardId)
    if (!reward) return

    setState((prev) => {
      if (prev.ecoCoinsBalance < reward.cost) return prev
      if (prev.rewardPurchases.some((purchase) => purchase.rewardId === reward.id)) return prev

      return {
        ...prev,
        ecoCoinsBalance: prev.ecoCoinsBalance - reward.cost,
        lifetimeEcoCoinsSpent: prev.lifetimeEcoCoinsSpent + reward.cost,
        rewardPurchases: [
          {
            rewardId: reward.id,
            purchasedAt: new Date().toISOString(),
          },
          ...prev.rewardPurchases,
        ],
        activityTimeline: [
          buildTimelineItem(
            'reward_purchase',
            `Unlocked ${reward.title}`,
            `Spent ${reward.cost} EcoCoins to unlock this reward.`,
          ),
          ...prev.activityTimeline,
        ].slice(0, 20),
      }
    })
  }, [])

  useEffect(() => {
    setState((prev) => {
      const today = getTodayKey()
      if (prev.lastChallengeDate === today) return prev
      return {
        ...prev,
        dailyChallenges: createDailyChallengeStatuses(),
        lastChallengeDate: today,
      }
    })
  }, [])

  const value = useMemo(
    (): GamificationContextValue => ({
      totalXp: state.totalXp,
      levelSummary: currentLevelSummary,
      ecoCoinSummary,
      streakSummary,
      activityTimeline: state.activityTimeline,
      achievements: state.achievements,
      badges: state.badges,
      dailyChallenges: state.dailyChallenges,
      rewardPurchases: state.rewardPurchases,
      availableRewards: rewardDefinitions as RewardDefinition[],
      trackLessonStart,
      trackLessonComplete,
      trackQuizComplete,
      trackMissionStart,
      trackMissionSubmit,
      trackMissionComplete,
      trackGameComplete,
      purchaseReward,
    }),
    [
      state.totalXp,
      currentLevelSummary,
      ecoCoinSummary,
      streakSummary,
      state.activityTimeline,
      state.achievements,
      state.badges,
      state.dailyChallenges,
      state.rewardPurchases,
      purchaseReward,
      trackLessonComplete,
      trackLessonStart,
      trackMissionComplete,
      trackMissionStart,
      trackMissionSubmit,
      trackQuizComplete,
    ],
  )

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider')
  }
  return context
}

function calculateConsecutiveDays(dates: string[]) {
  const unique = [...new Set(dates)].sort()
  let streak = 0
  let previous = ''

  for (let i = unique.length - 1; i >= 0; i -= 1) {
    const date = unique[i]
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

function addDays(dateString: string, days: number) {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
