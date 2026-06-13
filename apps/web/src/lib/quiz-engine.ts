import type {
  MatchQuestion,
  MultipleChoiceQuestion,
  Quiz,
  QuizAnswer,
  QuizQuestion,
  QuizSessionResult,
  ScenarioQuestion,
  TrueFalseQuestion,
} from '@/types/quiz'

export function isQuestionAnswered(
  question: QuizQuestion,
  answer: QuizAnswer | undefined,
): boolean {
  if (!answer) return false

  switch (question.type) {
    case 'multiple_choice':
    case 'scenario':
      return typeof answer.value === 'number' && answer.value >= 0
    case 'true_false':
      return answer.value === 0 || answer.value === 1
    case 'match': {
      if (typeof answer.value !== 'object' || answer.value === null) return false
      const map = answer.value as Record<string, string>
      return question.pairs.every((pair) => Boolean(map[pair.id]))
    }
  }
}

export function gradeAnswer(
  question: QuizQuestion,
  value: QuizAnswer['value'],
): boolean {
  switch (question.type) {
    case 'multiple_choice':
    case 'scenario':
      return (
        typeof value === 'number' &&
        value === (question as MultipleChoiceQuestion | ScenarioQuestion).correctIndex
      )
    case 'true_false': {
      const correct = (question as TrueFalseQuestion).correctAnswer
      return value === (correct ? 1 : 0)
    }
    case 'match': {
      if (typeof value !== 'object' || value === null) return false
      const map = value as Record<string, string>
      const q = question as MatchQuestion
      return q.pairs.every((pair) => map[pair.id] === pair.right)
    }
  }
}

export function buildQuizResult(
  quiz: Quiz,
  answers: QuizAnswer[],
  startTime: string,
  completionTime: string,
  recommendedLessonId: string,
  recommendedMissionId: string,
): QuizSessionResult {
  const questions = quiz.questions ?? []
  const correctCount = answers.filter((a) => a.isCorrect).length
  const totalQuestions = questions.length
  const accuracy =
    totalQuestions === 0 ? 0 : (correctCount / totalQuestions) * 100
  const xpEarned = correctCount * quiz.xpPerQuestion
  const score = xpEarned

  const topicResults = questions.map((q, i) => ({
    topic: q.topic,
    correct: answers[i]?.isCorrect ?? false,
  }))

  const topicMap = new Map<string, { correct: number; total: number }>()
  for (const { topic, correct } of topicResults) {
    const entry = topicMap.get(topic) ?? { correct: 0, total: 0 }
    entry.total += 1
    if (correct) entry.correct += 1
    topicMap.set(topic, entry)
  }

  const strengthAreas: string[] = []
  const improvementAreas: string[] = []

  for (const [topic, { correct, total }] of topicMap) {
    const rate = correct / total
    if (rate >= 0.67) strengthAreas.push(topic)
    else if (rate < 0.67) improvementAreas.push(topic)
  }

  const startMs = new Date(startTime).getTime()
  const endMs = new Date(completionTime).getTime()

  return {
    quizId: quiz.id,
    lessonId: quiz.lessonId,
    sdgId: quiz.sdgId,
    sdgNumber: quiz.sdgNumber,
    quizTitle: quiz.title,
    startTime,
    completionTime,
    timeTakenSeconds: Math.max(1, Math.round((endMs - startMs) / 1000)),
    correctCount,
    totalQuestions,
    score,
    accuracy,
    xpEarned,
    strengthAreas,
    improvementAreas,
    recommendedLessonId,
    recommendedMissionId,
  }
}
