import { Navigate, useParams } from 'react-router-dom'
import { LessonReader } from '@/components/lessons/LessonReader'
import {
  getLessonById,
  getLessonsBySdgId,
  getSdgCatalog,
} from '@/data/mock/lesson-catalog'

export function LessonReaderPage() {
  const { sdgId, lessonId } = useParams<{ sdgId: string; lessonId: string }>()

  if (!sdgId || !lessonId) return <Navigate to="/lessons" replace />

  const catalog = getSdgCatalog(sdgId)
  const lesson = getLessonById(lessonId)

  if (!catalog || !lesson || lesson.sdgId !== sdgId) {
    return <Navigate to="/lessons" replace />
  }

  const belongsToSdg = getLessonsBySdgId(sdgId).some((item) => item.id === lessonId)
  if (!belongsToSdg) return <Navigate to="/lessons" replace />

  return (
    <LessonReader
      lesson={lesson}
      sdgTitle={catalog.title}
      sdgColor={catalog.color}
    />
  )
}
