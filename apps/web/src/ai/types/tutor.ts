import type { EcoProfile, UserProfile } from '@/types/user'

export type AiMessageRole = 'user' | 'assistant'

export interface AiTutorMessage {
  id: string
  role: AiMessageRole
  content: string
  createdAt: string
  detectedSdgIds?: string[]
  relatedLessons?: AiTutorResource[]
  relatedQuizzes?: AiTutorResource[]
  relatedMissions?: AiTutorResource[]
  relatedGames?: AiTutorResource[]
}

export interface AiTutorResource {
  id: string
  title: string
  description: string
  path: string
  sdgId?: string
}

export interface SdgKnowledgeEntry {
  id: string
  number: number
  title: string
  overview: string
  keywords: string[]
  keyFacts: string[]
  commonQuestions: string[]
  studentActions: string[]
}

export interface AiTutorEngineInput {
  query: string
  profile: UserProfile | null
  ecoProfile: EcoProfile | null
  preferredSdgIds: string[]
}

export interface AiTutorEngineResponse {
  content: string
  detectedSdgIds: string[]
  suggestedPrompts: string[]
  relatedLessons: AiTutorResource[]
  relatedQuizzes: AiTutorResource[]
  relatedMissions: AiTutorResource[]
  relatedGames: AiTutorResource[]
}

export interface AiTutorStats {
  questionsAsked: number
  favoriteTopics: string[]
  learningInterests: string[]
  lastConversationAt: string | null
}

export interface AiTutorContextValue {
  messages: AiTutorMessage[]
  suggestedPrompts: string[]
  stats: AiTutorStats
  isTyping: boolean
  sendMessage: (content: string) => void
  clearHistory: () => void
}
