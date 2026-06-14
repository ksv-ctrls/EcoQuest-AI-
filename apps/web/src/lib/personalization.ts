import { allLessons } from '@/data/mock/lesson-catalog'
import { allMissions } from '@/data/mock/mission-catalog'
import { allQuizzes } from '@/data/mock/quiz-catalog'
import { mockSdgGoals } from '@/data/mock/sdg'
import type { EcoProfile, UserProfile } from '@/types/user'

const learningStyleFormat: Record<UserProfile['learningStyle'], string> = {
  visual: 'Visual-first content that uses diagrams, charts, and imagery',
  interactive: 'Hands-on interactive experiences with challenges and missions',
  reading: 'Text-rich learning with summaries and reading guides',
  video: 'Short video lessons and story-based walkthroughs',
}

const personalityExperience: Record<UserProfile['personalityType'], string> = {
  explorer: 'More missions and discovery-focused SDGs to feed curiosity',
  competitive: 'Quizzes and leaderboard-style progress for fast motivation',
  creative: 'Project-based missions that invite experimentation',
  social: 'Community challenges and group-friendly impact activities',
}

const fallbackSdg = 'sdg-13'

function getSdgTitle(sdgId: string) {
  return mockSdgGoals.find((goal) => goal.id === sdgId)?.title ?? 'Climate Action'
}

export function buildEcoProfile(profile: UserProfile): EcoProfile {
  const primarySdgFocusId =
    profile.impactAreas[0] ?? fallbackSdg
  const secondarySdgFocusId =
    profile.impactAreas[1] ?? profile.impactAreas[0] ?? 'sdg-11'

  const sustainabilityScore = Math.min(
    100,
    25 + profile.sustainabilityHabits.length * 14 + profile.impactAreas.length * 2,
  )

  const recommendedContentFormat = learningStyleFormat[profile.learningStyle]
  const recommendedExperience = personalityExperience[profile.personalityType]
  const recommendedLearningPath = `Start with ${getSdgTitle(
    primarySdgFocusId,
  )} topics, then explore ${getSdgTitle(
    secondarySdgFocusId,
  )} through ${recommendedContentFormat.toLowerCase()}.`

  return {
    personalityType: profile.personalityType,
    learningStyle: profile.learningStyle,
    sustainabilityScore,
    primarySdgFocusId,
    secondarySdgFocusId,
    primarySdgTitle: getSdgTitle(primarySdgFocusId),
    secondarySdgTitle: getSdgTitle(secondarySdgFocusId),
    recommendedLearningPath,
    recommendedContentFormat,
    recommendedExperience,
  }
}

export function getRecommendedSdgIds(profile: UserProfile) {
  const selected = Array.from(new Set(profile.impactAreas))
  const fallbackGoals = ['sdg-13', 'sdg-11', 'sdg-15']
  return [...selected, ...fallbackGoals].slice(0, 6)
}

export function getRecommendedLessonId(
  _profile: UserProfile,
  ecoProfile: EcoProfile,
): string | null {
  const preferredSdgs = [ecoProfile.primarySdgFocusId, ecoProfile.secondarySdgFocusId]
  const match = allLessons.find((lesson) =>
    preferredSdgs.includes(lesson.sdgId),
  )
  return match?.id ?? allLessons[0]?.id ?? null
}

export function getRecommendedQuizId(
  _profile: UserProfile,
  ecoProfile: EcoProfile,
): string | null {
  const preferredSdgs = [ecoProfile.primarySdgFocusId, ecoProfile.secondarySdgFocusId]
  const match = allQuizzes.find((quiz) =>
    preferredSdgs.includes(quiz.sdgId),
  )
  return match?.id ?? allQuizzes[0]?.id ?? null
}

export function getRecommendedMissionId(
  profile: UserProfile,
  ecoProfile: EcoProfile,
): string | null {
  const preferredSdgs = [ecoProfile.primarySdgFocusId, ecoProfile.secondarySdgFocusId]
  const discoveryFirst = profile.personalityType === 'explorer'

  const mission = allMissions.find((item) =>
    preferredSdgs.includes(item.sdgId) &&
    (discoveryFirst ? !item.isPlaceholder : true),
  )
  if (mission) return mission.id

  const fallback = allMissions.find((item) =>
    preferredSdgs.includes(item.sdgId),
  )
  return fallback?.id ?? allMissions[0]?.id ?? null
}
