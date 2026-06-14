import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { InfographicPlaceholderList } from '@/components/lessons/InfographicPlaceholderList'
import { KnowledgeCardGrid } from '@/components/lessons/KnowledgeCardGrid'
import { useLessonProgress } from '@/context/LessonProgressContext'
import { useGamification } from '@/context/GamificationContext'
import { difficultyLabels, formatDuration, statusLabels } from '@/lib/lesson-labels'
import type { Lesson, LessonStatus } from '@/types/lesson'
import { cn } from '@/lib/cn'

interface LessonReaderProps {
  lesson: Lesson
  sdgTitle: string
  sdgColor: string
}

export function LessonReader({ lesson, sdgTitle, sdgColor }: LessonReaderProps) {
  const navigate = useNavigate()
  const { getStatus, markStarted, markInProgress, markCompleted } =
    useLessonProgress()
  const { trackLessonStart, trackLessonComplete } = useGamification()
  const status = getStatus(lesson.id)
  const content = lesson.content

  useEffect(() => {
    markStarted(lesson.id)
    trackLessonStart(lesson.id, lesson.sdgId)
  }, [lesson.id, lesson.sdgId, markStarted, trackLessonStart])

  if (!content) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/lessons/${lesson.sdgId}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary-green hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to SDG lessons
        </Link>
        <Card variant="elevated" className="text-center py-12">
          <h2 className="font-display text-xl font-semibold text-primary-dark">
            Lesson content coming soon
          </h2>
          <p className="mt-2 text-sage">
            {lesson.title} is listed in the catalog but full content is not yet
            available.
          </p>
        </Card>
      </div>
    )
  }

  const handleComplete = () => {
    markCompleted(lesson.id)
    trackLessonComplete(lesson.id, lesson.sdgId)
    navigate(`/lessons/${lesson.sdgId}`)
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => navigate(`/lessons/${lesson.sdgId}`)}
      >
        <ArrowLeft className="size-4" />
        Back to {sdgTitle}
      </Button>

      {/* Hero — Medium-inspired */}
      <header
        className="overflow-hidden rounded-2xl border border-border bg-cream shadow-lg"
        style={{
          backgroundImage: `linear-gradient(135deg, ${sdgColor}18 0%, #fbf6f0 45%, #b9915e12 100%)`,
        }}
      >
        <div className="h-1.5" style={{ backgroundColor: sdgColor }} />
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge
              variant="sdg"
              style={{ backgroundColor: sdgColor }}
              className="rounded-md px-2.5 py-1"
            >
              SDG {lesson.sdgNumber}
            </Badge>
            <span className="text-sm text-sage">{content.heroSubtitle}</span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-primary-dark sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-dark/80">
            {content.summary}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-sage">
            <span>{formatDuration(lesson.durationMinutes)} read</span>
            <span>·</span>
            <span>{difficultyLabels[lesson.difficulty]}</span>
            <span>·</span>
            <StatusPill status={status} />
          </div>
        </div>
      </header>

      <div className="mt-10 space-y-10">
        <ReaderSection title="Learning objectives" notionStyle>
          <ul className="space-y-3">
            {content.objectives.map((objective) => (
              <li
                key={objective}
                className="flex gap-3 rounded-lg border border-border bg-cream px-4 py-3 text-sm text-primary-dark"
              >
                <Circle className="mt-0.5 size-4 shrink-0 text-primary-green" />
                {objective}
              </li>
            ))}
          </ul>
        </ReaderSection>

        <ReaderSection title="Key concepts">
          <div className="space-y-3">
            {content.keyConcepts.map((concept) => (
              <Card key={concept.term} variant="elevated" className="p-4">
                <p className="font-display font-semibold text-primary-dark">
                  {concept.term}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-sage">
                  {concept.definition}
                </p>
              </Card>
            ))}
          </div>
        </ReaderSection>

        <ReaderSection
          title="Interactive knowledge cards"
          subtitle="Tap each card to expand — Duolingo-style bite-sized learning."
        >
          <KnowledgeCardGrid
            cards={content.knowledgeCards}
            onInteract={() => markInProgress(lesson.id)}
          />
        </ReaderSection>

        <ReaderSection title="Visual guides">
          <InfographicPlaceholderList items={content.infographics} />
        </ReaderSection>

        <ReaderSection title="Reflect & discuss">
          <div className="space-y-3">
            {content.reflectionQuestions.map((question, index) => (
              <label
                key={question}
                className="block rounded-xl border border-border bg-cream p-4"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                  Question {index + 1}
                </span>
                <p className="mt-1 text-sm font-medium text-primary-dark">
                  {question}
                </p>
                <textarea
                  className="mt-3 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary-dark placeholder:text-sage focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                  rows={2}
                  placeholder="Write your reflection (saved locally in a future milestone)..."
                  onFocus={() => markInProgress(lesson.id)}
                />
              </label>
            ))}
          </div>
        </ReaderSection>

        <ReaderSection title="Key takeaways">
          <ul className="space-y-2">
            {content.keyTakeaways.map((takeaway) => (
              <li
                key={takeaway}
                className="flex gap-3 rounded-lg bg-primary-green/10 px-4 py-3 text-sm text-primary-dark"
              >
                <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
                {takeaway}
              </li>
            ))}
          </ul>
        </ReaderSection>

        <Card
          variant="elevated"
          className="border-primary-green/20 bg-linear-to-br from-primary-green/10 to-gold/10"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary-green" />
              Complete this lesson
            </CardTitle>
          </CardHeader>
          <p className="text-sm text-sage">
            Mark complete to update your SDG progress and dashboard stats.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {status === 'completed' ? (
              <Button variant="secondary" disabled>
                Lesson completed
              </Button>
            ) : (
              <Button variant="gold" onClick={handleComplete}>
                Mark as complete
              </Button>
            )}
            <Link to="/lessons">
              <Button variant="outline">Browse all lessons</Button>
            </Link>
          </div>
        </Card>
      </div>
    </article>
  )
}

function ReaderSection({
  title,
  subtitle,
  notionStyle,
  children,
}: {
  title: string
  subtitle?: string
  notionStyle?: boolean
  children: React.ReactNode
}) {
  return (
    <section>
      <h2
        className={cn(
          'font-display text-xl font-bold text-primary-dark',
          notionStyle && 'border-b border-border pb-2',
        )}
      >
        {title}
      </h2>
      {subtitle ? <p className="mt-1 text-sm text-sage">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function StatusPill({ status }: { status: LessonStatus }) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-semibold',
        status === 'completed' && 'bg-primary-green/15 text-primary-green',
        (status === 'in_progress' || status === 'started') &&
          'bg-gold/15 text-gold',
        status === 'not_started' && 'bg-sage/20 text-sage',
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
