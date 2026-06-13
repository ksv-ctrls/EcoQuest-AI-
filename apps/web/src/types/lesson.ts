export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type LessonStatus =
  | 'not_started'
  | 'started'
  | 'in_progress'
  | 'completed'

export interface KeyConcept {
  term: string
  definition: string
}

export interface KnowledgeCard {
  id: string
  title: string
  body: string
  emoji?: string
}

export interface InfographicPlaceholder {
  id: string
  title: string
  caption: string
}

export interface LessonContent {
  heroSubtitle: string
  summary: string
  objectives: string[]
  keyConcepts: KeyConcept[]
  knowledgeCards: KnowledgeCard[]
  infographics: InfographicPlaceholder[]
  reflectionQuestions: string[]
  keyTakeaways: string[]
}

export interface Lesson {
  id: string
  sdgId: string
  sdgNumber: number
  title: string
  description: string
  difficulty: LessonDifficulty
  durationMinutes: number
  order: number
  content?: LessonContent
}

export interface LessonProgressEntry {
  status: LessonStatus
  updatedAt: string
}

export type LessonProgressMap = Record<string, LessonProgressEntry>

export interface SDGLessonCatalog {
  sdgId: string
  sdgNumber: number
  title: string
  overview: string
  color: string
  lessons: Lesson[]
}

export interface SDGCatalogStats {
  sdgId: string
  lessonCount: number
  completionPercent: number
  difficulty: LessonDifficulty
  estimatedMinutes: number
  completedCount: number
}

export interface LearningStats {
  lessonCompletionPercent: number
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  totalLearningHours: number
  sdgStats: SDGCatalogStats[]
}

export interface DashboardLessonInsight {
  lesson: Lesson
  sdgId: string
  sdgTitle: string
  sdgColor: string
  status: LessonStatus
  progressPercent: number
}
