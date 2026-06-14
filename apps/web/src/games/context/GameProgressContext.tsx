import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { GameProgress, GameMetadata } from '../types/game'
import type { SDGGoal } from '../../types/sdg'
import { useAuth } from '@/context/AuthContext'
import { getProgressSummary } from '@/api/lessonApi'
import { saveGameProgress } from '@/api/gameApi'

interface GameProgressContextValue {
  gameProgress: Record<string, GameProgress>
  unlockGame: (gameId: string) => void
  recordGameAttempt: (gameId: string) => void
  completeGame: (game: GameMetadata, score?: number) => void
  updateGameProgress: (gameId: string, progress: Partial<GameProgress>) => void
  getGameProgress: (gameId: string) => GameProgress | undefined
  getSDGCompletionStatus: (sdgGoal: SDGGoal) => { completed: number; total: number }
}

const GameProgressContext = createContext<GameProgressContextValue | undefined>(undefined)

const STORAGE_KEY = 'eduquest_game_progress'

const INITIAL_GAME_PROGRESS: Record<string, GameProgress> = {}

function normalizeProgress(gameId: string, entry?: Partial<GameProgress>): GameProgress {
  return {
    gameId,
    isUnlocked: entry?.isUnlocked ?? false,
    isCompleted: entry?.isCompleted ?? false,
    bestScore: entry?.bestScore,
    lastPlayedAt: entry?.lastPlayedAt,
    progressValue: entry?.progressValue ?? 0,
    timesPlayed: entry?.timesPlayed ?? 0,
    completionCount: entry?.completionCount ?? 0,
    averageScore: entry?.averageScore ?? 0,
  }
}

export const GameProgressProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [gameProgress, setGameProgress] = useState<Record<string, GameProgress>>(INITIAL_GAME_PROGRESS)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Partial<GameProgress>>
        const normalized = Object.fromEntries(
          Object.entries(parsed).map(([gameId, entry]) => [gameId, normalizeProgress(gameId, entry)]),
        )
        setGameProgress(normalized)
      }
    } catch {
      setGameProgress(INITIAL_GAME_PROGRESS)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameProgress))
  }, [gameProgress])

  // ── Mount-time hydration from backend ──────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      getProgressSummary()
        .then((data) => {
          if (data && data.games && data.games.length > 0) {
            setGameProgress((prev) => {
              const next = { ...prev }
              data.games.forEach((item: any) => {
                const gId: string = item.gameId
                if (!gId) return
                const existing = prev[gId]
                // Merge backend data — prefer backend if it has a higher score or completion
                const backendEntry = normalizeProgress(gId, {
                  isUnlocked: item.isUnlocked ?? item.completed ?? false,
                  isCompleted: item.isCompleted ?? item.completed ?? false,
                  bestScore: item.bestScore ?? item.score,
                  lastPlayedAt: item.lastPlayedAt ?? item.updatedAt,
                  progressValue: item.progressValue ?? (item.completed ? 100 : 0),
                  timesPlayed: item.timesPlayed ?? (existing?.timesPlayed || 0),
                  completionCount: item.completionCount ?? (existing?.completionCount || 0),
                  averageScore: item.averageScore ?? (existing?.averageScore || 0),
                })

                if (!existing) {
                  next[gId] = backendEntry
                } else {
                  // Merge: prefer higher bestScore, keep local timesPlayed if larger
                  next[gId] = {
                    ...existing,
                    isUnlocked: existing.isUnlocked || backendEntry.isUnlocked,
                    isCompleted: existing.isCompleted || backendEntry.isCompleted,
                    bestScore: (existing.bestScore != null || backendEntry.bestScore != null)
                      ? Math.max(existing.bestScore ?? 0, backendEntry.bestScore ?? 0)
                      : undefined,
                    lastPlayedAt: (backendEntry.lastPlayedAt && (!existing.lastPlayedAt || backendEntry.lastPlayedAt > existing.lastPlayedAt))
                      ? backendEntry.lastPlayedAt
                      : existing.lastPlayedAt,
                    progressValue: Math.max(existing.progressValue ?? 0, backendEntry.progressValue ?? 0),
                    timesPlayed: Math.max(existing.timesPlayed ?? 0, backendEntry.timesPlayed ?? 0),
                    completionCount: Math.max(existing.completionCount ?? 0, backendEntry.completionCount ?? 0),
                    averageScore: backendEntry.averageScore || existing.averageScore,
                  }
                }
              })
              window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
              return next
            })
          }
        })
        .catch((err) => {
          console.warn('Failed to sync game progress from backend:', err)
        })
    }
  }, [isAuthenticated])

  const unlockGame = useCallback((gameId: string) => {
    setGameProgress((current) => ({
      ...current,
      [gameId]: normalizeProgress(gameId, {
        ...current[gameId],
        isUnlocked: true,
      }),
    }))
  }, [])

  const recordGameAttempt = useCallback((gameId: string) => {
    setGameProgress((current) => {
      const previous = normalizeProgress(gameId, current[gameId])
      return {
        ...current,
        [gameId]: {
          ...previous,
          isUnlocked: true,
          lastPlayedAt: new Date().toISOString(),
          timesPlayed: previous.timesPlayed + 1,
        },
      }
    })
  }, [])

  const completeGame = useCallback((game: GameMetadata, score?: number) => {
    setGameProgress((current) => {
      const previous = normalizeProgress(game.id, current[game.id])
      const bestScore = typeof score === 'number'
        ? Math.max(previous.bestScore ?? 0, score)
        : previous.bestScore
      const completionCount = previous.completionCount + 1
      const averageScore = typeof score === 'number'
        ? Math.round(((previous.averageScore * previous.completionCount) + score) / completionCount)
        : previous.averageScore

      return {
        ...current,
        [game.id]: {
          ...previous,
          gameId: game.id,
          isUnlocked: true,
          isCompleted: true,
          bestScore,
          lastPlayedAt: new Date().toISOString(),
          progressValue: 100,
          completionCount,
          averageScore,
        },
      }
    })

    // ── Write-through to backend ──────────────────────────────────────
    saveGameProgress({
      gameId: game.id,
      score: score ?? 0,
      completed: true,
      completionTime: 0,
    }).catch((err) => {
      console.warn('Failed to sync game completion to backend:', err)
    })
  }, [])

  const updateGameProgress = useCallback((gameId: string, progress: Partial<GameProgress>) => {
    setGameProgress((current) => ({
      ...current,
      [gameId]: {
        ...normalizeProgress(gameId, current[gameId]),
        ...progress,
        gameId,
      },
    }))
  }, [])

  const getGameProgress = useCallback((gameId: string) => gameProgress[gameId], [gameProgress])

  const getSDGCompletionStatus = useCallback(
    (sdgGoal: SDGGoal) => {
      const total = sdgGoal.relatedGameIds.length
      const completed = sdgGoal.relatedGameIds.reduce((count, gameId) => {
        const progress = gameProgress[gameId]
        return count + (progress?.isCompleted ? 1 : 0)
      }, 0)

      return { completed, total }
    },
    [gameProgress],
  )

  const value = useMemo(
    () => ({
      gameProgress,
      unlockGame,
      recordGameAttempt,
      completeGame,
      updateGameProgress,
      getGameProgress,
      getSDGCompletionStatus,
    }),
    [
      gameProgress,
      unlockGame,
      recordGameAttempt,
      completeGame,
      updateGameProgress,
      getGameProgress,
      getSDGCompletionStatus,
    ],
  )

  return <GameProgressContext.Provider value={value}>{children}</GameProgressContext.Provider>
}

export const useGameProgress = () => {
  const context = useContext(GameProgressContext)
  if (!context) {
    throw new Error('useGameProgress must be used within GameProgressProvider')
  }
  return context
}
