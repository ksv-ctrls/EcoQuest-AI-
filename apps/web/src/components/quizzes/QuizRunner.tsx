import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  isQuestionAnswered,
  QuizQuestionView,
} from '@/components/quizzes/QuizQuestionView'
import { QuizResults } from '@/components/quizzes/QuizResults'
import type { ActiveSession } from '@/context/QuizProgressContext'
import { useQuizProgress } from '@/context/QuizProgressContext'
import { useGamification } from '@/context/GamificationContext'
import { getQuizById, getSdgQuizCatalog } from '@/data/mock/quiz-catalog'
import type { Quiz, QuizAnswer, QuizSessionResult } from '@/types/quiz'

interface QuizRunnerProps {
  quiz: Quiz
}

export function QuizRunner({ quiz }: QuizRunnerProps) {
  const catalog = getSdgQuizCatalog(quiz.sdgId)
  const {
    startSession,
    submitAnswer,
    completeSession,
    saveResult,
  } = useQuizProgress()
  const { trackQuizComplete } = useGamification()

  const [session, setSession] = useState<ActiveSession | null>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [result, setResult] = useState<QuizSessionResult | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const questions = quiz.questions ?? []

  const initSession = useCallback(() => {
    const newSession = startSession(quiz.id)
    if (!newSession) return
    setSession(newSession)
    setAnswers([])
    setCurrentIndex(0)
    setResult(null)
    setShowExplanation(false)
  }, [quiz.id, startSession])

  useEffect(() => {
    initSession()
  }, [initSession])

  if (!quiz.questions?.length) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sage">Quiz questions are not available yet.</p>
        <Link to={`/quizzes/${quiz.sdgId}`} className="mt-4 inline-block">
          <Button variant="outline">Back to quizzes</Button>
        </Link>
      </div>
    )
  }

  if (result) {
    return (
      <QuizResults
        result={result}
        sdgColor={catalog?.color ?? '#276152'}
        onRetake={initSession}
      />
    )
  }

  if (!session) return null

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentIndex]
  const progress = ((currentIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !currentAnswer) return
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setShowExplanation(false)
    } else {
      const finalResult = completeSession(
        { ...session, answers },
        quiz,
      )
      saveResult(finalResult)
      setResult(finalResult)
      trackQuizComplete(finalResult)
    }
  }

  const handleAnswer = (value: QuizAnswer['value']) => {
    if (!currentQuestion || showExplanation) return

    if (currentQuestion.type === 'match') {
      const map = value as Record<string, string>
      const allFilled = currentQuestion.pairs.every((p) => map[p.id])
      if (!allFilled) return
    }

    const graded = submitAnswer(session, currentQuestion, value)
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = graded
      return next
    })
    setShowExplanation(true)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={`/quizzes/${quiz.sdgId}`}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="size-4" />
          Back to {catalog?.title ?? 'quizzes'}
        </Button>
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-primary-dark">
          {quiz.title}
        </h1>
        <p className="mt-1 text-sm text-sage">
          {quiz.questionCount} questions · {quiz.xpPerQuestion} XP per correct answer
        </p>
        <div className="mt-4">
          <ProgressBar value={progress} variant="gold" label="Quiz progress" />
        </div>
      </div>

      {currentQuestion ? (
        <QuizQuestionView
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          answer={showExplanation ? currentAnswer : undefined}
          onAnswer={handleAnswer}
          disabled={showExplanation}
        />
      ) : null}

      <div className="flex justify-end gap-3">
        {!showExplanation ? (
          <Button
            variant="primary"
            disabled={
              !currentQuestion ||
              !isQuestionAnswered(
                currentQuestion,
                currentAnswer,
              )
            }
            onClick={handleSubmitAnswer}
          >
            Check answer
          </Button>
        ) : (
          <Button variant="gold" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Next question →' : 'See results'}
          </Button>
        )}
      </div>
    </div>
  )
}

interface QuizSessionPageProps {
  sdgId: string
  quizId: string
}

export function QuizSessionPage({ sdgId, quizId }: QuizSessionPageProps) {
  const quiz = getQuizById(quizId)

  if (!quiz || quiz.sdgId !== sdgId) {
    return <Navigate to="/quizzes" replace />
  }

  return <QuizRunner quiz={quiz} />
}
