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
  allMissions,
  getMissionById,
  getMissionProgressStats,
  getMissionState,
} from '@/data/mock/mission-catalog'
import { mockSdgGoals } from '@/data/mock/sdg'
import type {
  DashboardMissionInsight,
  Mission,
  MissionProgressMap,
  MissionProgressStats,
  MissionState,
  MissionSubmission,
} from '@/types/mission'
import { useAuth } from '@/context/AuthContext'
import { getProgressSummary } from '@/api/lessonApi'
import { submitMissionProgress } from '@/api/missionApi'

const STORAGE_KEY = 'ecoquest-mission-progress'

const defaultProgress: MissionProgressMap = {
  'water-week': {
    state: 'completed',
    updatedAt: '2026-06-10T16:00:00.000Z',
    submission: {
      notes: 'Saved ~400L by fixing a leak and shorter showers.',
      photoName: 'water-log.jpg',
      submittedAt: '2026-06-09T12:00:00.000Z',
    },
  },
  'climate-action-week': {
    state: 'in_progress',
    updatedAt: '2026-06-12T09:00:00.000Z',
  },
  'urban-green': {
    state: 'submitted',
    updatedAt: '2026-06-11T18:00:00.000Z',
    submission: {
      notes: 'Proposed a bike rack near the school gate.',
      photoName: 'proposal-sketch.jpg',
      submittedAt: '2026-06-11T18:00:00.000Z',
    },
  },
  'wildlife-doc': {
    state: 'approved',
    updatedAt: '2026-06-08T14:00:00.000Z',
    submission: {
      notes: 'Documented 10 species in the school garden.',
      submittedAt: '2026-06-07T10:00:00.000Z',
    },
  },
}

function loadProgress(): MissionProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    return { ...defaultProgress, ...JSON.parse(raw) } as MissionProgressMap
  } catch {
    return defaultProgress
  }
}

function saveProgress(progress: MissionProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function toInsight(mission: Mission, progress: MissionProgressMap): DashboardMissionInsight {
  const sdg = mockSdgGoals.find((g) => g.id === mission.sdgId)
  return {
    mission,
    sdgColor: sdg?.color ?? '#276152',
    state: getMissionState(mission.id, progress, mission),
  }
}

interface MissionProgressContextValue {
  progress: MissionProgressMap
  missionStats: MissionProgressStats
  activeMissions: DashboardMissionInsight[]
  recommendedMission: DashboardMissionInsight | null
  getState: (missionId: string) => MissionState
  startMission: (missionId: string) => void
  submitMission: (missionId: string, submission: Omit<MissionSubmission, 'submittedAt'>) => void
  approveMission: (missionId: string) => void
  completeMission: (missionId: string) => void
}

const MissionProgressContext = createContext<MissionProgressContextValue | null>(null)

export function MissionProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<MissionProgressMap>(loadProgress)
  const { isAuthenticated } = useAuth()

  // ── Mount-time hydration from backend ──────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      getProgressSummary()
        .then((data) => {
          if (data && data.missions && data.missions.length > 0) {
            setProgress((prev) => {
              const next = { ...prev }
              data.missions.forEach((item: any) => {
                const missionId: string = item.missionId
                if (!missionId) return
                const existing = prev[missionId]
                const backendUpdatedAt = item.updatedAt || item.createdAt || ''
                const localUpdatedAt = existing?.updatedAt || ''
                // Prefer whichever record is more recent
                if (!existing || backendUpdatedAt > localUpdatedAt) {
                  next[missionId] = {
                    state: (item.status as MissionState) || 'submitted',
                    updatedAt: backendUpdatedAt,
                    submission: item.notes
                      ? {
                          notes: item.notes,
                          photoName: item.imageUrl || undefined,
                          submittedAt: item.createdAt || backendUpdatedAt,
                        }
                      : existing?.submission,
                  }
                }
              })
              saveProgress(next)
              return next
            })
          }
        })
        .catch((err) => {
          console.warn('Failed to sync mission progress from backend:', err)
        })
    }
  }, [isAuthenticated])

  const updateState = useCallback(
    (missionId: string, state: MissionState, submission?: MissionSubmission) => {
      setProgress((prev) => {
        const next: MissionProgressMap = {
          ...prev,
          [missionId]: {
            state,
            updatedAt: new Date().toISOString(),
            submission: submission ?? prev[missionId]?.submission,
          },
        }
        saveProgress(next)
        return next
      })
    },
    [],
  )

  const getState = useCallback(
    (missionId: string) => {
      const mission = getMissionById(missionId)
      if (!mission) return 'locked' as MissionState
      return getMissionState(missionId, progress, mission)
    },
    [progress],
  )

  const startMission = useCallback(
    (missionId: string) => {
      const mission = getMissionById(missionId)
      if (!mission || mission.isPlaceholder) return
      const current = getState(missionId)
      if (current === 'available' || current === 'locked') {
        updateState(missionId, 'in_progress')
      }
    },
    [getState, updateState],
  )

  const submitMission = useCallback(
    (missionId: string, data: Omit<MissionSubmission, 'submittedAt'>) => {
      const submission: MissionSubmission = {
        ...data,
        submittedAt: new Date().toISOString(),
      }
      updateState(missionId, 'submitted', submission)

      // ── Write-through to backend ──────────────────────────────────
      submitMissionProgress({
        missionId,
        notes: data.notes,
        imageUrl: data.photoName,
        status: 'submitted',
      }).catch((err) => {
        console.warn('Failed to sync mission submission to backend:', err)
      })
    },
    [updateState],
  )

  const approveMission = useCallback(
    (missionId: string) => {
      updateState(missionId, 'approved')
    },
    [updateState],
  )

  const completeMission = useCallback(
    (missionId: string) => {
      updateState(missionId, 'completed')
    },
    [updateState],
  )

  const missionStats = useMemo(() => getMissionProgressStats(progress), [progress])

  const insights = useMemo(
    () => allMissions.map((m) => toInsight(m, progress)),
    [progress],
  )

  const activeMissions = useMemo(
    () =>
      insights.filter((i) =>
        ['in_progress', 'submitted', 'approved'].includes(i.state),
      ),
    [insights],
  )

  const recommendedMission = useMemo(() => {
    const available = insights.filter(
      (i) => i.state === 'available' && !i.mission.isPlaceholder,
    )
    if (available.length > 0) return available[0]!
    const inProgress = insights.find((i) => i.state === 'in_progress')
    return inProgress ?? null
  }, [insights])

  const value = useMemo(
    () => ({
      progress,
      missionStats,
      activeMissions,
      recommendedMission,
      getState,
      startMission,
      submitMission,
      approveMission,
      completeMission,
    }),
    [
      progress,
      missionStats,
      activeMissions,
      recommendedMission,
      getState,
      startMission,
      submitMission,
      approveMission,
      completeMission,
    ],
  )

  return (
    <MissionProgressContext.Provider value={value}>
      {children}
    </MissionProgressContext.Provider>
  )
}

export function useMissionProgress() {
  const ctx = useContext(MissionProgressContext)
  if (!ctx) {
    throw new Error('useMissionProgress must be used within MissionProgressProvider')
  }
  return ctx
}
