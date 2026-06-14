import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { generateAiTutorResponse } from '@/ai/data/ai-response-engine'
import { DEFAULT_AI_TUTOR_PROMPTS } from '@/ai/data/suggested-prompts'
import { getSdgKnowledgeById } from '@/ai/data/sdg-knowledge-base'
import type { AiTutorContextValue, AiTutorMessage, AiTutorStats } from '@/ai/types/tutor'
import { useUserProfile } from '@/context/UserProfileContext'

const STORAGE_KEY = 'ecoquest-ai-tutor-history'

interface StoredTutorState {
  messages: AiTutorMessage[]
  suggestedPrompts: string[]
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function loadStoredState(): StoredTutorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { messages: [], suggestedPrompts: DEFAULT_AI_TUTOR_PROMPTS }
    }
    const parsed = JSON.parse(raw) as StoredTutorState
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      suggestedPrompts: parsed.suggestedPrompts?.length
        ? parsed.suggestedPrompts
        : DEFAULT_AI_TUTOR_PROMPTS,
    }
  } catch {
    return { messages: [], suggestedPrompts: DEFAULT_AI_TUTOR_PROMPTS }
  }
}

function saveStoredState(state: StoredTutorState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function buildStats(messages: AiTutorMessage[], learningInterests: string[]): AiTutorStats {
  const userMessages = messages.filter((message) => message.role === 'user')
  const topicCounts = new Map<string, number>()

  for (const message of messages) {
    for (const sdgId of message.detectedSdgIds ?? []) {
      const entry = getSdgKnowledgeById(sdgId)
      if (entry) {
        topicCounts.set(entry.title, (topicCounts.get(entry.title) ?? 0) + 1)
      }
    }
  }

  const favoriteTopics = [...topicCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([title]) => title)
    .slice(0, 4)

  return {
    questionsAsked: userMessages.length,
    favoriteTopics,
    learningInterests,
    lastConversationAt: messages.at(-1)?.createdAt ?? null,
  }
}

const AiTutorContext = createContext<AiTutorContextValue | null>(null)

export function AiTutorProvider({ children }: { children: ReactNode }) {
  const { profile, ecoProfile, recommendedSdgIds } = useUserProfile()
  const [messages, setMessages] = useState<AiTutorMessage[]>(() => loadStoredState().messages)
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(
    () => loadStoredState().suggestedPrompts,
  )
  const [isTyping, setIsTyping] = useState(false)

  const persist = useCallback((nextMessages: AiTutorMessage[], nextPrompts: string[]) => {
    saveStoredState({ messages: nextMessages, suggestedPrompts: nextPrompts })
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return

      const now = new Date().toISOString()
      const userMessage: AiTutorMessage = {
        id: createId('user'),
        role: 'user',
        content: trimmed,
        createdAt: now,
      }

      const engineResponse = generateAiTutorResponse({
        query: trimmed,
        profile,
        ecoProfile,
        preferredSdgIds: recommendedSdgIds,
      })

      const assistantMessage: AiTutorMessage = {
        id: createId('assistant'),
        role: 'assistant',
        content: engineResponse.content,
        createdAt: new Date().toISOString(),
        detectedSdgIds: engineResponse.detectedSdgIds,
        relatedLessons: engineResponse.relatedLessons,
        relatedQuizzes: engineResponse.relatedQuizzes,
        relatedMissions: engineResponse.relatedMissions,
        relatedGames: engineResponse.relatedGames,
      }

      setIsTyping(true)
      setMessages((current) => {
        const next = [...current, userMessage]
        persist(next, suggestedPrompts)
        return next
      })

      window.setTimeout(() => {
        setMessages((current) => {
          const next = [...current, assistantMessage]
          persist(next, engineResponse.suggestedPrompts)
          return next
        })
        setSuggestedPrompts(engineResponse.suggestedPrompts)
        setIsTyping(false)
      }, 650)
    },
    [ecoProfile, persist, profile, recommendedSdgIds, suggestedPrompts],
  )

  const clearHistory = useCallback(() => {
    setMessages([])
    setSuggestedPrompts(DEFAULT_AI_TUTOR_PROMPTS)
    setIsTyping(false)
    persist([], DEFAULT_AI_TUTOR_PROMPTS)
  }, [persist])

  const learningInterests = useMemo(
    () =>
      recommendedSdgIds
        .map((id) => getSdgKnowledgeById(id)?.title)
        .filter((title): title is string => Boolean(title)),
    [recommendedSdgIds],
  )

  const stats = useMemo(
    () => buildStats(messages, learningInterests),
    [learningInterests, messages],
  )

  const value = useMemo(
    () => ({
      messages,
      suggestedPrompts,
      stats,
      isTyping,
      sendMessage,
      clearHistory,
    }),
    [clearHistory, isTyping, messages, sendMessage, stats, suggestedPrompts],
  )

  return <AiTutorContext.Provider value={value}>{children}</AiTutorContext.Provider>
}

export function useAiTutor() {
  const ctx = useContext(AiTutorContext)
  if (!ctx) {
    throw new Error('useAiTutor must be used within AiTutorProvider')
  }
  return ctx
}
