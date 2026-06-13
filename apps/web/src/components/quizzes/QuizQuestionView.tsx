import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { isQuestionAnswered } from '@/lib/quiz-engine'
import { questionTypeLabels } from '@/lib/quiz-labels'
import type { QuizAnswer, QuizQuestion } from '@/types/quiz'
import { cn } from '@/lib/cn'

interface QuizQuestionViewProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  answer?: QuizAnswer
  onAnswer: (value: QuizAnswer['value']) => void
  disabled?: boolean
}

export function QuizQuestionView({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswer,
  disabled,
}: QuizQuestionViewProps) {
  return (
    <Card variant="elevated" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-sage">
          Question {questionNumber} of {totalQuestions}
        </span>
        <Badge variant="default" className="text-[10px]">
          {questionTypeLabels[question.type]}
        </Badge>
      </div>

      {'scenario' in question && question.scenario ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-primary-dark">
          <p className="mb-1 text-xs font-semibold uppercase text-gold">Scenario</p>
          {question.scenario}
        </div>
      ) : null}

      <p className="text-base font-medium leading-relaxed text-primary-dark">
        {question.text}
      </p>

      <QuestionInput
        question={question}
        answer={answer}
        onAnswer={onAnswer}
        disabled={disabled}
      />

      {answer && 'explanation' in question ? (
        <p className="border-l-2 border-primary-green pl-3 text-sm text-sage">
          {question.explanation}
        </p>
      ) : null}
    </Card>
  )
}

function QuestionInput({
  question,
  answer,
  onAnswer,
  disabled,
}: {
  question: QuizQuestion
  answer?: QuizAnswer
  onAnswer: (value: QuizAnswer['value']) => void
  disabled?: boolean
}) {
  switch (question.type) {
    case 'multiple_choice':
    case 'scenario':
      return (
        <OptionList
          options={question.options}
          selected={typeof answer?.value === 'number' ? answer.value : -1}
          onSelect={onAnswer}
          disabled={disabled}
          showResult={Boolean(answer)}
          correctIndex={question.correctIndex}
        />
      )
    case 'true_false':
      return (
        <div className="flex gap-3">
          {[true, false].map((val, index) => (
            <Button
              key={String(val)}
              variant={
                answer?.value === index
                  ? answer.isCorrect
                    ? 'primary'
                    : 'gold'
                  : 'outline'
              }
              className={cn(
                'flex-1',
                answer &&
                  index === (question.correctAnswer ? 1 : 0) &&
                  'ring-2 ring-primary-green',
              )}
              disabled={disabled || Boolean(answer)}
              onClick={() => onAnswer(index)}
            >
              {val ? 'True' : 'False'}
            </Button>
          ))}
        </div>
      )
    case 'match':
      return (
        <MatchInput
          question={question}
          answer={answer}
          onAnswer={onAnswer}
          disabled={disabled}
        />
      )
  }
}

function OptionList({
  options,
  selected,
  onSelect,
  disabled,
  showResult,
  correctIndex,
}: {
  options: string[]
  selected: number
  onSelect: (index: number) => void
  disabled?: boolean
  showResult?: boolean
  correctIndex: number
}) {
  const labels = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          disabled={disabled || showResult}
          onClick={() => onSelect(index)}
          className={cn(
            'flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
            selected === index
              ? 'border-primary-green bg-primary-green/10 text-primary-dark'
              : 'border-border bg-cream text-primary-dark hover:border-primary-green/40',
            showResult &&
              index === correctIndex &&
              'border-primary-green bg-primary-green/15',
            showResult &&
              selected === index &&
              index !== correctIndex &&
              'border-gold bg-gold/10',
          )}
        >
          <span className="font-semibold text-sage">{labels[index]}</span>
          <span>{option}</span>
        </button>
      ))}
    </div>
  )
}

function MatchInput({
  question,
  answer,
  onAnswer,
  disabled,
}: {
  question: Extract<QuizQuestion, { type: 'match' }>
  answer?: QuizAnswer
  onAnswer: (value: Record<string, string>) => void
  disabled?: boolean
}) {
  const currentMap =
    typeof answer?.value === 'object' && answer.value !== null
      ? (answer.value as Record<string, string>)
      : {}

  const rights = question.pairs.map((p) => p.right)
  const [selections, setSelections] = useState<Record<string, string>>(currentMap)

  const handleChange = (leftId: string, right: string) => {
    const next = { ...selections, [leftId]: right }
    setSelections(next)
    onAnswer(next)
  }

  const allSelected = question.pairs.every((p) => selections[p.id])

  return (
    <div className="space-y-3">
      {question.pairs.map((pair) => (
        <div
          key={pair.id}
          className="flex flex-col gap-2 rounded-lg border border-border bg-cream p-3 sm:flex-row sm:items-center"
        >
          <span className="flex-1 text-sm font-medium text-primary-dark">
            {pair.left}
          </span>
          <select
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary-dark focus:border-primary-green focus:outline-none"
            value={selections[pair.id] ?? ''}
            disabled={disabled || Boolean(answer)}
            onChange={(e) => handleChange(pair.id, e.target.value)}
          >
            <option value="">Select match…</option>
            {rights.map((right) => (
              <option key={right} value={right}>
                {right}
              </option>
            ))}
          </select>
          {answer && selections[pair.id] === pair.right ? (
            <span className="text-xs text-primary-green">✓</span>
          ) : null}
          {answer && selections[pair.id] && selections[pair.id] !== pair.right ? (
            <span className="text-xs text-gold">✗</span>
          ) : null}
        </div>
      ))}
      {!answer && allSelected ? (
        <p className="text-xs text-sage">All pairs selected — submit to check</p>
      ) : null}
    </div>
  )
}

export { isQuestionAnswered }
