export type EducationLevel =
  | 'primary'
  | 'secondary'
  | 'high_school'
  | 'college'
  | 'other'

export type LearningStyle = 'visual' | 'interactive' | 'reading' | 'video'

export type PersonalityType = 'explorer' | 'competitive' | 'creative' | 'social'

export type SustainabilityHabit =
  | 'recycling'
  | 'water_conservation'
  | 'energy_saving'
  | 'public_transport'
  | 'waste_segregation'

export interface UserProfile {
  id: string
  displayName: string
  fullName: string
  age: number
  education: EducationLevel
  learningStyle: LearningStyle
  personalityType: PersonalityType
  impactAreas: string[]
  sustainabilityHabits: SustainabilityHabit[]
  createdAt: string
}

export interface ProfileInput
  extends Omit<UserProfile, 'id' | 'createdAt'> {}

export interface EcoProfile {
  personalityType: PersonalityType
  learningStyle: LearningStyle
  sustainabilityScore: number
  primarySdgFocusId: string
  secondarySdgFocusId: string
  primarySdgTitle: string
  secondarySdgTitle: string
  recommendedLearningPath: string
  recommendedContentFormat: string
  recommendedExperience: string
}

export interface UserProfileContextValue {
  profile: UserProfile | null
  ecoProfile: EcoProfile | null
  hasProfile: boolean
  recommendedSdgIds: string[]
  recommendedLessonId: string | null
  recommendedQuizId: string | null
  recommendedMissionId: string | null
  saveProfile: (profile: ProfileInput) => void
  resetProfile: () => void
}
