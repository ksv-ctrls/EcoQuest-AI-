export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'match'
  | 'scenario'

export interface MultipleChoiceQuestion {
  id: string
  type: 'multiple_choice'
  topic: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface TrueFalseQuestion {
  id: string
  type: 'true_false'
  topic: string
  text: string
  correctAnswer: boolean
  explanation: string
}

export interface MatchPair {
  id: string
  left: string
  right: string
}

export interface MatchQuestion {
  id: string
  type: 'match'
  topic: string
  text: string
  pairs: MatchPair[]
  explanation: string
}

export interface ScenarioQuestion {
  id: string
  type: 'scenario'
  topic: string
  scenario: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | MatchQuestion
  | ScenarioQuestion

export interface Quiz {
  id: string
  lessonId: string
  sdgId: string
  sdgNumber: number
  title: string
  description: string
  difficulty: QuizDifficulty
  questionCount: number
  estimatedMinutes: number
  xpPerQuestion: number
  questions?: QuizQuestion[]
}

export interface SDGQuizCatalog {
  sdgId: string
  sdgNumber: number
  title: string
  overview: string
  color: string
  quizzes: Quiz[]
}

export interface SDGQuizStats {
  sdgId: string
  quizCount: number
  completionPercent: number
  difficulty: QuizDifficulty
  estimatedMinutes: number
  averageAccuracy: number
}

export interface QuizAnswer {
  questionId: string
  isCorrect: boolean
  /** MCQ / scenario: selected index. True/false: 0|1. Match: JSON map leftId→rightId */
  value: number | Record<string, string>
}

export interface QuizSessionResult {
  quizId: string
  lessonId: string
  sdgId: string
  sdgNumber: number
  quizTitle: string
  startTime: string
  completionTime: string
  timeTakenSeconds: number
  correctCount: number
  totalQuestions: number
  score: number
  accuracy: number
  xpEarned: number
  strengthAreas: string[]
  improvementAreas: string[]
  recommendedLessonId: string
  recommendedMissionId: string
}

export interface QuizProgressStats {
  totalQuizzes: number
  completedQuizzes: number
  averageAccuracy: number
  totalXpEarned: number
  currentStreak: number
  quizCompletionPercent: number
}

export interface DashboardQuizInsight {
  quiz: Quiz
  sdgId: string
  sdgTitle: string
  sdgColor: string
  lastResult?: QuizSessionResult
  bestAccuracy: number
}
