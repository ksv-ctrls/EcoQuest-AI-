import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getLessonsBySdgNumber as getLessonsBySdg } from '@/data/mock/lesson-catalog'
import { mockGameTitles } from '@/data/mock/sdg'
import { SDG_CATEGORY_LABELS, type SDGGoal } from '@/types/sdg'
import { cn } from '@/lib/cn'

interface SDGCardProps {
  goal: SDGGoal
  selected?: boolean
  onSelect: (goal: SDGGoal) => void
}

export function SDGCard({ goal, selected, onSelect }: SDGCardProps) {
  const relatedLessons = getLessonsBySdg(goal.number)

  return (
    <Card
      variant="interactive"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(goal)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(goal)
        }
      }}
      className={cn(
        'cursor-pointer p-0 overflow-hidden',
        selected && 'ring-2 ring-gold border-gold/40',
      )}
    >
      <div className="h-2" style={{ backgroundColor: goal.color }} />
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Badge
            variant="sdg"
            style={{ backgroundColor: goal.color }}
            className="rounded-md px-2 py-1"
          >
            SDG {goal.number}
          </Badge>
          <span className="text-xs font-medium text-sage">
            {SDG_CATEGORY_LABELS[goal.category]}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-primary-dark">
          {goal.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-sage">
          {goal.shortDescription}
        </p>
        <p className="mt-3 text-xs text-sage">
          {relatedLessons.length} related lesson
          {relatedLessons.length === 1 ? '' : 's'}
        </p>
      </div>
    </Card>
  )
}

interface SDGGridProps {
  goals: SDGGoal[]
  selectedGoalId?: string
  onSelectGoal: (goal: SDGGoal) => void
}

export function SDGGrid({ goals, selectedGoalId, onSelectGoal }: SDGGridProps) {
  if (goals.length === 0) {
    return (
      <Card variant="elevated" className="text-center">
        <p className="text-sage">No SDGs match your search.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {goals.map((goal) => (
        <SDGCard
          key={goal.id}
          goal={goal}
          selected={selectedGoalId === goal.id}
          onSelect={onSelectGoal}
        />
      ))}
    </div>
  )
}

interface SDGDetailPanelProps {
  goal: SDGGoal | null
  onClose: () => void
}

export function SDGDetailPanel({ goal, onClose }: SDGDetailPanelProps) {
  if (!goal) return null

  const relatedLessons = getLessonsBySdg(goal.number)
  const relatedGames = goal.relatedGameIds.map((id) => ({
    id,
    title: mockGameTitles[id] ?? id,
  }))

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-primary-dark/40 lg:hidden"
        onClick={onClose}
        aria-label="Close detail panel"
      />

      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-cream shadow-2xl"
      >
        <div className="h-3" style={{ backgroundColor: goal.color }} />

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Badge
                variant="sdg"
                style={{ backgroundColor: goal.color }}
                className="mb-3 rounded-md px-2.5 py-1"
              >
                SDG {goal.number}
              </Badge>
              <h2 className="font-display text-2xl font-bold text-primary-dark">
                {goal.title}
              </h2>
              <p className="mt-1 text-sm text-sage">
                {SDG_CATEGORY_LABELS[goal.category]}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>

          <p className="text-sm leading-relaxed text-primary-dark/90">
            {goal.description}
          </p>

          <section className="mt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sage">
              Related Lessons
            </h3>
            {relatedLessons.length > 0 ? (
              <ul className="space-y-2">
                {relatedLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      to={
                        lesson.content
                          ? `/lessons/${goal.id}/${lesson.id}`
                          : `/lessons/${goal.id}`
                      }
                      className="block rounded-lg border border-border px-3 py-2 text-sm text-primary-dark transition-colors hover:border-primary-green/40"
                    >
                      {lesson.title}
                      <span className="ml-2 text-xs text-sage">
                        {lesson.durationMinutes} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-sage">
                <Link
                  to={`/lessons/${goal.id}`}
                  className="font-medium text-primary-green hover:underline"
                >
                  View SDG lessons
                </Link>
              </p>
            )}

            <Link to={`/lessons/${goal.id}`} className="mt-3 inline-block">
              <Button variant="outline" size="sm">
                All lessons for SDG {goal.number}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </section>

          <section className="mt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sage">
              Related Games
            </h3>
            {relatedGames.length > 0 ? (
              <ul className="space-y-2">
                {relatedGames.map((game) => (
                  <li
                    key={game.id}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-primary-dark"
                  >
                    {game.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-sage">Games coming soon.</p>
            )}
          </section>

          <div className="mt-8 rounded-lg border border-gold/30 bg-gold/10 p-4">
            <p className="text-sm font-medium text-primary-dark">
              AI Tutor prompt (coming soon)
            </p>
            <p className="mt-1 text-sm text-sage">
              Ask EcoQuest AI about {goal.title}
            </p>
            <Button className="mt-3" variant="gold" disabled>
              Open AI Tutor
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
