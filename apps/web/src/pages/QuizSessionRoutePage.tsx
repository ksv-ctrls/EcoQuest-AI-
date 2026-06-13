import { Navigate, useParams } from 'react-router-dom'
import { QuizSessionPage } from '@/components/quizzes/QuizRunner'

export function QuizSessionRoutePage() {
  const { sdgId, quizId } = useParams<{ sdgId: string; quizId: string }>()

  if (!sdgId || !quizId) return <Navigate to="/quizzes" replace />

  return <QuizSessionPage sdgId={sdgId} quizId={quizId} />
}
