import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import type { GameMetadata } from '../types/game'

interface QuizQuestion {
  question: string
  options: { id: string; label: string; isCorrect: boolean }[]
}

interface QuizEngineProps {
  game: GameMetadata
  onComplete: (score: number, summary: string) => void
}

export function QuizEngine({ game, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [answered, setAnswered] = useState(false)

  const questions: QuizQuestion[] = useMemo(() => {
    switch (game.id) {
      case 'sdg-3-health-quest':
        return [
          {
            question: 'Which habit supports long-term public health?',
            options: [
              { id: 'a', label: 'Regular physical activity', isCorrect: true },
              { id: 'b', label: 'Skipping vaccines', isCorrect: false },
              { id: 'c', label: 'Avoiding all vegetables', isCorrect: false },
            ],
          },
          {
            question: 'What helps reduce disease spread?',
            options: [
              { id: 'a', label: 'Safe water access', isCorrect: true },
              { id: 'b', label: 'Ignoring sanitation', isCorrect: false },
              { id: 'c', label: 'Sharing unwashed dishes', isCorrect: false },
            ],
          },
          {
            question: 'A strong health system includes:',
            options: [
              { id: 'a', label: 'Equitable care for everyone', isCorrect: true },
              { id: 'b', label: 'Only private clinics', isCorrect: false },
              { id: 'c', label: 'Delayed emergency care', isCorrect: false },
            ],
          },
        ]
      case 'sdg-10-justice-climb':
        return [
          {
            question: 'Equity means:',
            options: [
              { id: 'a', label: 'Fair access based on need', isCorrect: true },
              { id: 'b', label: 'Equal treatment in every situation', isCorrect: false },
              { id: 'c', label: 'Advantage for wealthy groups', isCorrect: false },
            ],
          },
          {
            question: 'Which policy helps reduce inequality?',
            options: [
              { id: 'a', label: 'Progressive taxation', isCorrect: true },
              { id: 'b', label: 'Lowering minimum wage', isCorrect: false },
              { id: 'c', label: 'Restricting education access', isCorrect: false },
            ],
          },
          {
            question: 'Inclusive societies prioritize:',
            options: [
              { id: 'a', label: 'Participation of all groups', isCorrect: true },
              { id: 'b', label: 'Exclusive social clubs', isCorrect: false },
              { id: 'c', label: 'Punishing different voices', isCorrect: false },
            ],
          },
        ]
      case 'sdg-16-peace-builder':
        return [
          {
            question: 'Peace is stronger when communities have:',
            options: [
              { id: 'a', label: 'Access to justice', isCorrect: true },
              { id: 'b', label: 'Limited communication', isCorrect: false },
              { id: 'c', label: 'Unchecked corruption', isCorrect: false },
            ],
          },
          {
            question: 'A fair legal system supports:',
            options: [
              { id: 'a', label: 'Trust and stability', isCorrect: true },
              { id: 'b', label: 'Secret deals', isCorrect: false },
              { id: 'c', label: 'Random punishments', isCorrect: false },
            ],
          },
          {
            question: 'Non-violent conflict resolution prioritizes:',
            options: [
              { id: 'a', label: 'Listening and dialogue', isCorrect: true },
              { id: 'b', label: 'Escalation and fear', isCorrect: false },
              { id: 'c', label: 'Ignoring problems', isCorrect: false },
            ],
          },
        ]
      default:
        return []
    }
  }, [game.id])

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const handleAnswer = () => {
    if (!selectedOption || !currentQuestion) {
      return
    }

    const option = currentQuestion.options.find((item) => item.id === selectedOption)
    if (option?.isCorrect) {
      setCorrectAnswers((current) => current + 1)
    }
    setAnswered(true)
  }

  const handleNext = () => {
    if (!currentQuestion) {
      return
    }

    if (isLastQuestion) {
      const score = correctAnswers * 30
      onComplete(score, `Answered ${correctAnswers}/${questions.length} questions correctly.`)
      return
    }

    setCurrentIndex((current) => current + 1)
    setSelectedOption(null)
    setAnswered(false)
  }

  if (questions.length === 0) {
    return <div>No quiz questions available for this game.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.title} — Quiz challenge</CardTitle>
        <CardDescription>Answer the quiz questions to earn points for your SDG mission.</CardDescription>
      </CardHeader>

      <div className="space-y-4 pt-4">
        <div className="rounded-lg border border-muted bg-muted p-4">
          <p className="text-sm text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
          <p className="mt-2 text-lg font-semibold">{currentQuestion.question}</p>
        </div>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => (
            <Button
              key={option.id}
              variant={selectedOption === option.id ? 'primary' : 'outline'}
              className="text-left"
              onClick={() => setSelectedOption(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          {!answered ? (
            <Button disabled={!selectedOption} onClick={handleAnswer}>
              Submit answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {isLastQuestion ? 'Finish quiz' : 'Next question'}
            </Button>
          )}
        </div>

        {answered && selectedOption && (
          <div className="rounded-lg border border-muted bg-cream p-4 text-sm text-slate-700">
            {currentQuestion.options.find((option) => option.id === selectedOption)?.isCorrect
              ? 'Correct! Good work.'
              : 'Incorrect — keep learning and try the next question.'}
          </div>
        )}
      </div>
    </Card>
  )
}
