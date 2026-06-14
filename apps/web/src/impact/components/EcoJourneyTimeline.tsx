import { Award, BadgeCheck, BookOpen, Gamepad2, Sparkles, Target } from 'lucide-react'
import type { ActivityTimelineItem } from '@/types/gamification'

interface EcoJourneyTimelineProps {
  items: ActivityTimelineItem[]
}

function getIcon(type: string) {
  if (type.includes('lesson')) return BookOpen
  if (type.includes('quiz')) return Sparkles
  if (type.includes('mission')) return Target
  if (type.includes('game')) return Gamepad2
  if (type.includes('badge')) return BadgeCheck
  return Award
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function EcoJourneyTimeline({ items }: EcoJourneyTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-cream p-5 text-sm text-sage">
        Complete a lesson, quiz, mission, or game to start your journey feed.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = getIcon(item.type)
        return (
          <article key={item.id} className="flex gap-3 rounded-xl border border-border bg-cream p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-green/10 text-primary-green">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-semibold text-primary-dark">{item.title}</h3>
                <span className="text-xs text-sage">{formatDate(item.date)}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-sage">{item.description}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
