import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  EcoProfile,
  ProfileInput,
  UserProfile,
  UserProfileContextValue,
} from '@/types/user'
import {
  buildEcoProfile,
  getRecommendedLessonId,
  getRecommendedMissionId,
  getRecommendedQuizId,
  getRecommendedSdgIds,
} from '@/lib/personalization'
import { useAuth } from '@/context/AuthContext'
import { updateProfile } from '@/api/profileApi'

const STORAGE_KEY = 'ecoquest-user-profile'

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

function saveProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(loadProfile)

  useEffect(() => {
    if (isAuthenticated && user) {
      setProfile((prev) => {
        const backendProfile = (user as any).profile
        if (backendProfile && Object.keys(backendProfile).length > 0) {
          const merged = { ...prev, ...backendProfile } as UserProfile
          saveProfile(merged)
          return merged
        }
        if (prev) return prev
        return {
          id: user.id,
          displayName: user.name,
          fullName: user.name,
          age: 0,
          education: 'other',
          learningStyle: 'interactive',
          personalityType: 'explorer',
          impactAreas: [],
          sustainabilityHabits: [],
          createdAt: user.createdAt,
        }
      })
    } else if (!isAuthenticated) {
      setProfile(null)
    }
  }, [isAuthenticated, user])

  const ecoProfile = useMemo<EcoProfile | null>(() => {
    if (!profile) return null
    return buildEcoProfile(profile)
  }, [profile])

  const recommendedSdgIds = useMemo(() => {
    if (!profile) return []
    return getRecommendedSdgIds(profile)
  }, [profile])

  const recommendedLessonId = useMemo(() => {
    if (!profile || !ecoProfile) return null
    return getRecommendedLessonId(profile, ecoProfile)
  }, [profile, ecoProfile])

  const recommendedQuizId = useMemo(() => {
    if (!profile || !ecoProfile) return null
    return getRecommendedQuizId(profile, ecoProfile)
  }, [profile, ecoProfile])

  const recommendedMissionId = useMemo(() => {
    if (!profile || !ecoProfile) return null
    return getRecommendedMissionId(profile, ecoProfile)
  }, [profile, ecoProfile])

  const saveProfileData = useCallback((input: ProfileInput) => {
    const next: UserProfile = {
      id: profile?.id ?? `profile-${Date.now()}`,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
      ...input,
    }
    saveProfile(next)
    setProfile(next)

    updateProfile(input).catch((err) => {
      console.warn('Failed to sync profile to backend:', err)
    })
  }, [profile])

  const resetProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      profile,
      ecoProfile,
      hasProfile: Boolean(profile),
      recommendedSdgIds,
      recommendedLessonId,
      recommendedQuizId,
      recommendedMissionId,
      saveProfile: saveProfileData,
      resetProfile,
    }),
    [
      profile,
      ecoProfile,
      recommendedSdgIds,
      recommendedLessonId,
      recommendedQuizId,
      recommendedMissionId,
      saveProfileData,
      resetProfile,
    ],
  )

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext)
  if (!ctx) {
    throw new Error('useUserProfile must be used within UserProfileProvider')
  }
  return ctx
}
