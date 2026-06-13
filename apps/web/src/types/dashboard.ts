export type LessonStatus = 'completed' | 'in_progress' | 'not_started'

export interface User {
  id: string
  displayName: string
  fullName: string
  email: string
  school: string
  initials: string
  level: number
  rank: number
  ecoPoints: number
  streakDays: number
}

export interface DashboardStats {
  ecoPoints: number
  lessonsCompleted: number
  totalLessons: number
  quizzesCompleted: number
  gamesPlayed: number
}

export interface LessonProgressItem {
  id: string
  title: string
  status: LessonStatus
  sdgIds: number[]
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

export interface Badge {
  id: string
  emoji: string
  title: string
  description: string
  earned: boolean
}

export interface WeeklyGoal {
  label: string
  current: number
  target: number
}

export interface LevelProgress {
  currentLevel: number
  nextLevel: number
  progressPercent: number
  pointsToNext: number
}

export interface DashboardData {
  stats: DashboardStats
  lessonProgress: LessonProgressItem[]
  challenges: Challenge[]
  badges: Badge[]
  weeklyGoal: WeeklyGoal
  levelProgress: LevelProgress
}
