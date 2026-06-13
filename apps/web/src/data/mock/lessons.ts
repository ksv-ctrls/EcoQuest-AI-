import {
  allLessons,
  getLessonsBySdgNumber,
  getLessonById,
} from '@/data/mock/lesson-catalog'

export type { Lesson } from '@/types/lesson'

/** @deprecated Use lesson-catalog exports — kept for SDG Explorer compatibility. */
export interface LessonSummary {
  id: string
  title: string
  sdgIds: number[]
  durationMinutes: number
}

export const mockLessons: LessonSummary[] = allLessons.map((lesson) => ({
  id: lesson.id,
  title: lesson.title,
  sdgIds: [lesson.sdgNumber],
  durationMinutes: lesson.durationMinutes,
}))

export {
  getLessonsBySdgNumber,
  getLessonsBySdgNumber as getLessonsBySdg,
  getLessonById,
  allLessons,
}
